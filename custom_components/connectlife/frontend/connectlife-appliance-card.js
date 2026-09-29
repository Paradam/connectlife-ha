const VERSION = "0.3.0";
const LEGACY_STORAGE_PREFIX = "connectlife-appliance-card:v1:";

const PROFILE_DEFS = {
  washer: {
    label: "Washing machine",
    icon: "mdi:washing-machine",
    detect: [
      "washing_machine", "washing machine", "selected_program_washing",
      "spin_speed", "spin speed", "softener", "prewash", "add_clothes"
    ],
    slots: {
      status: [
        ["machine_status", "machine status"],
        ["status"],
      ],
      phase: [
        ["current_program_phase", "current program phase"],
        ["current_washing_program_phase", "current washing program phase"],
        ["current_washing_program_phase_status"],
      ],
      program: [
        ["selected_program_id_status"],
        ["selected_program_id", "selected program id"],
        ["selected_program", "selected program"],
      ],
      remaining: [
        ["selected_program_remaining_time_in_minutes"],
        ["remaining_time_of_selected_program"],
        ["remaining time"],
      ],
      total: [
        ["selected_program_duration_in_minutes"],
        ["selected_program_total_time_in_minutes"],
        ["selected_program_total_running_time_in_minutes"],
      ],
      temperature: [
        ["selected_program_set_temperature_status"],
        ["temperature"],
      ],
      spin: [
        ["selected_program_washing_spin_speed_rpm_status"],
        ["spin_speed_rpm", "spin speed"],
      ],
      mode: [
        ["selected_program_mode_status"],
        ["selected_program_mode2_status"],
        ["drymodel", "cycle mode"],
      ],
      delayMode: [
        ["delaystart_delayend_mode_status"],
      ],
      delayRemaining: [
        ["delaystart_delayend_remaining_time_in_minutes"],
        ["delay_start_remaining_time_in_minutes"],
      ],
      door: [
        ["door_status", "door status"],
      ],
      energy: [
        ["daily_energy_kwh", "daily energy"],
        ["electricit_consumption"],
      ],
      water: [
        ["daily_water_consumption", "daily water"],
        ["water_consumption"],
      ],
      detergent: [
        ["detergent_amount_status"],
        ["detergent"],
      ],
      softener: [
        ["softener_amount_status"],
        ["softener"],
      ],
      remote: [
        ["remote_control_monitoring_set_commands_actions", "remote control"],
        ["remote_control_monitoring_set_commands"],
      ],
    },
    primaryControls: ["program", "temperature", "spin", "mode"],
    optionAliases: [
      ["Prewash", "prewash"],
      ["Steam", "steam"],
      ["Extra rinse", "extra_rinse"],
      ["Rinse hold", "rinse_hold"],
      ["Anti-crease", "anticrease"],
      ["Small load", "small_load"],
      ["Water+", "water_pluse"],
      ["Time save", "time_save"],
      ["Night", "night_mode"],
      ["Cold wash", "coldwash"],
      ["Intensive", "intensive"],
    ],
    secondaryAliases: [
      ["Dry setting", "dry_time"],
      ["Extra rinses", "extrarinsenum"],
      ["Stain removal", "stain_removal"],
      ["Quicker", "quickermode"],
      ["Delay hours", "delayendtime"],
      ["Delay minutes", "delayendtime_minute"],
      ["Detergent", "detergent_amount_status"],
      ["Softener", "softener_amount_status"],
      ["Auto dose", "autodose"],
      ["Dose assist", "dose_assist"],
      ["Drum light", "drum_light"],
      ["Child lock", "child_lock"],
      ["Sound", "sound_setting"],
      ["Mute", "no_sound"],
      ["Delay", "delaystart_delayend"],
    ],
    alertAliases: [
      ["Detergent", "detergent_state"],
      ["Softener", "softener_state"],
      ["Error", "error_code"],
    ],
  },

  dishwasher: {
    label: "Dishwasher",
    icon: "mdi:dishwasher",
    detect: [
      "dishwasher", "rinse_aid", "rinse aid", "fill_salt", "salt_refill",
      "time_program_set_duration", "upper_wash", "lower_wash"
    ],
    slots: {
      status: [
        ["device_status", "device status"],
        ["status"],
      ],
      phase: [
        ["current_program_phase", "current program phase"],
      ],
      program: [
        ["selected_program_id_status"],
        ["selected_program_id", "selected program id"],
      ],
      remaining: [
        ["curent_program_remaining_time", "current_program_remaining_time"],
        ["remaining time"],
      ],
      total: [
        ["curent_program_duration", "current_program_duration"],
        ["program duration"],
      ],
      mode: [
        ["selected_program_mode", "program_mode"],
      ],
      timeProgram: [
        ["time_program_set_duration_status"],
      ],
      delayMode: [
        ["delay_start", "delay start"],
      ],
      delayRemaining: [
        ["delay_start_remaining_time"],
      ],
      door: [
        ["door_status", "door status"],
      ],
      energy: [
        ["daily_energy_kwh", "daily energy"],
        ["energy_consumption_in_running_program"],
      ],
      water: [
        ["daily_water_consumption", "daily water"],
        ["water_consumption_in_running_program"],
      ],
      remote: [
        ["remote_control_monitoring_set_commands_actions", "remote control"],
        ["remote_control_monitoring_set_commands"],
      ],
    },
    primaryControls: ["program", "mode", "timeProgram"],
    optionAliases: [
      ["Extra dry", "extra_drying"],
      ["Auto door", "auto_door"],
      ["High temp", "high_temperature"],
      ["Super rinse", "super_rinse"],
      ["UV", "uv_function"],
      ["Upper rack", "upper_wash"],
      ["Lower rack", "lower_wash"],
      ["Storage", "storage_function"],
      ["Speed", "speed_on_demand"],
      ["Silent", "silence_on_demand"],
    ],
    secondaryAliases: [
      ["Rinse aid", "rinse_aid_setting"],
      ["Tablet", "tab_setting"],
      ["Auto dose", "auto_dose_setting"],
      ["Child lock", "child_lock"],
      ["Interior light", "interior_light"],
      ["Energy save", "energy_save"],
      ["Water save", "water_save"],
      ["Sound", "notification_volumen"],
      ["Delay", "delay_start"],
    ],
    alertAliases: [
      ["Rinse aid", "rinse_aid_refill"],
      ["Salt", "salt_refill"],
      ["Salt", "fill_salt"],
      ["Clean filter", "clean_the_filters"],
      ["Auto dose", "auto_dose_refill"],
    ],
  },

  generic: {
    label: "ConnectLife appliance",
    icon: "mdi:home-automation",
    detect: [],
    slots: {},
    primaryControls: [],
    optionAliases: [],
    secondaryAliases: [],
    alertAliases: [],
  },
};

const ACTION_ALIASES = {
  start: ["start"],
  pause: ["pause"],
  resume: ["resume", "continue"],
  stop: ["stop"],
  cancel: ["cancel"],
  add: ["stop_add_go", "add_clothes", "add clothes"],
};

class ConnectLifeApplianceCard extends HTMLElement {
  static getStubConfig() {
    return {
      type: "custom:connectlife-appliance-card",
      device_id: "",
      profile: "auto",
      show_consumption: true,
      show_secondary: true,
      presets: [],
    };
  }

  static async getConfigElement() {
    return document.createElement("connectlife-appliance-card-editor");
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = null;
    this._config = null;
    this._device = null;
    this._entities = [];
    this._entityById = new Map();
    this._slots = {};
    this._profileName = "generic";
    this._busy = new Set();
    this._renderPending = false;
    this._presetDialogOpen = false;
    this._toast = "";
    this._lastDiscoverySignature = "";
    this._storedPresets = [];
    this._presetsLoadedFor = null;
    this._presetLoadPromise = null;
  }

