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
