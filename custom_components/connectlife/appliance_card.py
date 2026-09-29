"""Frontend and preset storage for the ConnectLife appliance card."""

from __future__ import annotations

import asyncio
from copy import deepcopy
from datetime import UTC, datetime
from hashlib import sha256
import logging
import math
from pathlib import Path
from typing import Any
from uuid import uuid4

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.storage import Store

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)
LOVELACE_DOMAIN = "lovelace"

CARD_VERSION = "0.46.1"
CARD_URL = "/connectlife_static/connectlife-appliance-card.js"
CARD_PATH = Path(__file__).parent / "frontend" / "connectlife-appliance-card.js"

STORAGE_VERSION = 1
STORAGE_KEY = f"{DOMAIN}.appliance_card_presets"
DATA_PRESET_STORE = "appliance_card_preset_store"
MAX_PRESETS_PER_DEVICE = 30
MAX_PRESET_ENTITIES = 80

PRESET_VALUE = vol.Any(bool, int, float, str)
CONTROL_DOMAINS = {"select", "switch", "number"}


class ApplianceCardPresetStore:
    """Persist user-created appliance-card presets in Home Assistant storage."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the preset store."""
        self._store: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION, STORAGE_KEY, atomic_writes=True
        )
        self._data: dict[str, Any] = {"devices": {}}
        self._lock = asyncio.Lock()

    async def async_load(self) -> None:
        """Load presets from storage."""
        loaded = await self._store.async_load()
        if isinstance(loaded, dict) and isinstance(loaded.get("devices"), dict):
            self._data = loaded

    def presets_for_device(self, device_id: str) -> list[dict[str, Any]]:
        """Return a safe copy of presets for one device."""
        devices = self._data.setdefault("devices", {})
        presets = devices.get(device_id, [])
        if not isinstance(presets, list):
            return []
        return deepcopy(presets)

    async def async_save(
        self, device_id: str, name: str, entities: dict[str, Any]
    ) -> list[dict[str, Any]]:
        """Create or replace a named preset and return the updated list."""
        async with self._lock:
            devices = self._data.setdefault("devices", {})
            presets = devices.setdefault(device_id, [])
            if not isinstance(presets, list):
                presets = []
                devices[device_id] = presets

            now = datetime.now(UTC).isoformat()
            existing = next(
                (
                    preset
                    for preset in presets
                    if str(preset.get("name", "")).casefold() == name.casefold()
                ),
                None,
            )
            if existing is not None:
                existing.update(
                    {
                        "name": name,
                        "entities": deepcopy(entities),
                        "updated_at": now,
                    }
                )
            else:
                if len(presets) >= MAX_PRESETS_PER_DEVICE:
                    raise ValueError(
                        f"A maximum of {MAX_PRESETS_PER_DEVICE} presets is supported per appliance"
                    )
                presets.append(
                    {
                        "id": uuid4().hex,
                        "name": name,
                        "entities": deepcopy(entities),
                        "created_at": now,
                        "updated_at": now,
                    }
                )

            await self._store.async_save(self._data)
            return deepcopy(presets)

    async def async_delete(
        self, device_id: str, preset_id: str
    ) -> list[dict[str, Any]]:
        """Delete a preset and return the updated list."""
        async with self._lock:
            devices = self._data.setdefault("devices", {})
            presets = devices.get(device_id, [])
            if not isinstance(presets, list):
                return []

            kept = [p for p in presets if str(p.get("id", "")) != preset_id]
            if len(kept) == len(presets):
                raise KeyError(preset_id)

            if kept:
                devices[device_id] = kept
            else:
                devices.pop(device_id, None)
            await self._store.async_save(self._data)
            return deepcopy(kept)

    async def async_rename(
        self, device_id: str, preset_id: str, name: str
    ) -> list[dict[str, Any]]:
        """Rename one preset without changing its saved controls."""
        async with self._lock:
            presets = self._data.setdefault("devices", {}).get(device_id, [])
            if not isinstance(presets, list):
                raise KeyError(preset_id)
            target = next((p for p in presets if p.get("id") == preset_id), None)
            if target is None:
                raise KeyError(preset_id)
            if any(
                p is not target and str(p.get("name", "")).casefold() == name.casefold()
                for p in presets
            ):
                raise ValueError("A preset with that name already exists")
            target["name"] = name
            target["updated_at"] = datetime.now(UTC).isoformat()
            await self._store.async_save(self._data)
            return deepcopy(presets)