  setConfig(config) {
    if (!config) {
      throw new Error("Invalid ConnectLife Appliance Card configuration");
    }
    const previousDeviceId = this._config?.device_id;
    this._config = {
      device_id: "",
      profile: "auto",
      show_consumption: true,
      show_secondary: true,
      presets: [],
      ...config,
    };
    if (previousDeviceId !== this._config.device_id) {
      this._storedPresets = [];
      this._presetsLoadedFor = null;
      this._presetLoadPromise = null;
    }
    this._lastDiscoverySignature = "";
    this._discover(true);
    this._ensureStoredPresets();
    this._render();
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    this._discover(first);
    this._ensureStoredPresets();

    const active = this.shadowRoot?.activeElement;
    if (!first && active?.matches?.("select,input,button,ha-switch")) {
      this._renderPending = true;
      return;
    }

    this._renderPending = false;
    this._render();
  }

  getCardSize() {
    return this._profileName === "generic" ? 5 : 6;
  }

  _flushPendingRender() {
    if (!this._renderPending) return;
    this._renderPending = false;
    this._render();
  }

  _discover(force = false) {
    if (!this._hass || !this._config?.device_id) return;

    this._device = this._hass.devices?.[this._config.device_id] || null;
    const rows = Object.entries(this._hass.states)
      .filter(([entityId]) => this._hass.entities?.[entityId]?.device_id === this._config.device_id)
      .map(([entityId, state]) => {
        const reg = this._hass.entities?.[entityId] || {};
        return {
          entityId,
          state,
          reg,
          domain: entityId.split(".")[0],
          name: reg.name || state.attributes?.friendly_name || reg.translation_key || entityId,
          key: this._keyFor(entityId, state, reg),
          unavailable: ["unavailable", "unknown"].includes(state.state),
          category: reg.entity_category || state.attributes?.entity_category || null,
        };
      })
      .filter((e) => e.reg.disabled_by == null);

    const signature = rows
      .map((e) => `${e.entityId}:${e.state.state}:${(e.state.attributes?.options || []).join("|")}`)
      .join(";");
    if (!force && signature === this._lastDiscoverySignature) {
      this._entities.forEach((old) => {
        const fresh = this._hass.states[old.entityId];
        if (fresh) {
          old.state = fresh;
          old.unavailable = ["unavailable", "unknown"].includes(fresh.state);
        }
      });
      return;
    }

    this._lastDiscoverySignature = signature;
    this._entities = rows;
    this._entityById = new Map(rows.map((e) => [e.entityId, e]));
    this._profileName = this._detectProfile();
    this._slots = this._buildSlots(PROFILE_DEFS[this._profileName]);
  }

  _keyFor(entityId, state, reg) {
    return String(
      reg.translation_key ||
      state.attributes?.translation_key ||
      reg.original_name ||
      state.attributes?.friendly_name ||
      entityId
    )
      .toLowerCase()
      .replaceAll("-", "_")
      .replace(/\s+/g, "_");
  }

  _detectProfile() {
    if (this._config?.profile && this._config.profile !== "auto") {
      return PROFILE_DEFS[this._config.profile] ? this._config.profile : "generic";
    }

    const haystack = [
      this._device?.name_by_user,
      this._device?.name,
      this._device?.model,
      ...this._entities.flatMap((e) => [e.key, e.entityId, e.name]),
    ].filter(Boolean).join(" ").toLowerCase();

    let best = "generic";
    let bestScore = 0;
    for (const name of ["washer", "dishwasher"]) {
      const score = PROFILE_DEFS[name].detect.reduce(
        (sum, token) => sum + (haystack.includes(token.toLowerCase().replaceAll(" ", "_")) || haystack.includes(token.toLowerCase()) ? 1 : 0),
        0
      );
      if (score > bestScore) {
        best = name;
        bestScore = score;
      }
    }
    return bestScore ? best : "generic";
  }

  _find(patternGroups, domains = null, categoryAllowed = true) {
    for (const group of patternGroups || []) {
      const patterns = group.map((p) => String(p).toLowerCase().replaceAll("-", "_").replace(/\s+/g, "_"));
      const exact = this._entities.find((e) => {
        if (domains && !domains.includes(e.domain)) return false;
        if (!categoryAllowed && e.category) return false;
        return patterns.some((p) => e.key === p || e.entityId.split(".")[1] === p);
      });
      if (exact) return exact;

      const partial = this._entities.find((e) => {
        if (domains && !domains.includes(e.domain)) return false;
        if (!categoryAllowed && e.category) return false;
        return patterns.some((p) => e.key.includes(p) || e.entityId.includes(p));
      });
      if (partial) return partial;
    }
    return null;
  }

  _buildSlots(profile) {
    const domainsBySlot = {
      status: ["sensor", "binary_sensor"],
      phase: ["sensor"],
      program: ["select"],
      remaining: ["sensor"],
      total: ["sensor"],
      temperature: ["select", "number"],
      spin: ["select", "number"],
      mode: ["select"],
      timeProgram: ["select", "number"],
      delayMode: ["select", "switch", "number"],
      delayRemaining: ["sensor"],
      door: ["sensor", "binary_sensor"],
      energy: ["sensor"],
      water: ["sensor"],
      detergent: ["select", "sensor"],
      softener: ["select", "sensor"],
      remote: ["sensor", "binary_sensor", "switch"],
    };

    const slots = {};
    for (const [slot, groups] of Object.entries(profile.slots || {})) {
      slots[slot] = this._find(groups, domainsBySlot[slot] || null);
    }
    return slots;
  }

  _findAliasEntity(alias) {
    const p = String(alias).toLowerCase().replaceAll("-", "_").replace(/\s+/g, "_");
    const preferred = this._entities.find((e) =>
      !e.category &&
      ["switch", "select", "number", "input_boolean"].includes(e.domain) &&
      (e.key === p || e.entityId.endsWith(`.${p}`))
    );
    if (preferred) return preferred;
    return this._entities.find((e) =>
      ["switch", "select", "number", "input_boolean"].includes(e.domain) &&
      (e.key.includes(p) || e.entityId.includes(p))
    ) || null;
  }

  _findAction(name) {
    const aliases = ACTION_ALIASES[name] || [name];

    const button = this._entities.find((e) =>
      e.domain === "button" && !e.unavailable &&
      aliases.some((a) => e.key === a || e.key.includes(a) || e.entityId.includes(a))
    );
    if (button) return { kind: "button", entity: button };

    const actionSelect = this._entities.find((e) =>
      e.domain === "select" && !e.unavailable &&
      (e.key === "actions" || e.key.endsWith("_actions") || e.entityId.endsWith(".actions"))
    );
    if (actionSelect) {
      const options = actionSelect.state.attributes?.options || [];
      const option = options.find((o) =>
        aliases.some((a) => String(o).toLowerCase().replaceAll(" ", "_") === a)
      );
      if (option) return { kind: "select", entity: actionSelect, option };
    }

    return null;
  }

  _state(entity) {
    if (!entity) return null;
    return this._hass?.states?.[entity.entityId] || entity.state || null;
  }

  _value(entity, fallback = "—") {
    const s = this._state(entity);
    if (!s || ["unavailable", "unknown"].includes(s.state)) return fallback;
    return s.state;
  }

  _display(entity, fallback = "—") {
    const s = this._state(entity);
    if (!s || ["unavailable", "unknown"].includes(s.state)) return fallback;
    const unit = s.attributes?.unit_of_measurement;
    return unit ? `${this._humanize(s.state)} ${unit}` : this._humanize(s.state);
  }

