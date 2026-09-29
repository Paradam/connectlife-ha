"""Frontend and preset storage for the ConnectLife appliance card."""

from __future__ import annotations

import asyncio
from copy import deepcopy
from datetime import UTC, datetime
import logging
from pathlib import Path
from typing import Any
from uuid import uuid4

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.components.http import StaticPathConfig
from homeassistant.components.lovelace.const import DOMAIN as LOVELACE_DOMAIN
from homeassistant.components.lovelace.resources import ResourceStorageCollection
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.storage import Store

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

CARD_VERSION = "0.3.0"
CARD_URL = "/connectlife_static/connectlife-appliance-card.js"
CARD_PATH = Path(__file__).parent / "frontend" / "connectlife-appliance-card.js"

STORAGE_VERSION = 1
STORAGE_KEY = f"{DOMAIN}.appliance_card_presets"
DATA_PRESET_STORE = "appliance_card_preset_store"
MAX_PRESETS_PER_DEVICE = 30
MAX_PRESET_ENTITIES = 80

PRESET_VALUE = vol.Any(bool, int, float, str)


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


def _is_connectlife_device(hass: HomeAssistant, device_id: str) -> bool:
    """Return whether a HA device belongs to this integration."""
    device = dr.async_get(hass).async_get(device_id)
    if device is None:
        return False
    return any(domain == DOMAIN for domain, _identifier in device.identifiers)


def _preset_store(hass: HomeAssistant) -> ApplianceCardPresetStore:
    """Return the initialized card preset store."""
    return hass.data[DOMAIN][DATA_PRESET_STORE]


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
            {cv.entity_id: PRESET_VALUE},
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
    for entity_id in msg["entities"]:
        entry = entity_registry.async_get(entity_id)
        if entry is None or entry.device_id != device_id:
            connection.send_error(
                msg["id"],
                "invalid_entity",
                f"Entity {entity_id} does not belong to the selected device",
            )
            return

    try:
        presets = await _preset_store(hass).async_save(
            device_id, msg["name"].strip(), msg["entities"]
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

    resource_url = f"{CARD_URL}?v={CARD_VERSION}"
    matches = [
        item
        for item in resources.async_items()
        if str(item.get("url", "")).split("?", 1)[0] == CARD_URL
    ]

    if not isinstance(resources, ResourceStorageCollection):
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

    _LOGGER.debug("ConnectLife appliance card v%s registered", CARD_VERSION)