def _is_connectlife_device(hass: HomeAssistant, device_id: str) -> bool:
    """Return whether a HA device belongs to this integration."""
    device = dr.async_get(hass).async_get(device_id)
    if device is None:
        return False
    return any(domain == DOMAIN for domain, _identifier in device.identifiers)


def _preset_store(hass: HomeAssistant) -> ApplianceCardPresetStore:
    """Return the initialized card preset store."""
    return hass.data[DOMAIN][DATA_PRESET_STORE]


def _control_key(entry: er.RegistryEntry) -> str | None:
    """Stable frontend key for a mapped writable entity."""
    if entry.platform != DOMAIN or entry.domain not in CONTROL_DOMAINS:
        return None
    if not entry.translation_key:
        return None
    return f"{entry.domain}:{entry.translation_key}"


def _valid_preset_value(domain: str, value: Any) -> bool:
    """Accept only values supported by the target Home Assistant platform."""
    if domain == "select":
        return isinstance(value, str)
    if domain == "switch":
        return isinstance(value, bool)
    if domain == "number":
        return type(value) in (int, float) and math.isfinite(value)
    return False


@websocket_api.websocket_command(
    {
        vol.Required("type"): "connectlife/appliance_card/presets/list",
        vol.Required("device_id"): str,
    }
)
def websocket_list_presets(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """List saved presets for one ConnectLife appliance."""
    if not _is_connectlife_device(hass, msg["device_id"]):
        connection.send_error(msg["id"], "invalid_device", "Not a ConnectLife device")
        return
    connection.send_result(
        msg["id"], {"presets": _preset_store(hass).presets_for_device(msg["device_id"])}
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "connectlife/appliance_card/presets/save",
        vol.Required("device_id"): str,
        vol.Required("name"): vol.All(str, vol.Length(min=1, max=80)),
        vol.Required("entities"): vol.All(
            {str: PRESET_VALUE},
            vol.Length(max=MAX_PRESET_ENTITIES),
        ),
    }
)
@websocket_api.async_response
async def websocket_save_preset(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Save the current appliance controls as a named preset."""
    device_id = msg["device_id"]
    if not _is_connectlife_device(hass, device_id):
        connection.send_error(msg["id"], "invalid_device", "Not a ConnectLife device")
        return

    entity_registry = er.async_get(hass)
    name = msg["name"].strip()
    if not name:
        connection.send_error(msg["id"], "invalid_name", "Preset name is required")
        return
    available_keys = {
        key: entry.domain
        for entry in er.async_entries_for_device(entity_registry, device_id)
        if entry.disabled_by is None and (key := _control_key(entry)) is not None
    }
    for key, value in msg["entities"].items():
        if key not in available_keys:
            connection.send_error(
                msg["id"],
                "invalid_entity",
                f"Control {key} is not available on the selected device",
            )
            return
        if not _valid_preset_value(available_keys[key], value):
            connection.send_error(
                msg["id"], "invalid_value", f"Invalid value for control {key}"
            )
            return

    try:
        presets = await _preset_store(hass).async_save(
            device_id, name, msg["entities"]
        )
    except ValueError as err:
        connection.send_error(msg["id"], "preset_limit", str(err))
        return
    connection.send_result(msg["id"], {"presets": presets})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "connectlife/appliance_card/presets/delete",
        vol.Required("device_id"): str,
        vol.Required("preset_id"): str,
    }
)
@websocket_api.async_response
async def websocket_delete_preset(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Delete a stored appliance-card preset."""
    device_id = msg["device_id"]
    if not _is_connectlife_device(hass, device_id):
        connection.send_error(msg["id"], "invalid_device", "Not a ConnectLife device")
        return
    try:
        presets = await _preset_store(hass).async_delete(device_id, msg["preset_id"])
    except KeyError:
        connection.send_error(msg["id"], "preset_not_found", "Preset not found")
        return
    connection.send_result(msg["id"], {"presets": presets})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "connectlife/appliance_card/presets/rename",
        vol.Required("device_id"): str,
        vol.Required("preset_id"): str,
        vol.Required("name"): vol.All(str, vol.Length(min=1, max=80)),
    }
)
@websocket_api.async_response
async def websocket_rename_preset(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Rename a stored appliance-card preset."""
    device_id = msg["device_id"]
    if not _is_connectlife_device(hass, device_id):
        connection.send_error(msg["id"], "invalid_device", "Not a ConnectLife device")
        return
    try:
        name = msg["name"].strip()
        if not name:
            connection.send_error(msg["id"], "invalid_name", "Preset name is required")
            return
        presets = await _preset_store(hass).async_rename(
            device_id, msg["preset_id"], name
        )
    except KeyError:
        connection.send_error(msg["id"], "preset_not_found", "Preset not found")
        return
    except ValueError as err:
        connection.send_error(msg["id"], "preset_name_conflict", str(err))
        return
    connection.send_result(msg["id"], {"presets": presets})


async def _async_register_lovelace_resource(hass: HomeAssistant) -> None:
    """Register or update the appliance card as a Lovelace module resource.

    The bundled card is loaded as a Home Assistant Lovelace module resource.
    """
    lovelace_data = hass.data.get(LOVELACE_DOMAIN)
    if lovelace_data is None:
        _LOGGER.warning(
            "Lovelace is not available; ConnectLife appliance card resource was not registered"
        )
        return

    resources = lovelace_data.get("resources")
    if resources is None:
        _LOGGER.warning(
            "Lovelace resource registry is not available; ConnectLife appliance card resource was not registered"
        )
        return
    await resources.async_get_info()

    build = sha256(await asyncio.to_thread(CARD_PATH.read_bytes)).hexdigest()[:12]
    resource_url = f"{CARD_URL}?v={CARD_VERSION}&build={build}"
    matches = [
        item
        for item in resources.async_items()
        if str(item.get("url", "")).split("?", 1)[0] == CARD_URL
    ]

    if not hasattr(resources, "async_create_item"):
        if not any(item.get("url") == resource_url for item in matches):
            _LOGGER.warning(
                "Lovelace resources are not storage-managed; add %s as a module resource manually",
                resource_url,
            )
        return

    if matches:
        primary = matches[0]
        if primary.get("url") != resource_url or primary.get("type") != "module":
            await resources.async_update_item(
                primary["id"], {"res_type": "module", "url": resource_url}
            )
        for duplicate in matches[1:]:
            await resources.async_delete_item(duplicate["id"])
    else:
        await resources.async_create_item(
            {"res_type": "module", "url": resource_url}
        )


async def async_refresh_appliance_card_resource(hass: HomeAssistant) -> None:
    """Refresh the bundled module URL when a config entry is reloaded."""
    await _async_register_lovelace_resource(hass)


async def async_setup_appliance_card(hass: HomeAssistant) -> None:
    """Serve and register the appliance card plus its preset API."""
    hass.data.setdefault(DOMAIN, {})

    await hass.http.async_register_static_paths(
        [StaticPathConfig(CARD_URL, str(CARD_PATH), cache_headers=False)]
    )
    await _async_register_lovelace_resource(hass)

    preset_store = ApplianceCardPresetStore(hass)
    await preset_store.async_load()
    hass.data[DOMAIN][DATA_PRESET_STORE] = preset_store

    websocket_api.async_register_command(hass, websocket_list_presets)
    websocket_api.async_register_command(hass, websocket_save_preset)
    websocket_api.async_register_command(hass, websocket_delete_preset)
    websocket_api.async_register_command(hass, websocket_rename_preset)

    _LOGGER.debug("ConnectLife appliance card v%s registered", CARD_VERSION)