  _humanize(value) {
    if (value == null) return "—";
    const s = String(value);
    if (!s.includes("_")) return s;
    return s
      .split("_")
      .filter(Boolean)
      .map((part, i) => {
        if (/^\d+$/.test(part)) return part;
        if (/^(rpm|uv|eco)$/i.test(part)) return part.toUpperCase();
        if (i === 0) return part.charAt(0).toUpperCase() + part.slice(1);
        return part;
      })
      .join(" ");
  }

  _minutes(entity) {
    const s = this._state(entity);
    if (!s || ["unknown", "unavailable"].includes(s.state)) return null;
    const value = Number(s.state);
    if (!Number.isFinite(value) || value < 0 || value >= 65535) return null;
    const unit = String(s.attributes?.unit_of_measurement || "min").toLowerCase();
    if (unit.startsWith("h")) return value * 60;
    if (unit.startsWith("s")) return value / 60;
    return value;
  }

  _formatMinutes(minutes) {
    if (minutes == null) return "—";
    const rounded = Math.max(0, Math.round(minutes));
    const h = Math.floor(rounded / 60);
    const m = rounded % 60;
    if (!h) return `${m} min`;
    if (!m) return `${h} h`;
    return `${h} h ${String(m).padStart(2, "0")} min`;
  }

