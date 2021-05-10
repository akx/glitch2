class State {
  constructor(modules) {
    this.modules = modules;
    this.defs = [];
  }

  addModule(moduleName, options) {
    options = options || {};
    const moduleObj = this.modules[moduleName];
    if (!moduleObj) throw new Error('Unknown module:', moduleName);
    const defaults = moduleObj.paramDefaults || {};
    (moduleObj.params || []).forEach((param) => {
      const defaultValue = defaults[param.name];
      if (!(param.name in options) && defaultValue !== undefined) {
        options[param.name] = defaultValue;
      }
    });
    const def = {
      id: (0 | (Math.random() * 0xffffffff)).toString(36),
      module: moduleObj,
      moduleName,
      options,
      enabled: true,
      uiVisible: true,
      probability: 1,
    };
    this.defs.push(def);
    return def;
  }

  duplicateDef(def) {
    const newDef = this.addModule(def.moduleName, def.options);
    newDef.enabled = def.enabled;
    newDef.probability = def.probability;
  }

  deleteDef(def) {
    this.defs = this.defs.filter((d) => d !== def && d.id !== def);
  }

  clear() {
    this.defs = [];
  }

  moveDef(def, direction) {
    const { defs } = this;
    const idx = defs.indexOf(def);
    if (idx === -1) return;
    const [ndef] = defs.splice(idx, 1)[0];
    let newIdx = idx + direction;
    if (newIdx < 0) newIdx = 0;
    if (newIdx >= defs.length) newIdx = defs.length;
    defs.splice(newIdx, 0, ndef);
  }

  serialize() {
    const ser = {};
    ser.defs = this.defs.map((def) => ({
      id: def.id,
      moduleName: def.moduleName,
      options: def.options,
      enabled: !!def.enabled,
      probability: +def.probability,
    }));
    return JSON.stringify(ser);
  }

  unserialize(ser) {
    ser = JSON.parse(ser);
    const self = this;
    this.defs = [];
    ser.defs.forEach((serDef) => {
      let def;
      try {
        def = self.addModule(serDef.moduleName, serDef.options);
      } catch (e) {
        return;
      }
      def.id = serDef.id;
      def.enabled = serDef.enabled;
      def.probability = serDef.probability;
    });
  }

  loadFromLocalStorage(key) {
    const serialized =
      window.localStorage && window.localStorage[key || 'GlitcherState'];
    if (serialized) this.unserialize(serialized);
  }

  saveIntoLocalStorage(key) {
    if (window.localStorage) {
      window.localStorage[key || 'GlitcherState'] = this.serialize();
    }
  }
}

export default State;
