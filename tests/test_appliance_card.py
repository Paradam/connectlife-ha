"""Tests for ConnectLife appliance-card support."""

from __future__ import annotations

from custom_components.connectlife.appliance_card import ApplianceCardPresetStore


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


async def test_appliance_card_registers_versioned_lovelace_resource(hass, monkeypatch):
    """The bundled card is registered through Lovelace resources, not extra JS."""
    import custom_components.connectlife.appliance_card as appliance_card

    class FakeResourceStorageCollection:
        def __init__(self):
            self.items = [
                {
                    "id": "old",
                    "url": "/connectlife_static/connectlife-appliance-card.js?v=0.3.0",
                    "type": "module",
                },
                {
                    "id": "duplicate",
                    "url": "/connectlife_static/connectlife-appliance-card.js?v=0.3.0&duplicate=1",
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
    monkeypatch.setattr(appliance_card, "ResourceStorageCollection", FakeResourceStorageCollection)
    hass.data["lovelace"] = {"resources": resources}

    await appliance_card._async_register_lovelace_resource(hass)

    assert resources.items == [
        {
            "id": "old",
            "url": "/connectlife_static/connectlife-appliance-card.js?v=0.3.0",
            "type": "module",
        }
    ]