  _finishTime(minutes) {
    if (minutes == null) return "—";
    const now = new Date();
    const finish = new Date(now.getTime() + minutes * 60000);
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
      weekday: finish.getDate() !== now.getDate() ? "short" : undefined,
    }).format(finish);
  }

  _progress() {
    const remaining = this._minutes(this._slots.remaining);
    const total = this._minutes(this._slots.total);
    if (remaining == null || total == null || total <= 0) return null;
    return Math.max(0, Math.min(100, ((total - remaining) / total) * 100));
  }

  _statusKind() {
    const raw = `${this._value(this._slots.status, "")} ${this._value(this._slots.phase, "")}`.toLowerCase();
    if (/error|alarm|fault|problem/.test(raw)) return "error";
    if (/pause/.test(raw)) return "paused";
    if (/finished|complete|done|end/.test(raw)) return "done";
    if (/running|wash|rinse|spin|drain|dry|heat/.test(raw)) return "running";
    if (/program_select|standby|idle|off/.test(raw)) return "idle";
    return "neutral";
  }

  _statusText() {
    const phase = this._value(this._slots.phase, "");
    const status = this._value(this._slots.status, "");
    if (phase && !/^(0|unknown|unavailable)$/i.test(phase)) return this._humanize(phase);
    if (status) return this._humanize(status);
    return "Ready";
  }

  _isOn(entity) {
    const state = this._value(entity, "").toLowerCase();
    return ["on", "true", "active", "enabled", "yes", "1", "2"].includes(state);
  }

  _esc(v) {
    return String(v ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  async _call(domain, service, data) {
    return this._hass.callService(domain, service, data);
  }

  async _setEntity(entity, value) {
    if (!entity || entity.unavailable) return;
    const id = entity.entityId;
    this._busy.add(id);
    this._render();
    try {
      if (entity.domain === "select") {
        await this._call("select", "select_option", { entity_id: id, option: String(value) });
      } else if (entity.domain === "switch") {
        await this._call("switch", value ? "turn_on" : "turn_off", { entity_id: id });
      } else if (entity.domain === "input_boolean") {
        await this._call("input_boolean", value ? "turn_on" : "turn_off", { entity_id: id });
      } else if (entity.domain === "number" || entity.domain === "input_number") {
        await this._call(entity.domain, "set_value", { entity_id: id, value: Number(value) });
      }
    } finally {
      this._busy.delete(id);
    }
  }

  async _runAction(action) {
    if (!action) return;
    const id = action.entity.entityId;
    this._busy.add(id);
    this._render();
    try {
      if (action.kind === "button") {
        await this._call("button", "press", { entity_id: id });
      } else {
        await this._call("select", "select_option", { entity_id: id, option: action.option });
      }
    } finally {
      this._busy.delete(id);
    }
  }

  _moreInfo(entity) {
    if (!entity) return;
    this.dispatchEvent(new CustomEvent("hass-more-info", {
      detail: { entityId: entity.entityId },
      bubbles: true,
      composed: true,
    }));
  }

  _profile() {
    return PROFILE_DEFS[this._profileName] || PROFILE_DEFS.generic;
  }

  _controlForSlot(slot, label, icon) {
    const e = this._slots[slot];
    if (!e || e.unavailable) return "";
    if (!["select", "number", "input_number"].includes(e.domain)) return "";

    const s = this._state(e);
    const busy = this._busy.has(e.entityId);

    if (e.domain === "select") {
      const options = s.attributes?.options || [];
      const validOptions = options.filter((o) => !/^not_available$/i.test(String(o)));
      if (!validOptions.length) return "";
      return `
        <label class="dial-control ${busy ? "busy" : ""}">
          <span class="dial-icon"><ha-icon icon="${this._esc(icon)}"></ha-icon></span>
          <span class="dial-copy">
            <span class="dial-label">${this._esc(label)}</span>
            <select data-select="${this._esc(e.entityId)}" ${busy ? "disabled" : ""}>
              ${validOptions.map((o) => `<option value="${this._esc(o)}" ${String(o) === String(s.state) ? "selected" : ""}>${this._esc(this._humanize(o))}</option>`).join("")}
            </select>
          </span>
          <ha-icon class="chevron" icon="mdi:chevron-down"></ha-icon>
        </label>`;
    }

    const min = s.attributes?.min ?? "";
    const max = s.attributes?.max ?? "";
    const step = s.attributes?.step ?? 1;
    return `
      <label class="dial-control ${busy ? "busy" : ""}">
        <span class="dial-icon"><ha-icon icon="${this._esc(icon)}"></ha-icon></span>
        <span class="dial-copy">
          <span class="dial-label">${this._esc(label)}</span>
          <input data-number="${this._esc(e.entityId)}" type="number" value="${this._esc(s.state)}" min="${this._esc(min)}" max="${this._esc(max)}" step="${this._esc(step)}" ${busy ? "disabled" : ""}>
        </span>
      </label>`;
  }

  _optionEntities() {
    const used = new Set(
      Object.values(this._slots)
        .filter(Boolean)
        .map((e) => e.entityId)
    );
    const found = [];
    for (const [label, alias] of this._profile().optionAliases || []) {
      const e = this._findAliasEntity(alias);
      if (!e || used.has(e.entityId) || e.unavailable) continue;
      if (!["switch", "input_boolean"].includes(e.domain)) continue;
      used.add(e.entityId);
      found.push({ label, entity: e });
    }
    return found;
  }

  _secondaryEntities() {
    const used = new Set(
      Object.values(this._slots)
        .filter(Boolean)
        .map((e) => e.entityId)
    );
    const found = [];
    for (const [label, alias] of this._profile().secondaryAliases || []) {
      const e = this._findAliasEntity(alias);
      if (!e || used.has(e.entityId) || e.unavailable) continue;
      if (!["switch", "input_boolean", "select", "number", "input_number"].includes(e.domain)) continue;
      used.add(e.entityId);
      found.push({ label, entity: e });
    }
    return found;
  }

  _alerts() {
    const seen = new Set();
    const result = [];
    for (const [label, alias] of this._profile().alertAliases || []) {
      const p = alias.toLowerCase().replaceAll(" ", "_");
      const e = this._entities.find((row) =>
        !seen.has(row.entityId) &&
        ["binary_sensor", "sensor"].includes(row.domain) &&
        (row.key.includes(p) || row.entityId.includes(p))
      );
      if (!e || e.unavailable) continue;

      const raw = String(this._value(e, "")).toLowerCase();
      const active =
        e.domain === "binary_sensor"
          ? raw === "on"
          : !["0", "off", "false", "none", "ok", "normal", "unavailable", "unknown", ""].includes(raw);

      if (active) {
        seen.add(e.entityId);
        result.push({ label, entity: e });
      }
    }
    return result;
  }

  _actionState() {
    const kind = this._statusKind();
    if (kind === "paused") {
      return {
        primary: this._findAction("resume") || this._findAction("start"),
        primaryLabel: "Resume",
        primaryIcon: "mdi:play",
        secondary: this._findAction("stop") || this._findAction("cancel"),
      };
    }
    if (kind === "running") {
      return {
        primary: this._findAction("pause"),
        primaryLabel: "Pause",
        primaryIcon: "mdi:pause",
        secondary: this._findAction("stop") || this._findAction("cancel"),
      };
    }
    if (kind === "error") {
      return {
        primary: null,
        primaryLabel: "",
        primaryIcon: "mdi:alert-circle-outline",
        secondary: this._findAction("stop") || this._findAction("cancel"),
      };
    }
    return {
      primary: this._findAction("start"),
      primaryLabel: "Start",
      primaryIcon: "mdi:play",
      secondary: null,
    };
  }

  _legacyPresetStorageKey() {
    return `${LEGACY_STORAGE_PREFIX}${this._config.device_id}`;
  }

  _legacyLocalPresets() {
    try {
      const parsed = JSON.parse(localStorage.getItem(this._legacyPresetStorageKey()) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  async _ensureStoredPresets() {
    const deviceId = this._config?.device_id;
    if (!this._hass || !deviceId || this._presetsLoadedFor === deviceId || this._presetLoadPromise) return;

    this._presetsLoadedFor = deviceId;
    this._storedPresets = [];
    const request = this._hass.callWS({
      type: "connectlife/appliance_card/presets/list",
      device_id: deviceId,
    });
    this._presetLoadPromise = request;

    try {
      const result = await request;
      if (this._config?.device_id !== deviceId) return;
      this._storedPresets = Array.isArray(result?.presets) ? result.presets : [];
      await this._migrateLegacyPresets(deviceId);
    } catch (err) {
      if (this._config?.device_id === deviceId) {
        this._toast = `Could not load saved presets: ${err?.message || err}`;
      }
    } finally {
      if (this._presetLoadPromise === request) this._presetLoadPromise = null;
      this._render();
    }
  }

  async _migrateLegacyPresets(deviceId) {
    if (this._config?.device_id !== deviceId) return;
    const legacy = this._legacyLocalPresets();
    if (!legacy.length) return;

    let migrated = 0;
    for (const preset of legacy) {
      if (!preset?.name || !preset?.entities || this._config?.device_id !== deviceId) continue;
      try {
        const result = await this._hass.callWS({
          type: "connectlife/appliance_card/presets/save",
          device_id: deviceId,
          name: String(preset.name),
          entities: preset.entities,
        });
        if (this._config?.device_id !== deviceId) return;
        this._storedPresets = Array.isArray(result?.presets) ? result.presets : this._storedPresets;
        migrated += 1;
      } catch {
        return;
      }
    }

    if (migrated) {
      try {
        localStorage.removeItem(this._legacyPresetStorageKey());
      } catch {
        // Browser storage can be blocked; the server-side migration is still valid.
      }
      this._toast = `Migrated ${migrated} saved preset${migrated === 1 ? "" : "s"} into Home Assistant`;
    }
  }

  _allPresets() {
    const configured = (this._config.presets || []).map((p, index) => ({
      ...p,
      _source: "config",
      _key: `config:${index}`,
    }));
    const stored = (this._storedPresets || []).map((p) => ({
      ...p,
      _source: "stored",
      _key: p.id,
    }));
    return [...configured, ...stored];
  }

  _presetControlEntities() {
    const controls = [];
    const add = (e) => {
      if (!e || e.unavailable || controls.some((x) => x.entityId === e.entityId)) return;
      if (!["select", "switch", "input_boolean", "number", "input_number"].includes(e.domain)) return;
      controls.push(e);
    };

    for (const slot of this._profile().primaryControls || []) add(this._slots[slot]);
    this._optionEntities().forEach((x) => add(x.entity));
    this._secondaryEntities().forEach((x) => add(x.entity));
    return controls;
  }

  _capturePreset(name) {
    const entities = {};
    for (const e of this._presetControlEntities()) {
      const state = this._state(e);
      if (!state || ["unknown", "unavailable"].includes(state.state)) continue;
      if (["switch", "input_boolean"].includes(e.domain)) {
        entities[e.entityId] = state.state === "on";
      } else if (["number", "input_number"].includes(e.domain)) {
        const n = Number(state.state);
        if (Number.isFinite(n)) entities[e.entityId] = n;
      } else {
        entities[e.entityId] = state.state;
      }
    }
    return { name, entities };
  }

  async _savePresetFromDialog() {
    const input = this.shadowRoot.querySelector("#preset-name");
    const name = String(input?.value || "").trim();
    if (!name) return;

    const captured = this._capturePreset(name);
    try {
      const result = await this._hass.callWS({
        type: "connectlife/appliance_card/presets/save",
        device_id: this._config.device_id,
        name,
        entities: captured.entities,
      });
      this._storedPresets = Array.isArray(result?.presets) ? result.presets : this._storedPresets;
      this._presetDialogOpen = false;
      this._toast = `Saved “${name}”`;
    } catch (err) {
      this._toast = `Could not save preset: ${err?.message || err}`;
    }
    this._render();
  }

  async _deletePreset(preset) {
    if (preset._source !== "stored" || !preset.id) return;
    try {
      const result = await this._hass.callWS({
        type: "connectlife/appliance_card/presets/delete",
        device_id: this._config.device_id,
        preset_id: preset.id,
      });
      this._storedPresets = Array.isArray(result?.presets) ? result.presets : [];
      this._toast = `Deleted “${preset.name || "preset"}”`;
    } catch (err) {
      this._toast = `Could not delete preset: ${err?.message || err}`;
    }
    this._render();
  }

  async _applyPreset(preset) {
    const entries = Object.entries(preset.entities || {});
    if (!entries.length) return;

    const priority = [
      this._slots.program?.entityId,
      this._slots.mode?.entityId,
      this._slots.temperature?.entityId,
      this._slots.spin?.entityId,
      this._slots.timeProgram?.entityId,
    ].filter(Boolean);
    entries.sort((a, b) => {
      const ai = priority.indexOf(a[0]);
      const bi = priority.indexOf(b[0]);
      return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
    });

    let skipped = 0;
    for (const [entityId, desired] of entries) {
      const freshState = this._hass.states[entityId];
      const reg = this._hass.entities?.[entityId];
      if (!freshState || reg?.device_id !== this._config.device_id) {
        skipped += 1;
        continue;
      }
      const e = this._entityById.get(entityId) || {
        entityId,
        state: freshState,
        reg: reg || {},
        domain: entityId.split(".")[0],
        unavailable: ["unknown", "unavailable"].includes(freshState.state),
      };
      if (e.unavailable) {
        skipped += 1;
        continue;
      }

      if (e.domain === "select") {
        const options = freshState.attributes?.options || [];
        if (options.length && !options.includes(String(desired))) {
          skipped += 1;
          continue;
        }
      }

      try {
        await this._setEntity(e, desired);
        const dependencyChange = entityId === this._slots.program?.entityId || entityId === this._slots.mode?.entityId;
        await new Promise((resolve) => setTimeout(resolve, dependencyChange ? 300 : 120));
      } catch {
        skipped += 1;
      }
    }

    this._toast = skipped
      ? `Applied “${preset.name}” · ${skipped} unavailable setting${skipped === 1 ? "" : "s"} skipped`
      : `Applied “${preset.name}”`;
    this._render();
  }

  _renderPresets() {
    const presets = this._allPresets();
    return `
      <div class="preset-strip">
        ${presets.map((p, i) => `
          <span class="preset-wrap">
            <button class="preset-chip" data-preset="${i}" type="button">
              <ha-icon icon="${this._esc(p.icon || "mdi:bookmark-outline")}"></ha-icon>
              <span>${this._esc(p.name || `Preset ${i + 1}`)}</span>
            </button>
            ${p._source === "stored" ? `<button class="preset-delete" data-delete-preset="${i}" type="button" title="Delete preset"><ha-icon icon="mdi:close"></ha-icon></button>` : ""}
          </span>`).join("")}
        <button class="preset-chip preset-add" data-save-preset type="button">
          <ha-icon icon="mdi:plus"></ha-icon><span>Save current</span>
        </button>
      </div>`;
  }

  _renderHero() {
    const profile = this._profile();
    const rawRemaining = this._minutes(this._slots.remaining);
    const kind = this._statusKind();
    const activeCycle = kind === "running" || kind === "paused";
    const remaining = activeCycle ? rawRemaining : null;
    const progress = activeCycle ? this._progress() : null;
    const status = this._statusText();
    const program = this._display(this._slots.program, "");
    const door = this._display(this._slots.door, "");
    const actions = this._actionState();

    const ring = progress == null
      ? `<div class="appliance-glyph"><ha-icon icon="${this._esc(profile.icon)}"></ha-icon></div>`
      : `<div class="progress-ring" style="--progress:${Math.round(progress)}"><div class="progress-inner"><ha-icon icon="${this._esc(profile.icon)}"></ha-icon><span>${Math.round(progress)}%</span></div></div>`;

    return `
      <div class="hero ${this._esc(kind)}">
        <div class="hero-top">
          <div class="title-area">
            <div class="eyebrow">${this._esc(profile.label)}</div>
            <div class="title">${this._esc(this._config.title || this._device?.name_by_user || this._device?.name || profile.label)}</div>
          </div>
          ${door ? `<button class="door-pill" data-more-slot="door" type="button"><ha-icon icon="mdi:door"></ha-icon>${this._esc(door)}</button>` : ""}
        </div>

        <div class="hero-body">
          ${ring}
          <div class="hero-copy">
            <div class="status-line">${this._esc(status)}</div>
            ${program ? `<div class="program-line">${this._esc(program)}</div>` : ""}
            ${remaining != null ? `
              <div class="time-line">
                <strong>${this._esc(this._formatMinutes(remaining))}</strong>
                <span>remaining · finishes ${this._esc(this._finishTime(remaining))}</span>
              </div>` : `<div class="time-line idle-copy"><span>${kind === "done" ? "Cycle complete" : "Ready when you are"}</span></div>`}
          </div>
        </div>

        ${(actions.primary || actions.secondary) ? `
          <div class="action-row">
            ${actions.primary ? `
              <button class="action primary" data-action="primary" type="button">
                <ha-icon icon="${this._esc(actions.primaryIcon)}"></ha-icon>
                <span>${this._esc(actions.primaryLabel)}</span>
              </button>` : ""}
            ${actions.secondary ? `
              <button class="action secondary" data-action="secondary" type="button">
                <ha-icon icon="mdi:stop"></ha-icon>
                <span>Stop</span>
              </button>` : ""}
            ${this._findAction("add") ? `
              <button class="action icon-only secondary" data-action="add" type="button" title="Add clothes">
                <ha-icon icon="mdi:tshirt-crew"></ha-icon>
              </button>` : ""}
          </div>` : ""}
      </div>`;
  }

  _renderPrimaryControls() {
    const controls = [];
    if (this._profileName === "washer") {
      controls.push(this._controlForSlot("program", "Program", "mdi:tshirt-crew"));
      controls.push(this._controlForSlot("temperature", "Temperature", "mdi:thermometer"));
      controls.push(this._controlForSlot("spin", "Spin", "mdi:rotate-3d-variant"));
      controls.push(this._controlForSlot("mode", "Mode", "mdi:tune-variant"));
    } else if (this._profileName === "dishwasher") {
      controls.push(this._controlForSlot("program", "Program", "mdi:dishwasher"));
      controls.push(this._controlForSlot("mode", "Mode", "mdi:tune-variant"));
      controls.push(this._controlForSlot("timeProgram", "Duration", "mdi:timer-outline"));
    } else {
      const generic = this._entities.filter(
        (e) => !e.category && !e.unavailable && ["select", "number", "input_number"].includes(e.domain)
      ).slice(0, 4);
      for (const e of generic) {
        const label = this._humanize(e.name);
        const slot = `generic-${controls.length}`;
        this._slots[slot] = e;
        controls.push(this._controlForSlot(slot, label, e.state.attributes?.icon || "mdi:tune"));
      }
    }

    const html = controls.filter(Boolean).join("");
    if (!html) return "";
    return `<div class="control-grid">${html}</div>`;
  }

  _renderOptions() {
    const options = this._optionEntities();
    if (!options.length) return "";

    return `
      <div class="section-block">
        <div class="section-title">Options</div>
        <div class="option-grid">
          ${options.map(({ label, entity }) => `
            <button class="option-chip ${this._isOn(entity) ? "active" : ""}" data-toggle="${this._esc(entity.entityId)}" type="button" ${this._busy.has(entity.entityId) ? "disabled" : ""}>
              <ha-icon icon="${this._esc(entity.state.attributes?.icon || "mdi:check-circle-outline")}"></ha-icon>
              <span>${this._esc(label)}</span>
            </button>`).join("")}
        </div>
      </div>`;
  }

  _renderSecondary() {
    if (this._config.show_secondary === false) return "";
    const rows = this._secondaryEntities();
    if (!rows.length) return "";

    return `
      <details class="more">
        <summary><span>More settings</span><ha-icon icon="mdi:chevron-down"></ha-icon></summary>
        <div class="more-body">
          ${rows.map(({ label, entity }) => this._renderSecondaryRow(label, entity)).join("")}
        </div>
      </details>`;
  }

  _renderSecondaryRow(label, e) {
    const s = this._state(e);
    if (["switch", "input_boolean"].includes(e.domain)) {
      return `
        <div class="secondary-row">
          <button class="row-info" data-more="${this._esc(e.entityId)}" type="button">
            <span>${this._esc(label)}</span>
            <small>${this._esc(this._humanize(s.state))}</small>
          </button>
          <ha-switch data-toggle="${this._esc(e.entityId)}" ${s.state === "on" ? "checked" : ""} ${this._busy.has(e.entityId) ? "disabled" : ""}></ha-switch>
        </div>`;
    }

    if (e.domain === "select") {
      const options = (s.attributes?.options || []).filter((o) => !/^not_available$/i.test(String(o)));
      return `
        <label class="secondary-row">
          <button class="row-info" data-more="${this._esc(e.entityId)}" type="button">
            <span>${this._esc(label)}</span>
          </button>
          <select class="mini-select" data-select="${this._esc(e.entityId)}" ${this._busy.has(e.entityId) ? "disabled" : ""}>
            ${options.map((o) => `<option value="${this._esc(o)}" ${String(o) === String(s.state) ? "selected" : ""}>${this._esc(this._humanize(o))}</option>`).join("")}
          </select>
        </label>`;
    }

    return `
      <label class="secondary-row">
        <button class="row-info" data-more="${this._esc(e.entityId)}" type="button"><span>${this._esc(label)}</span></button>
        <input class="mini-number" data-number="${this._esc(e.entityId)}" type="number" value="${this._esc(s.state)}" min="${this._esc(s.attributes?.min ?? "")}" max="${this._esc(s.attributes?.max ?? "")}" step="${this._esc(s.attributes?.step ?? 1)}">
      </label>`;
  }

  _renderAlerts() {
    const alerts = this._alerts();
    if (!alerts.length) return "";
    return `
      <div class="alert-strip">
        ${alerts.map((a) => `
          <button class="alert-pill" data-more="${this._esc(a.entity.entityId)}" type="button">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            <span>${this._esc(a.label)}</span>
          </button>`).join("")}
      </div>`;
  }

  _renderMetrics() {
    const metrics = [];

    const energy = this._slots.energy;
    const water = this._slots.water;
    const delay = this._slots.delayRemaining;

    if (this._config.show_consumption !== false) {
      if (energy && !energy.unavailable) metrics.push(["mdi:lightning-bolt-outline", "Energy", this._display(energy), energy]);
      if (water && !water.unavailable) metrics.push(["mdi:water-outline", "Water", this._display(water), water]);
    }
    if (delay && !delay.unavailable) metrics.push(["mdi:clock-start", "Delay", this._formatMinutes(this._minutes(delay)), delay]);

    if (!metrics.length) return "";
    return `
      <div class="metrics">
        ${metrics.map(([icon, label, value, entity]) => `
          <button class="metric" data-more="${this._esc(entity.entityId)}" type="button">
            <ha-icon icon="${this._esc(icon)}"></ha-icon>
            <span><small>${this._esc(label)}</small><strong>${this._esc(value)}</strong></span>
          </button>`).join("")}
      </div>`;
  }

  _renderGenericFallback() {
    if (this._profileName !== "generic") return "";
    const status = this._entities
      .filter((e) => !e.category && !["select", "switch", "number", "input_boolean", "button"].includes(e.domain))
      .slice(0, 6);
    const toggles = this._entities
      .filter((e) => !e.category && !e.unavailable && ["switch", "input_boolean"].includes(e.domain))
      .slice(0, 6);

    return `
      ${toggles.length ? `<div class="section-block"><div class="section-title">Controls</div><div class="option-grid">${toggles.map((e) => `<button class="option-chip ${this._isOn(e) ? "active" : ""}" data-toggle="${this._esc(e.entityId)}"><ha-icon icon="${this._esc(e.state.attributes?.icon || "mdi:toggle-switch-outline")}"></ha-icon><span>${this._esc(this._humanize(e.name))}</span></button>`).join("")}</div></div>` : ""}
      ${status.length ? `<div class="generic-status">${status.map((e) => `<button data-more="${this._esc(e.entityId)}"><span>${this._esc(this._humanize(e.name))}</span><strong>${this._esc(this._display(e))}</strong></button>`).join("")}</div>` : ""}
    `;
  }

  _renderPresetDialog() {
    if (!this._presetDialogOpen) return "";
    return `
      <div class="modal-backdrop" data-close-modal>
        <div class="modal" role="dialog" aria-modal="true" aria-label="Save preset" data-modal-body>
          <div class="modal-title">Save current settings</div>
          <div class="modal-copy">Program and relevant cycle options will be saved for this appliance.</div>
          <input id="preset-name" class="preset-name" placeholder="e.g. Everyday wash" maxlength="40">
          <div class="modal-actions">
            <button class="dialog-button" data-close-modal type="button">Cancel</button>
            <button class="dialog-button primary" data-confirm-preset type="button">Save preset</button>
          </div>
          <div class="modal-note">Saved presets are stored by Home Assistant for this appliance and are available from every dashboard client.</div>
        </div>
      </div>`;
  }

  _styles() {
    return `
      :host{display:block}
      *{box-sizing:border-box}
      ha-card{overflow:hidden;background:var(--ha-card-background,var(--card-background-color));color:var(--primary-text-color)}
      button,select,input{font:inherit}
      button{color:inherit}
      .hero{padding:20px 20px 18px;background:
        radial-gradient(circle at 92% 0%,color-mix(in srgb,var(--primary-color) 13%,transparent),transparent 36%),
        var(--ha-card-background,var(--card-background-color))}
      .hero.error{background:
        radial-gradient(circle at 92% 0%,color-mix(in srgb,var(--error-color,#db4437) 15%,transparent),transparent 38%),
        var(--ha-card-background,var(--card-background-color))}
      .hero.done{background:
        radial-gradient(circle at 92% 0%,color-mix(in srgb,var(--success-color,#43a047) 13%,transparent),transparent 38%),
        var(--ha-card-background,var(--card-background-color))}
      .hero-top{display:flex;gap:12px;align-items:flex-start;justify-content:space-between}
      .title-area{min-width:0}
      .eyebrow{font-size:.72rem;letter-spacing:.04em;text-transform:uppercase;color:var(--secondary-text-color);margin-bottom:3px}
      .title{font-size:1.3rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .door-pill{display:flex;align-items:center;gap:6px;border:0;border-radius:999px;padding:6px 9px;background:var(--secondary-background-color);color:var(--secondary-text-color);cursor:pointer;font-size:.78rem}
      .door-pill ha-icon{--mdc-icon-size:17px}
      .hero-body{display:grid;grid-template-columns:auto minmax(0,1fr);gap:18px;align-items:center;margin-top:18px}
      .appliance-glyph{width:88px;height:88px;border-radius:50%;display:grid;place-items:center;background:color-mix(in srgb,var(--primary-color) 10%,var(--secondary-background-color));color:var(--primary-color)}
      .appliance-glyph ha-icon{--mdc-icon-size:42px}
      .progress-ring{--progress:0;width:92px;height:92px;padding:5px;border-radius:50%;background:conic-gradient(var(--primary-color) calc(var(--progress)*1%),var(--divider-color) 0)}
      .progress-inner{width:100%;height:100%;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--ha-card-background,var(--card-background-color));gap:2px}
      .progress-inner ha-icon{--mdc-icon-size:29px;color:var(--primary-color)}
      .progress-inner span{font-size:.72rem;color:var(--secondary-text-color)}
      .status-line{font-size:1.32rem;font-weight:600}
      .program-line{margin-top:3px;color:var(--secondary-text-color);font-size:.95rem}
      .time-line{margin-top:12px;display:flex;flex-direction:column}
      .time-line strong{font-size:1.12rem}
      .time-line span{font-size:.82rem;color:var(--secondary-text-color);margin-top:2px}
      .action-row{display:flex;gap:9px;margin-top:18px}
      .action{min-height:42px;border:0;border-radius:12px;padding:0 17px;display:inline-flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;font-weight:500}
      .action.primary{background:var(--primary-color);color:var(--text-primary-color,#fff);min-width:120px}
      .action.secondary{background:var(--secondary-background-color);color:var(--primary-text-color)}
      .action.icon-only{width:44px;padding:0}
      .preset-strip{display:flex;gap:8px;overflow:auto;padding:12px 16px;border-top:1px solid var(--divider-color);scrollbar-width:none}
      .preset-strip::-webkit-scrollbar{display:none}
      .preset-wrap{display:inline-flex;position:relative;flex:0 0 auto}
      .preset-chip{min-height:36px;border:0;border-radius:18px;background:var(--secondary-background-color);padding:0 13px;display:flex;align-items:center;gap:6px;white-space:nowrap;cursor:pointer}
      .preset-chip ha-icon{--mdc-icon-size:18px;color:var(--primary-color)}
      .preset-add{border:1px dashed var(--divider-color);background:transparent}
      .preset-delete{width:23px;height:23px;border:0;border-radius:50%;padding:0;display:grid;place-items:center;background:var(--card-background-color);position:absolute;right:-6px;top:-6px;box-shadow:var(--ha-card-box-shadow,0 2px 6px rgba(0,0,0,.18));cursor:pointer}
      .preset-delete ha-icon{--mdc-icon-size:14px}
      .alert-strip{display:flex;gap:8px;overflow:auto;padding:12px 16px 0}
      .alert-pill{border:0;border-radius:10px;background:color-mix(in srgb,var(--warning-color,#ff9800) 15%,transparent);color:var(--primary-text-color);padding:8px 10px;display:flex;align-items:center;gap:7px;white-space:nowrap;cursor:pointer}
      .alert-pill ha-icon{color:var(--warning-color,#ff9800);--mdc-icon-size:19px}
      .control-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:16px}
      .dial-control{min-height:62px;border:1px solid var(--divider-color);border-radius:14px;padding:9px 10px;display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:10px;align-items:center;background:color-mix(in srgb,var(--secondary-background-color) 45%,transparent)}
      .dial-control.busy{opacity:.55}
      .dial-icon{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;background:color-mix(in srgb,var(--primary-color) 11%,transparent);color:var(--primary-color)}
      .dial-icon ha-icon{--mdc-icon-size:20px}
      .dial-copy{min-width:0;display:flex;flex-direction:column;gap:2px}
      .dial-label{font-size:.72rem;color:var(--secondary-text-color)}
      .dial-control select,.dial-control input{width:100%;min-width:0;border:0;outline:0;background:transparent;color:var(--primary-text-color);font-weight:500;padding:0;appearance:none}
      .dial-control input{appearance:auto}
      .chevron{--mdc-icon-size:18px;color:var(--secondary-text-color);pointer-events:none}
      .section-block{padding:2px 16px 16px}
      .section-title{font-size:.78rem;font-weight:600;color:var(--secondary-text-color);text-transform:uppercase;letter-spacing:.035em;margin:0 2px 9px}
      .option-grid{display:flex;flex-wrap:wrap;gap:8px}
      .option-chip{min-height:38px;border:1px solid var(--divider-color);border-radius:12px;padding:0 12px;background:transparent;display:inline-flex;align-items:center;gap:7px;cursor:pointer}
      .option-chip ha-icon{--mdc-icon-size:19px;color:var(--secondary-text-color)}
      .option-chip.active{border-color:color-mix(in srgb,var(--primary-color) 55%,var(--divider-color));background:color-mix(in srgb,var(--primary-color) 12%,transparent)}
      .option-chip.active ha-icon{color:var(--primary-color)}
      .metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;padding:0 16px 16px}
      .metric{min-width:0;border:0;border-radius:12px;background:var(--secondary-background-color);padding:10px;display:flex;gap:9px;align-items:center;text-align:left;cursor:pointer}
      .metric ha-icon{--mdc-icon-size:20px;color:var(--primary-color)}
      .metric span{min-width:0;display:flex;flex-direction:column}
      .metric small{font-size:.7rem;color:var(--secondary-text-color)}
      .metric strong{font-size:.9rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .more{border-top:1px solid var(--divider-color)}
      .more summary{list-style:none;min-height:48px;padding:0 16px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;font-weight:500}
      .more summary::-webkit-details-marker{display:none}
      .more summary ha-icon{--mdc-icon-size:20px;color:var(--secondary-text-color);transition:transform .15s ease}
      .more[open] summary ha-icon{transform:rotate(180deg)}
      .more-body{padding:0 16px 12px}
      .secondary-row{min-height:48px;display:flex;align-items:center;gap:10px}
      .row-info{min-width:0;flex:1;border:0;background:transparent;text-align:left;padding:0;display:flex;flex-direction:column;cursor:pointer}
      .row-info small{color:var(--secondary-text-color);font-size:.73rem}
      .mini-select,.mini-number{max-width:46%;min-width:112px;height:36px;border:1px solid var(--divider-color);border-radius:9px;padding:0 8px;background:var(--card-background-color);color:var(--primary-text-color)}
      .generic-status{border-top:1px solid var(--divider-color);padding:8px 16px 14px}
      .generic-status button{width:100%;min-height:42px;border:0;background:transparent;display:flex;justify-content:space-between;gap:12px;align-items:center;padding:0;text-align:left;cursor:pointer}
      .generic-status button span{color:var(--secondary-text-color)}
      .generic-status button strong{text-align:right}
      .toast{margin:0 16px 14px;border-radius:10px;background:var(--secondary-background-color);padding:9px 11px;color:var(--secondary-text-color);font-size:.82rem}
      .modal-backdrop{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.48);display:grid;place-items:center;padding:20px}
      .modal{width:min(420px,100%);border-radius:18px;padding:20px;background:var(--ha-card-background,var(--card-background-color));box-shadow:0 14px 50px rgba(0,0,0,.34)}
      .modal-title{font-size:1.15rem;font-weight:600}
      .modal-copy{margin-top:5px;color:var(--secondary-text-color);line-height:1.4}
      .preset-name{width:100%;height:44px;border:1px solid var(--divider-color);border-radius:10px;background:var(--secondary-background-color);color:var(--primary-text-color);padding:0 12px;margin-top:16px;outline:0}
      .preset-name:focus{border-color:var(--primary-color)}
      .modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}
      .dialog-button{height:38px;border:0;border-radius:10px;padding:0 14px;background:var(--secondary-background-color);cursor:pointer}
      .dialog-button.primary{background:var(--primary-color);color:var(--text-primary-color,#fff)}
      .modal-note{margin-top:14px;font-size:.72rem;color:var(--secondary-text-color);line-height:1.35}
      @media(max-width:520px){
        .hero{padding:17px 16px 15px}
        .hero-body{grid-template-columns:auto minmax(0,1fr);gap:14px}
        .appliance-glyph{width:74px;height:74px}.progress-ring{width:78px;height:78px}
        .progress-inner ha-icon{--mdc-icon-size:25px}
        .control-grid{grid-template-columns:1fr;padding:14px 12px}
        .section-block{padding-left:12px;padding-right:12px}
        .metrics{grid-template-columns:repeat(2,minmax(0,1fr));padding-left:12px;padding-right:12px}
        .preset-strip,.alert-strip{padding-left:12px;padding-right:12px}
      }
    `;
  }

  _render() {
    if (!this.shadowRoot || !this._config) return;
    if (!this._hass) {
      this.shadowRoot.innerHTML = `<ha-card><div style="padding:20px;color:var(--secondary-text-color)">Loading ConnectLife appliance…</div></ha-card>`;
      return;
    }
    if (!this._config.device_id) {
      this.shadowRoot.innerHTML = `
        <ha-card>
          <div style="display:flex;gap:14px;align-items:center;padding:22px;color:var(--primary-text-color)">
            <ha-icon icon="mdi:home-automation" style="color:var(--primary-color);--mdc-icon-size:34px"></ha-icon>
            <div>
              <div style="font-weight:600">Choose a ConnectLife appliance</div>
              <div style="margin-top:4px;color:var(--secondary-text-color);font-size:.88rem">Open the card editor and select the washing machine or dishwasher to control.</div>
            </div>
          </div>
        </ha-card>`;
      return;
    }

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>
      <ha-card>
        ${this._renderHero()}
        ${this._renderAlerts()}
        ${this._renderPresets()}
        ${this._toast ? `<div class="toast">${this._esc(this._toast)}</div>` : ""}
        ${this._renderPrimaryControls()}
        ${this._renderOptions()}
        ${this._renderMetrics()}
        ${this._renderSecondary()}
        ${this._renderGenericFallback()}
      </ha-card>
      ${this._renderPresetDialog()}
    `;

    this._bindEvents();
  }

  _bindEvents() {
    this.shadowRoot.querySelectorAll("[data-more]").forEach((el) => {
      el.addEventListener("click", () => this._moreInfo(this._entityById.get(el.dataset.more)));
    });

    this.shadowRoot.querySelectorAll("[data-more-slot]").forEach((el) => {
      el.addEventListener("click", () => this._moreInfo(this._slots[el.dataset.moreSlot]));
    });

    this.shadowRoot.querySelectorAll("[data-select]").forEach((el) => {
      el.addEventListener("change", async () => {
        const e = this._entityById.get(el.dataset.select);
        if (e) await this._setEntity(e, el.value);
      });
      el.addEventListener("blur", () => queueMicrotask(() => this._flushPendingRender()));
    });

    this.shadowRoot.querySelectorAll("[data-number]").forEach((el) => {
      el.addEventListener("change", async () => {
        const e = this._entityById.get(el.dataset.number);
        if (e) await this._setEntity(e, el.value);
      });
      el.addEventListener("blur", () => queueMicrotask(() => this._flushPendingRender()));
    });

    this.shadowRoot.querySelectorAll("[data-toggle]").forEach((el) => {
      const handler = async () => {
        const id = el.dataset.toggle;
        const e = this._entityById.get(id);
        if (!e) return;
        const checked = el.tagName === "HA-SWITCH" ? el.checked : !this._isOn(e);
        await this._setEntity(e, checked);
      };
      el.addEventListener(el.tagName === "HA-SWITCH" ? "change" : "click", handler);
      el.addEventListener("blur", () => queueMicrotask(() => this._flushPendingRender()));
    });

    const actionState = this._actionState();
    this.shadowRoot.querySelector('[data-action="primary"]')?.addEventListener("click", () => this._runAction(actionState.primary));
    this.shadowRoot.querySelector('[data-action="secondary"]')?.addEventListener("click", () => this._runAction(actionState.secondary));
    this.shadowRoot.querySelector('[data-action="add"]')?.addEventListener("click", () => this._runAction(this._findAction("add")));

    const presets = this._allPresets();
    this.shadowRoot.querySelectorAll("[data-preset]").forEach((el) => {
      el.addEventListener("click", () => {
        const p = presets[Number(el.dataset.preset)];
        if (p) this._applyPreset(p);
      });
    });
    this.shadowRoot.querySelectorAll("[data-delete-preset]").forEach((el) => {
      el.addEventListener("click", (event) => {
        event.stopPropagation();
        const p = presets[Number(el.dataset.deletePreset)];
        if (p) this._deletePreset(p);
      });
    });

    this.shadowRoot.querySelector("[data-save-preset]")?.addEventListener("click", () => {
      this._presetDialogOpen = true;
      this._render();
      queueMicrotask(() => this.shadowRoot.querySelector("#preset-name")?.focus());
    });

    this.shadowRoot.querySelectorAll("[data-close-modal]").forEach((el) => {
      el.addEventListener("click", (event) => {
        if (event.target.closest("[data-modal-body]") && !event.target.matches("[data-close-modal]")) return;
        this._presetDialogOpen = false;
        this._render();
      });
    });
    this.shadowRoot.querySelector("[data-modal-body]")?.addEventListener("click", (event) => event.stopPropagation());
    this.shadowRoot.querySelector("[data-confirm-preset]")?.addEventListener("click", () => this._savePresetFromDialog());
    this.shadowRoot.querySelector("#preset-name")?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") this._savePresetFromDialog();
      if (event.key === "Escape") {
        this._presetDialogOpen = false;
        this._render();
      }
    });
  }
}

class ConnectLifeApplianceCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config || {};
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _esc(v) {
    return String(v ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  _devices() {
    if (!this._hass) return [];
    return Object.values(this._hass.devices || {})
      .filter((device) =>
        Object.keys(this._hass.states).some(
          (entityId) =>
            this._hass.entities?.[entityId]?.device_id === device.id &&
            this._hass.entities?.[entityId]?.platform === "connectlife"
        )
      )
      .sort((a, b) =>
        String(a.name_by_user || a.name || "").localeCompare(String(b.name_by_user || b.name || ""))
      );
  }

  _changed(update) {
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: { ...(this._config || {}), ...update } },
      bubbles: true,
      composed: true,
    }));
  }

  _render() {
    if (!this._hass) return;
    const devices = this._devices();
    const profile = this._config.profile || "auto";

    this.innerHTML = `
      <style>
        .editor{display:grid;gap:16px;padding:8px 0 16px}
        label{display:grid;gap:6px}
        .switch-row{display:flex;align-items:center;justify-content:space-between;min-height:40px}
        select,input{width:100%;height:42px;box-sizing:border-box;border:1px solid var(--divider-color);border-radius:9px;padding:0 10px;font:inherit;color:var(--primary-text-color);background:var(--card-background-color)}
        .help{font-size:.84rem;line-height:1.4;color:var(--secondary-text-color)}
      </style>
      <div class="editor">
        <label>
          <span>ConnectLife appliance</span>
          <select id="device">
            <option value="">Select device</option>
            ${devices.map((d) => `<option value="${this._esc(d.id)}" ${d.id === this._config.device_id ? "selected" : ""}>${this._esc(d.name_by_user || d.name || d.id)}</option>`).join("")}
          </select>
        </label>

        <label>
          <span>Title override</span>
          <input id="title" value="${this._esc(this._config.title || "")}" placeholder="Use Home Assistant device name">
        </label>

        <label>
          <span>Appliance view</span>
          <select id="profile">
            ${[
              ["auto", "Automatic"],
              ["washer", "Washing machine"],
              ["dishwasher", "Dishwasher"],
              ["generic", "Generic ConnectLife device"],
            ].map(([value, label]) => `<option value="${value}" ${profile === value ? "selected" : ""}>${label}</option>`).join("")}
          </select>
        </label>

        <label class="switch-row">
          <span>Show energy / water</span>
          <ha-switch id="consumption" ${this._config.show_consumption !== false ? "checked" : ""}></ha-switch>
        </label>

        <label class="switch-row">
          <span>Show additional settings</span>
          <ha-switch id="secondary" ${this._config.show_secondary !== false ? "checked" : ""}></ha-switch>
        </label>

        <label class="switch-row">
        <div class="help">
          The card discovers supported controls from the selected ConnectLife device and only shows capabilities that actually exist.
          Washing machines and dishwashers receive purpose-built layouts; other device types fall back to a compact generic view. Saved presets live in Home Assistant storage.
        </div>
      </div>
    `;

    this.querySelector("#device")?.addEventListener("change", (e) => this._changed({ device_id: e.target.value }));
    this.querySelector("#title")?.addEventListener("change", (e) => this._changed({ title: e.target.value }));
    this.querySelector("#profile")?.addEventListener("change", (e) => this._changed({ profile: e.target.value }));
    this.querySelector("#consumption")?.addEventListener("change", (e) => this._changed({ show_consumption: e.target.checked }));
    this.querySelector("#secondary")?.addEventListener("change", (e) => this._changed({ show_secondary: e.target.checked }));
  }
}

if (!customElements.get("connectlife-appliance-card")) {
  customElements.define("connectlife-appliance-card", ConnectLifeApplianceCard);
}
if (!customElements.get("connectlife-appliance-card-editor")) {
  customElements.define("connectlife-appliance-card-editor", ConnectLifeApplianceCardEditor);
}

window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === "connectlife-appliance-card")) {
  window.customCards.push({
    type: "connectlife-appliance-card",
    name: "ConnectLife Appliance Card",
    description: "Purpose-built controls for ConnectLife washing machines, dishwashers, and future appliance profiles",
    preview: true,
  });
}

console.info(
  `%c CONNECTLIFE-APPLIANCE-CARD %c v${VERSION} `,
  "color:white;background:#03a9f4;font-weight:700",
  "color:#03a9f4"
);
