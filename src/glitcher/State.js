/* eslint-env browser */
function State(modules) {
  this.modules = modules;
  this.defs = [];
}

State.prototype.addModule = function addModule(moduleName, options) {
  options = options || {};
  const moduleObj = this.modules[moduleName];
  if (!moduleObj) throw new Error('Unknown module:', moduleName);
  const defaults = moduleObj.paramDefaults || {};
  (moduleObj.params || []).forEach((param) => {
    const defaultValue = defaults[param.name];
    if (!(param.name in options) && defaultValue !== undefined) options[param.name] = defaultValue;
  });
  const def = {
    id: (0 | (Math.random() * 0xFFFFFFFF)).toString(36),
    module: moduleObj,
    moduleName,
    options,
    enabled: true,
    probability: 1,
  };
  this.defs.push(def);
  return def;
};

State.prototype.duplicateDef = function duplicateDef(def) {
  const newDef = this.addModule(def.moduleName, def.options);
  newDef.enabled = def.enabled;
  newDef.probability = def.probability;
};

State.prototype.deleteDef = function deleteDef(def) {
  this.defs = this.defs.filter(d => (d !== def) && (d.id !== def));
};

State.prototype.clear = function clear() {
  this.defs = [];
};

State.prototype.moveDef = function moveDef(def, direction) {
  const defs = this.defs;
  const idx = defs.indexOf(def);
  if (idx === -1) return;
  def = defs.splice(idx, 1)[0];
  let newIdx = idx + direction;
  if (newIdx < 0) newIdx = 0;
  if (newIdx >= defs.length) newIdx = defs.length;
  defs.splice(newIdx, 0, def);
};

State.prototype.serialize = function serialize() {
  const ser = {};
  ser.defs = this.defs.map(def => ({
    id: def.id,
    moduleName: def.moduleName,
    options: def.options,
    enabled: !!def.enabled,
    probability: +def.probability,
  }));
  return JSON.stringify(ser);
};

State.prototype.unserialize = function unserialize(ser) {
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
};

State.prototype.loadFromLocalStorage = function loadFromLocalStorage(key) {
  const serialized = window.localStorage && window.localStorage[key || 'GlitcherState'];
  if (serialized) this.unserialize(serialized);
};

State.prototype.saveIntoLocalStorage = function saveIntoLocalStorage(key) {
  if (window.localStorage) window.localStorage[key || 'GlitcherState'] = this.serialize();
};


module.exports = State;
