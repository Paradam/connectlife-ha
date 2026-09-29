const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const registry = new Map();
class FakeElement {
  attachShadow() {
    this.shadowRoot = {
      innerHTML: '', activeElement: null,
      querySelector: () => null, querySelectorAll: () => [],
    };
    return this.shadowRoot;
  }
}
const context = {
  HTMLElement: FakeElement, customElements: {
    get: (name) => registry.get(name), define: (name, cls) => registry.set(name, cls),
  },
  window: {}, console: { info() {} }, setTimeout, clearTimeout, queueMicrotask,
};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../../custom_components/connectlife/frontend/connectlife-appliance-card.js'), 'utf8'), context);
const Card = registry.get('connectlife-appliance-card');

const row = (domain, key, value, attributes = {}) => ({ domain, key, value, attributes });
const fixtures = {
  washer: [
    row('sensor', 'status', 'standby'),
    row('sensor', 'current_washing_program_phase_status', 'not_available'),
    row('select', 'selected_program_id_status', 'eco_40_60', { options: ['eco_40_60', 'white_cotton'] }),
    row('select', 'selected_program_set_temperature_status', '20_c', { options: ['20_c', '40_c'] }),
    row('select', 'selected_program_washing_spin_speed_rpm_status', '600_rpm', { options: ['600_rpm', '1200_rpm'] }),
    row('switch', 'selected_program_prewash_status', 'off'),
    row('select', 'detergent_amount_status', 'auto', { options: ['off', 'auto'] }),
    row('binary_sensor', 'offline_state', 'on', { device_class: 'connectivity' }),
    row('sensor', 'daily_energy_kwh', '1.2', { unit_of_measurement: 'kWh' }),
  ],
  washer025: [
    row('sensor', 'machine_status', 'standby'),
    row('select', 'selected_program_id', 'mix', { options: ['mix', 'cotton'] }),
    row('select', 'temperature', '40', { options: ['20', '40', '60'] }),
    row('select', 'spin_speed_rpm', '800', { options: ['600', '800'] }),
    row('switch', 'prewash', 'off'),
    row('select', 'actions', 'none', { options: ['none', 'start', 'pause', 'stop'] }),
  ],
  dishwasher: [
    row('sensor', 'device_status', 'idle'),
    row('sensor', 'current_program_phase', 'program_selected'),
    row('select', 'selected_program_id_status', 'eco', { options: ['eco', 'auto', 'time_program'] }),
    row('select', 'selected_program_mode', 'normal', { options: ['normal', 'speed', 'night'] }),
    row('select', 'time_program_set_duration_status', 'unavailable', { options: ['15_min', '30_min'] }),
    row('switch', 'super_rinse_setting_status', 'off'),
    row('binary_sensor', 'rinse_aid_refill', 'off', { device_class: 'problem' }),
    row('binary_sensor', 'offline_state', 'on', { device_class: 'connectivity' }),
    row('button', 'start', 'unknown'),
  ],
};
function makeHass(profile, includeConnectivity = true) {
  const entities = {}, states = {};
  let index = 0;
  for (const item of fixtures[profile]) {
    if (!includeConnectivity && item.key === 'offline_state') continue;
    // Deliberately unrelated entity IDs: discovery must use registry keys.
    const id = `${item.domain}.renamed_${++index}`;
    entities[id] = { device_id: 'dev1', platform: 'connectlife', translation_key: item.key };
    states[id] = { entity_id: id, state: item.value, attributes: { ...item.attributes } };
  }
  return {
    entities, states, devices: { dev1: { id: 'dev1', name: 'My appliance', model: profile } },
    formatEntityState: (state, value) => ({
      eco_40_60: 'Eco 40–60', white_cotton: 'White cotton',
      program_select: 'Program select', time_care_1: 'Time Care 1',
      '20_c': '20 °C', '600_rpm': '600 RPM', uv: 'UV',
    })[value ?? state.state] || (value ?? state.state),
    localize: () => undefined,
    callWS: async () => ({ presets: [] }),
    callService: async () => {},
  };
}
function card(profile = 'washer', includeConnectivity = true) {
  const c = new Card();
  c._ensureStoredPresets = () => {};
  c.setConfig({ device_id: 'dev1', profile: 'auto' });
  c.hass = makeHass(profile, includeConnectivity);
  return c;
}
function entity(c, key) { return c._entities.find((e) => e.key === key); }
function update(c, key, value, attributes) {
  const previous = c._hass;
  const id = entity(c, key).entityId;
  const states = { ...previous.states, [id]: {
    ...previous.states[id], state: value,
    attributes: attributes || previous.states[id].attributes,
  } };
  c.hass = { ...previous, states };
}

