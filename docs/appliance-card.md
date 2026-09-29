# ConnectLife Appliance Card

The ConnectLife integration bundles a Home Assistant-native Lovelace card for appliance control.
The JavaScript module is served and loaded automatically when the integration starts, so there is
no separate `/config/www` copy or Lovelace resource to maintain.

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
continues to come from `available_when` / `options_when` in the data dictionaries. The card only
renders controls Home Assistant currently exposes as available and uses the entity's current option
list.

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

Saving a preset with the same name updates it. Applying a preset validates that every target entity
still belongs to the selected appliance and that select values are currently legal. Program and
mode are applied before dependent settings so conditional controls can update first.

Dashboard-defined presets remain supported:

```yaml
type: custom:connectlife-appliance-card
device_id: YOUR_DEVICE_ID
presets:
  - name: Everyday
    icon: mdi:tshirt-crew
    entities:
      select.example_program: mix
      select.example_temperature: "40"
      switch.example_prewash: false
```

The v0.3 card also migrates presets created by the earlier browser-local v0.2 prototype the first
time it successfully connects to Home Assistant's preset store.

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
