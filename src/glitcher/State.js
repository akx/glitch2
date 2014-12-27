function State(modules) {
	this.modules = modules;
	this.defs = [];
}

State.prototype.addModule = function(moduleName, options) {
	options = options || {};
	var moduleObj = this.modules[moduleName];
	if(!moduleObj) throw new Error("Unknown module:", moduleName);
	var defaults = moduleObj.paramDefaults || {};
	(moduleObj.params || []).forEach(function(param) {
		var defaultValue = defaults[param.name];
		if(!(param.name in options) && defaultValue !== undefined) options[param.name] = defaultValue;
	});
	var def = {
		id: (0 | (Math.random() * 0xFFFFFFFF)).toString(36),
		module: moduleObj,
		moduleName: moduleName,
		options: options,
		enabled: true,
		probability: 1
	};
	this.defs.push(def);
	return def;
};

State.prototype.duplicateDef = function(def) {
	var newDef = this.addModule(def.moduleName, def.options);
	newDef.enabled = def.enabled;
	newDef.probability = def.probability;
};

State.prototype.deleteDef = function(def) {
	this.defs = this.defs.filter(function(d) {
		return (d !== def) && (d.id != def);
	});
};

State.prototype.clear = function() {
	this.defs = [];
};

State.prototype.moveDef = function(def, direction) {
	var defs = this.defs;
	var idx = defs.indexOf(def);
	if(idx == -1) return;
	def = defs.splice(idx, 1)[0];
	var newIdx = idx + direction;
	if(newIdx < 0) newIdx = 0;
	if(newIdx >= defs.length) newIdx = defs.length;
	defs.splice(newIdx, 0, def);
};

State.prototype.serialize = function() {
	var ser = {};
	ser.defs = this.defs.map(function(def) {
		return {
			id: def.id,
			moduleName: def.moduleName,
			options: def.options,
			enabled: !!def.enabled,
			probability: +def.probability
		};
	});
	return JSON.stringify(ser);
};

State.prototype.unserialize = function(ser) {
	ser = JSON.parse(ser);
	var self = this;
	this.defs = [];
	ser.defs.forEach(function(serDef) {
		try {
			var def = self.addModule(serDef.moduleName, serDef.options);
		} catch(e) {
			return;
		}
		def.id = serDef.id;
		def.enabled = serDef.enabled;
		def.probability = serDef.probability;
	});
};

State.prototype.loadFromLocalStorage = function(key) {
	var serialized = window.localStorage && window.localStorage[key || "GlitcherState"];
	if(serialized) this.unserialize(serialized);
};

State.prototype.saveIntoLocalStorage = function(key) {
	if(window.localStorage) window.localStorage[key || "GlitcherState"] = this.serialize();
};


module.exports = State;