test('card registers once and blank form needs no device', () => {
  assert.equal(typeof Card.getConfigForm, 'function');
  const stub = Card.getStubConfig();
  assert.equal(stub.type, undefined);
  assert.equal(stub.device_id, undefined);
  const schema = Card.getConfigForm().schema;
  assert.equal(schema[0].name, 'device_id');
  assert.equal(schema[0].selector.device.filter.integration, 'connectlife');
  assert.deepEqual(Array.from(schema.map((field) => field.name)),
    ['device_id', 'title', 'profile', 'show_consumption', 'show_secondary']);
  assert.equal(context.window.customCards.filter((c) => c.type === 'connectlife-appliance-card').length, 1);
  const c = new Card();
  c.hass = makeHass('washer');
  c.setConfig({});
  assert.match(c.shadowRoot.innerHTML, /Choose a ConnectLife appliance/);
});

test('hass before setConfig and setConfig before hass both discover renamed washer controls', () => {
  for (const reverse of [false, true]) {
    const c = new Card();
    c._ensureStoredPresets = () => {};
    if (reverse) c.hass = makeHass('washer');
    c.setConfig({ device_id: 'dev1' });
    if (!reverse) c.hass = makeHass('washer');
    assert.equal(c._profileName, 'washer');
    assert.equal(c._slots.program.key, 'selected_program_id_status');
    assert.match(c._renderPrimaryControls(), /data-select=/);
    assert.match(c._renderPrimaryControls(), /White cotton/);
  }
});

test('025 washer controls and action select are discovered without entity-id assumptions', () => {
  const c = card('washer025');
  assert.equal(c._profileName, 'washer');
  assert.equal(c._slots.program.key, 'selected_program_id');
  assert.equal(c._slots.temperature.key, 'temperature');
  assert.equal(c._slots.spin.key, 'spin_speed_rpm');
  assert.equal(c._findAction('start').option, 'start');
  assert.match(c._renderOptions(), /Prewash/);
  assert.match(c._renderPrimaryControls(), /40 °C/);
  assert.match(c._renderPrimaryControls(), /800 RPM/);
});

test('the visual editor delegates focus and registry updates to HA form controls', () => {
  assert.equal(Card.getConfigElement, undefined);
  assert.equal(registry.has('connectlife-appliance-card-editor'), false);
  const form = Card.getConfigForm();
  assert.equal(form.schema[0].selector.device.filter.integration, 'connectlife');
  assert.equal(form.schema[2].selector.select.options.length, 4);
  // HA owns this form instance; ordinary hass updates do not invoke card editor code.
  const c = card();
  for (let i = 0; i < 5; i++) update(c, 'status', i % 2 ? 'running' : 'standby');
  assert.equal(form.schema[0].selector.device.filter.integration, 'connectlife');
});

test('dishwasher profile resolves program, mode and secondary settings by registry key', () => {
  const c = card('dishwasher');
  assert.equal(c._profileName, 'dishwasher');
  assert.equal(c._slots.program.key, 'selected_program_id_status');
  assert.equal(c._slots.mode.key, 'selected_program_mode');
  assert.equal(c._slots.timeProgram.key, 'time_program_set_duration_status');
  assert.match(c._renderSecondary(), /aria-expanded="false"/);
  c._secondaryOpen = true;
  assert.match(c._renderSecondary(), /Super rinse/);
});

test('an unpressed HA button with unknown state remains a usable action', () => {
  const c = card('dishwasher');
  const start = c._findAction('start');
  assert.equal(start.entity.domain, 'button');
  assert.equal(start.entity.unavailable, false);
  assert.match(c._renderHero(), /data-action="primary"/);
  update(c, 'start', 'unavailable');
  assert.equal(c._findAction('start').entity.unavailable, true);
  assert.match(c._renderHero(), /data-action="primary"[^>]*disabled/);
});

test('unavailable washer controls remain visible and disabled', () => {
  const c = card();
  update(c, 'selected_program_id_status', 'unavailable');
  const html = c._renderPrimaryControls();
  assert.match(html, /Program/);
  assert.match(html, /Unavailable/);
  assert.match(html, /disabled/);
  update(c, 'selected_program_prewash_status', 'unavailable');
  assert.match(c._renderOptions(), /Prewash/);
  assert.match(c._renderOptions(), /disabled/);
});

test('online to offline and back never leaves a stale ready state', () => {
  const c = card();
  assert.equal(c._connectivityState(), 'online');
  update(c, 'offline_state', 'off');
  assert.equal(c._statusKind(), 'offline');
  assert.equal(c._statusText(), 'Offline');
  assert.match(c._renderPrimaryControls(), /disabled/);
  update(c, 'offline_state', 'on');
  assert.equal(c._connectivityState(), 'online');
  assert.equal(c._statusText(), 'Standby');
});

