
function randomizeDef(def) {
	(def.module.params || []).forEach(function(paramDef) {
		var paramName = paramDef.name;
		var rnd = Math.random();
		if(paramDef.randomBias) {
			rnd = Math.pow(rnd, paramDef.randomBias);
		}
		if(paramDef.type == "bool") {
			def.options[paramName] = (rnd <= 0.5);
		}
		else if(paramDef.type == "num" || paramDef.type == "int") {
			var min = paramDef.min || 0;
			var max = paramDef.max || 1;
			var val = min + (rnd * (max - min));
			if(paramDef.type == "int") val = 0 | val;
			def.options[paramName] = val;
		}
	});
}

module.exports.randomizeDef = randomizeDef;
