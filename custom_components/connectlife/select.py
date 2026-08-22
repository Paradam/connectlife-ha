"""Provides a selector for ConnectLife."""

import logging

from homeassistant.components.select import SelectEntity, SelectEntityDescription
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .conditions import conditions_match
from .const import DOMAIN
from .coordinator import ConnectLifeCoordinator
from .dictionaries import Dictionaries, Property
from .entity import ConnectLifeEntity
from connectlife.appliance import ConnectLifeAppliance
from .utils import climate_bound_properties, device_target_overrides, has_platform

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up ConnectLife selectors."""
    coordinator = hass.data[DOMAIN][config_entry.entry_id]
    for appliance in coordinator.data.values():
        dictionary = Dictionaries.get_dictionary(appliance)
        overrides = device_target_overrides(config_entry, appliance.device_id)
        climate_bound = climate_bound_properties(appliance, dictionary, overrides)
        async_add_entities(
            ConnectLifeSelect(
                coordinator, appliance, s, dictionary.properties[s]
            )
            for s in appliance.status_list
            if has_platform(Platform.SELECT, dictionary.properties[s])
            and s not in climate_bound
        )


class ConnectLifeSelect(ConnectLifeEntity, SelectEntity):
    """Select class for ConnectLife."""

    _attr_current_option = None

    def __init__(
        self,
        coordinator: ConnectLifeCoordinator,
        appliance: ConnectLifeAppliance,
        status: str,
        dd_entry: Property,
    ):
        """Initialize the entity."""
        super().__init__(coordinator, appliance, status, Platform.SELECT)
        self.status = status
        self._unavailable_status = status
        self._unavailable_value = dd_entry.unavailable
        self._available_when = dd_entry.available_when
        # Keep the configured option sets immutable per entity. Conditional
        # option sets replace the default set while their condition matches.
        self.default_options_map = dict(dd_entry.select.options)
        self.conditional_options = list(dd_entry.select.options_when)
        self.all_options_map = dict(self.default_options_map)
        for option_set in self.conditional_options:
            self.all_options_map.update(option_set.options)
        self.options_map: dict[int, str] = {}
        self.reverse_options_map: dict[str, int] = {}
        self.unknown_value = dd_entry.select.unknown_value
        self.command_name = (
            dd_entry.select.command_name if dd_entry.select.command_name else status
        )
        self.command_adjust = dd_entry.select.command_adjust
        self._refresh_options()
        self.entity_description = SelectEntityDescription(
            key=self._attr_unique_id,
            entity_registry_visible_default=not dd_entry.hide,
            entity_registry_enabled_default=not dd_entry.optional,
            icon=dd_entry.icon,
            name=status.replace("_", " "),
            translation_key=self.to_translation_key(dd_entry.translation_key or status),
            entity_category=dd_entry.entity_category,
        )
        self._refresh_state()

    def _configured_options(self) -> dict[int, str]:
        """Return the option set that applies to the current device state."""
        status_list = self.coordinator.data[self.device_id].status_list
        for option_set in self.conditional_options:
            if conditions_match(status_list, option_set.when):
                return option_set.options
        return self.default_options_map

    def _refresh_options(self) -> None:
        """Refresh the Home Assistant option list for the current state."""
        self.options_map = dict(self._configured_options())
        self.reverse_options_map = {v: k for k, v in self.options_map.items()}
        self._attr_options = list(self.options_map.values())

    @callback
    def update_state(self):
        self._refresh_options()
        if self.status in self.coordinator.data[self.device_id].status_list:
            value = self.coordinator.data[self.device_id].status_list[self.status]
            if value == self.unknown_value:
                self._attr_current_option = None
                return
            if value in self.options_map:
                self._attr_current_option = self.options_map[value]
                return
            if value in self.all_options_map:
                # The device can briefly retain a value from the previous
                # option set while another property (for example the selected
                # program) changes. Do not offer that now-invalid value back to
                # the user as a selectable option.
                self._attr_current_option = None
                return
            str_value = str(value)
            _LOGGER.warning(
                "Got unexpected value %s for %s (%s)",
                str_value,
                self.status,
                self.nickname,
            )
            # Preserve the existing behaviour for genuinely unmapped values.
            self.options_map[value] = str_value
            self.reverse_options_map[str_value] = value
            self._attr_options = [*self._attr_options, str_value]
            self._attr_current_option = str_value

    async def async_select_option(self, option: str) -> None:
        """Change the selected option."""
        await self.async_update_device(
            {self.command_name: self.reverse_options_map[option] - self.command_adjust},
            {self.status: self.reverse_options_map[option]},
        )