test('status entity supplies safe offline fallback when connectivity is not exposed', () => {
  const c = card('washer', false);
  update(c, 'status', 'unavailable');
  assert.equal(c._statusKind(), 'offline');
  assert.equal(c._statusText(), 'Offline');
});

test('standby, running and paused states update independently of cycle phase', () => {
  const c = card();
  assert.equal(c._statusKind(), 'standby');
  update(c, 'status', 'running');
  assert.equal(c._statusKind(), 'running');
  update(c, 'status', 'paused');
  assert.equal(c._statusKind(), 'paused');
  update(c, 'status', 'program_select');
  assert.equal(c._statusKind(), 'ready');
});

test('external state change renders while a card button has focus', () => {
  const c = card();
  c.shadowRoot.activeElement = { matches: (selector) => selector === 'button' };
  update(c, 'status', 'running');
  assert.match(c.shadowRoot.innerHTML, /Running/);
});

test('focused select survives hass updates while live state still refreshes', () => {
  const c = card();
  const original = c.shadowRoot.innerHTML;
  let refreshed = 0;
  c._renderLiveRegions = () => { refreshed++; };
  c.shadowRoot.activeElement = { matches: (selector) => selector === 'select,input' };
  update(c, 'status', 'running');
  assert.equal(c.shadowRoot.innerHTML, original);
  assert.equal(refreshed, 1);
  assert.equal(c._statusKind(), 'running');
  c.shadowRoot.activeElement = null;
  c._flushPendingRender();
  assert.match(c.shadowRoot.innerHTML, /Running/);
});

test('More settings expanded state survives state refreshes', () => {
  const c = card('dishwasher');
  c._secondaryOpen = true;
  update(c, 'device_status', 'running');
  assert.equal(c._secondaryOpen, true);
  assert.match(c.shadowRoot.innerHTML, /aria-expanded="true"/);
});

test('stored presets expose rename and delete actions', () => {
  const c = card();
  c._storedPresets = [{ id: 'one', name: 'Everyday', entities: {} }];
  const html = c._renderPresets();
  assert.match(html, /data-rename-preset="0"/);
  assert.match(html, /data-delete-preset="0"/);
});

test('layout responds to card width in narrow dashboard columns', () => {
  const c = card();
  assert.equal(c.getGridOptions().columns, 6);
  assert.match(c._styles(), /@container \(max-width:520px\)/);
  assert.match(c._styles(), /@container \(max-width:330px\)/);
});

test('HA formatter labels current values and select options', () => {
  const c = card();
  const program = c._slots.program;
  assert.equal(c._display(program), 'Eco 40–60');
  assert.equal(c._formatEntityValue(program, 'white_cotton'), 'White cotton');
  assert.equal(c._formatEntityValue(c._slots.temperature, '20_c'), '20 °C');
  assert.equal(c._formatEntityValue(c._slots.spin, '600_rpm'), '600 RPM');
  assert.equal(c._humanize('uv'), 'UV');
  assert.equal(c._humanize('time_care_1'), 'Time Care 1');
});

test('untranslated numeric cycle phases are not shown as raw API codes', () => {
  const c = card();
  update(c, 'current_washing_program_phase_status', '15');
  assert.equal(c._phaseText(), '');
});

test('preset capture uses stable keys and application waits for current HA options', async () => {
  const c = card();
  const saved = c._capturePreset('Normal');
  assert.equal(saved.entities['select:selected_program_id_status'], 'eco_40_60');
  assert.equal(saved.entities['switch:selected_program_prewash_status'], false);
  assert.equal(Object.keys(saved.entities).some((key) => key.includes('renamed_')), false);
  const calls = [];
  c._hass.callService = async (domain, service, data) => {
    calls.push([domain, service, data]);
    const states = { ...c._hass.states };
    const old = states[data.entity_id];
    states[data.entity_id] = { ...old, state: data.option ?? (service === 'turn_on' ? 'on' : 'off') };
    if (data.option === 'white_cotton') {
      const mode = entity(c, 'selected_program_set_temperature_status');
      states[mode.entityId] = { ...states[mode.entityId], attributes: { options: ['20_c'] } };
    }
    c.hass = { ...c._hass, states };
  };
  await c._applyPreset({ name: 'Normal', entities: {
    'select:selected_program_id_status': 'white_cotton',
    'select:selected_program_set_temperature_status': '40_c',
  } });
  assert.equal(calls.length, 1);
  assert.equal(calls[0][2].option, 'white_cotton');
  assert.match(c._toast, /1 unavailable setting/);
});
