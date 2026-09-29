"""Tests for ConnectLife appliance-card support."""

from __future__ import annotations

from hashlib import sha256
from types import SimpleNamespace

import pytest

from custom_components.connectlife.appliance_card import (
    ApplianceCardPresetStore,
    CARD_PATH,
    _control_key,
    _valid_preset_value,
)


async def test_appliance_card_preset_store_round_trip(hass):
    """Saved presets persist, update by name, and can be deleted."""
    store = ApplianceCardPresetStore(hass)
    await store.async_load()

    saved = await store.async_save(
        "device-1",
        "Everyday",
        {
            "select.washer_program": "mix",
            "switch.washer_prewash": False,
        },
    )
    assert len(saved) == 1
    preset_id = saved[0]["id"]
    assert saved[0]["entities"]["select.washer_program"] == "mix"

    updated = await store.async_save(
        "device-1",
        "everyday",
        {
            "select.washer_program": "cotton",
            "switch.washer_prewash": True,
        },
    )
    assert len(updated) == 1
    assert updated[0]["id"] == preset_id
    assert updated[0]["name"] == "everyday"
    assert updated[0]["entities"]["select.washer_program"] == "cotton"

    reloaded = ApplianceCardPresetStore(hass)
    await reloaded.async_load()
    assert reloaded.presets_for_device("device-1")[0]["id"] == preset_id

    assert await reloaded.async_delete("device-1", preset_id) == []
    assert reloaded.presets_for_device("device-1") == []


async def test_presets_are_separated_by_device_and_can_be_renamed(hass):
    store = ApplianceCardPresetStore(hass)
    await store.async_load()
    one = await store.async_save("washer", "Everyday", {"select:program": "eco"})
    two = await store.async_save("dishwasher", "Everyday", {"select:program": "auto"})
    renamed = await store.async_rename("washer", one[0]["id"], "Cottons")
    assert renamed[0]["id"] == one[0]["id"]
    assert renamed[0]["name"] == "Cottons"
    assert store.presets_for_device("dishwasher") == two
    await store.async_save("washer", "Quick", {})
    with pytest.raises(ValueError, match="already exists"):
        await store.async_rename("washer", one[0]["id"], "quick")
    with pytest.raises(KeyError):
        await store.async_rename("washer", "missing", "Other")


def test_control_keys_require_connectlife_writable_registry_metadata():
    entry = SimpleNamespace(platform="connectlife", domain="select", translation_key="program")
    assert _control_key(entry) == "select:program"
    entry.platform = "other"
    assert _control_key(entry) is None
    entry.platform = "connectlife"
    entry.domain = "sensor"
    assert _control_key(entry) is None


def test_preset_values_match_platform_types():
    assert _valid_preset_value("select", "eco")
    assert _valid_preset_value("switch", False)
    assert _valid_preset_value("number", 40.5)
    assert not _valid_preset_value("select", 1)
    assert not _valid_preset_value("switch", "off")
    assert not _valid_preset_value("number", True)
    assert not _valid_preset_value("number", float("nan"))


async def test_appliance_card_registers_versioned_lovelace_resource(hass, monkeypatch):
    """The bundled card is registered through Lovelace resources, not extra JS."""
    import custom_components.connectlife.appliance_card as appliance_card

    class FakeResourceStorageCollection:
        def __init__(self):
            self.items = [
                {
                    "id": "old",
                    "url": "/connectlife_static/connectlife-appliance-card.js?v=0.46.1",
                    "type": "module",
                },
                {
                    "id": "duplicate",
                    "url": "/connectlife_static/connectlife-appliance-card.js?v=0.46.1&duplicate=1",
                    "type": "module",
                },
            ]

        async def async_get_info(self):
            return {"resources": len(self.items)}

        def async_items(self):
            return list(self.items)

        async def async_update_item(self, item_id, updates):
            item = next(item for item in self.items if item["id"] == item_id)
            item.update({"type": updates.get("res_type", item.get("type")), "url": updates["url"]})
            return item

        async def async_delete_item(self, item_id):
            self.items = [item for item in self.items if item["id"] != item_id]

        async def async_create_item(self, data):
            item = {
                "id": "created",
                "type": data["res_type"],
                "url": data["url"],
            }
            self.items.append(item)
            return item

    resources = FakeResourceStorageCollection()
    hass.data["lovelace"] = {"resources": resources}

    await appliance_card._async_register_lovelace_resource(hass)

    build = sha256(CARD_PATH.read_bytes()).hexdigest()[:12]
    assert resources.items == [
        {
            "id": "old",
            "url": f"/connectlife_static/connectlife-appliance-card.js?v=0.46.1&build={build}",
            "type": "module",
        }
    ]


async def test_resource_is_created_once_and_build_hash_refreshes(hass, monkeypatch, tmp_path):
    import custom_components.connectlife.appliance_card as appliance_card

    class Resources:
        def __init__(self):
            self.items = []

        async def async_get_info(self):
            return {"resources": len(self.items)}

        def async_items(self):
            return list(self.items)

        async def async_create_item(self, data):
            self.items.append({"id": "one", "type": data["res_type"], "url": data["url"]})

        async def async_update_item(self, item_id, data):
            self.items[0].update({"type": data["res_type"], "url": data["url"]})

        async def async_delete_item(self, item_id):
            raise AssertionError("No duplicate should exist")

    resources = Resources()
    asset = tmp_path / "card.js"
    asset.write_text("first")
    monkeypatch.setattr(appliance_card, "CARD_PATH", asset)
    hass.data["lovelace"] = {"resources": resources}
    await appliance_card._async_register_lovelace_resource(hass)
    original_url = resources.items[0]["url"]
    await appliance_card._async_register_lovelace_resource(hass)
    assert len(resources.items) == 1
    assert resources.items[0]["url"] == original_url
    asset.write_text("second")
    await appliance_card.async_refresh_appliance_card_resource(hass)
    assert len(resources.items) == 1
    assert resources.items[0]["url"] != original_url
    assert "v=0.46.1&build=" in resources.items[0]["url"]
