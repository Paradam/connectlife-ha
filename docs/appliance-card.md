# ConnectLife Appliance Card

The ConnectLife integration bundles a Home Assistant-native Lovelace card for appliance control.
The JavaScript module is served automatically by the integration and registered as a versioned
Lovelace module resource. There is no separate `/config/www` copy to maintain.
The resource URL includes a build hash, so edits to the bundled card are picked up
without changing the version. Reload the browser after installing or changing
the card; reloading the ConnectLife config entry refreshes the registered URL.

## Add the card

1. Edit a Home Assistant dashboard.
2. Choose **Add card**.
3. Select **ConnectLife Appliance Card**.
4. Select the ConnectLife appliance.

The default `Automatic` view detects the appliance type. An explicit washing-machine,
dishwasher, or generic view can be chosen in the visual editor when needed.

YAML is also supported:

```yaml
type: custom:connectlife-appliance-card
device_id: YOUR_HOME_ASSISTANT_DEVICE_ID
profile: auto
show_consumption: true
show_secondary: true
```

## Design principles

The card is deliberately not an entity list. Each appliance profile describes the controls and
state that matter for normal use, while the integration's mapping remains the source of truth for
what is currently valid.

For example, program-dependent washing-machine spin, temperature, drying and option availability
continues to come from `available_when` / `options_when` in the data dictionaries. The card keeps
known controls visible when they are temporarily unavailable, disables them, and uses the entity's
current option list as the source of truth for selectable values.

### Washing machine

The washing-machine view emphasizes:

- current cycle phase, progress, remaining time and estimated finish;
- program, temperature, spin and wash/dry mode;
- context-sensitive cycle options such as prewash, steam, anti-crease, gentle dry, quiet mode,
  cold wash and intensive wash;
- less-frequent controls such as dry setting, extra rinses, stain removal, quick mode, delay,
  detergent/softener and dosing in a collapsed **More settings** area;
- Start / Pause / Resume / Stop only when the mapped action is meaningful and available;
- energy/water and door/refill/problem state without turning the card into a diagnostics screen.

### Dishwasher

The dishwasher view emphasizes:

- selected program, current phase and remaining time;
- program mode only when valid for the selected program;
- time-program duration only when the time program is selected;
- remote Start / Stop when the integration exposes those actions;
- rinse-aid, salt, filter and auto-dose warnings;
- common appliance settings under **More settings**.

## Presets

**Save current** captures the appliance controls that are relevant to the card and stores them in
Home Assistant's `.storage` through a small ConnectLife websocket API. Presets are keyed to the Home
Assistant device, so they are available from other browsers and dashboard clients.

Saving a preset with the same name updates it. Presets can also be renamed or deleted
from the card. Each setting is stored under its ConnectLife translation key, so
renaming an entity in Home Assistant does not break a preset. Applying a preset
checks current availability, select options and number limits. It applies the
program first and waits for Home Assistant to publish the new state before sending
dependent settings. Stale or invalid settings are skipped.

## Extending to more appliance types

New appliance types should be added as another profile in `frontend/connectlife-appliance-card.js`.
Profiles provide:

- detection hints;
- semantic slots for important state/controls;
- primary controls;
- compact option controls;
- secondary controls;
- warning/consumable aliases.

Shared discovery, Home Assistant service calls, action handling, presets, theming, responsive layout,
and the generic fallback do not need to be reimplemented.


## Appliance availability

Primary program controls remain visible but disabled while an appliance is offline, asleep, or otherwise not reporting controllable state. The card distinguishes this from an idle/ready appliance and automatically enables the controls again when Home Assistant reports them available.

## Display names and values

The card uses Home Assistant's ConnectLife entity translations for program names, modes and enum values whenever available, including the active Home Assistant language. Raw API values are only humanized as a fallback. The **More settings** section keeps its expanded/collapsed state across normal Home Assistant state refreshes.

## Live status and external changes

The card separates **connectivity** from the appliance's operational state. The header shows an
Online / Offline badge, while the main status follows the device status entity (for example Off,
Standby, Program select, Running, Paused or Failure) and shows the current cycle phase separately
when one is reported.

The card consumes Home Assistant state objects directly on every Lovelace update. Changes made at
the physical appliance or in the ConnectLife mobile app therefore update the card as soon as the
ConnectLife coordinator receives them. ConnectLife is intentionally polled at a 60-second cadence,
so an external change can take up to roughly one polling interval to appear. Statistics-only
sensors are not used to infer connectivity because they remain available while an appliance is
offline.
