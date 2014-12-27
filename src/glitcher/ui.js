var m = require("mithril");
var Glitch = require("../libglitch");

function controller() {
	this.state = null;
}

function moduleSelector(ctrl) {
	var options = [m("option", {"value": ""}, "<< Add module... >>")];
	for(var key in Glitch.modules) {
		var module = Glitch.modules[key];
		options.push(m("option", {"value": key}, "" + (module.friendlyName || key)));
	}
	return m("div.module-selector", {key: "module-sel"}, m("select", {onchange: function(event) {
		ctrl.engine.state.addModule(event.target.value);
		event.target.value = "";
	}}, options));
}

function getParamEditor(def, paramDef) {
	var paramName = paramDef.name;
	var paramNode = m("div.param.param-" + paramDef.type, {key: paramName}, []);

	if (paramDef.type == "bool") {
		paramNode.children.push(m("label",
			m("input", {
				onclick: function () {
					def.options[paramName] = !def.options[paramName];
				}, checked: !!def.options[paramName], type: "checkbox"
			}),
			paramName
		));
	}
	if (paramDef.type == "int" || paramDef.type == "num") {
		paramNode.children.push(m("div.param-name", paramName));

		paramNode.children.push(
			m("div.slider-and-input",
				m("input", {
					oninput: function (event) {
						def.options[paramName] = event.target.valueAsNumber;
					},
					value: def.options[paramName],
					min: paramDef.min,
					max: paramDef.max,
					step: (paramDef.step !== null ? paramDef.step : 0.0001),
					type: "range"
				}),
				m("input", {
					oninput: function (event) {
						def.options[paramName] = event.target.valueAsNumber;

					},
					value: def.options[paramName],
					step: (paramDef.step !== null ? paramDef.step : 0.0001),
					type: "number"
				})
			)
		);
	}
	return paramNode;
}

function randomize(def) {
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

function moduleList(ctrl) {
	var root = m("div.module-list", {key: "module-list"});
	var state = ctrl.engine.state;
	state.defs.forEach(function(def) {
		var defNode = m("div.def-edit", {key: def.id}, [def.moduleName]);
		defNode.children.push(m("div.def-kit.button-row", [
			m("button", {onclick: function(){state.deleteDef(def);}}, "X"),
			m("button", {onclick: function(){state.moveDef(def, -1);}}, "\u2191"),
			m("button", {onclick: function(){state.moveDef(def, +1);}}, "\u2193"),
			m("button", {onclick: function(){randomize(def);}}, "\u21BB"),
			m("button", {onclick: function(){state.duplicateDef(def);}}, "+"),
		]));
		defNode.children.push(m("div.def-enable", [
			m("input", {onclick: function(){def.enabled=!def.enabled;}, checked: !!def.enabled, type: "checkbox"}),
			m("input", {
				oninput: function(event){def.probability = event.target.valueAsNumber;},
				value: def.probability,
				min: 0,
				max: 1,
				step: 0.01,
				type: "range"
			})
		]));
		var paramsNode = m("div.params");
		(def.module.params || []).forEach(function(pDef) {
			paramsNode.children.push(getParamEditor(def, pDef));
		});

		defNode.children.push(paramsNode);
		root.children.push(defNode);
	});
	return root;
}

function loadImageFromFileField(event, complete) {
	var fileReader = new FileReader();
	fileReader.onload = function(event){
		var src = event.target.result;
		var img = document.createElement("img");
		img.src = src;
		img.onload = function() {
			complete(img);
		};
	};
	fileReader.readAsDataURL(event.target.files[0]);
}

function view(ctrl) {
	if(ctrl.engine == null) return null;
	var root = m("div");
	root.children.push(m("div.button-row", {key: "state-global-buttons"},
		m("div", "State:"),
		m("button", {onclick: function(){ctrl.engine.state.loadFromLocalStorage();}}, "Load"),
		m("button", {onclick: function(){ctrl.engine.state.saveIntoLocalStorage();}}, "Save"),
		m("button", {onclick: function(){ctrl.engine.state.clear();}}, "Clear"),
		m("button", {onclick: function(){
			var d = prompt("Serialized content (copy/paste):", ctrl.engine.state.serialize());
			if(d) ctrl.engine.state.unserialize(d);
		}}, "Import/Export")
	));
	root.children.push(m("div.button-row", {key: "load-image"},
		m("label", ["Load Image: ",
			m("input", {type: "file", id: "select-image", accept: "image/*", onchange: function(event) {
				loadImageFromFileField(event, function(img) {
					ctrl.engine.sourceImage = img;
				});
			}})
		])
	));
	root.children.push(m("div.button-row", {key: "result-buttons"},
		m("button", {onclick: function(){
			var link = document.createElement("a");
            link.href = ctrl.engine.toDataURL();
            link.download = "glitch-" + (+new Date()) + ".png";
			link.target = "_blank";
			document.body.appendChild(link);
			link.click();
		}}, "Save current image")
	));
	root.children.push(m("div.button-row", {key: "state-refresh-rate"},
		m("div", "refresh rate:"),
		m("input", {type: "number", step: 1, min: 0, max: 1000, value: ctrl.engine.rate, oninput: function(){ctrl.engine.rate=0|this.value;}}),
		m("button", {onclick: function(){
			ctrl.engine.rate = 0;
			ctrl.engine.renderFrame();
		}, title: "manual refresh"}, "\u21BB")
	));

	root.children.push(moduleSelector(ctrl));
	root.children.push(moduleList(ctrl));
	root.children.push(m("div", m.trust("glitcher by <a href='https://github.com/akx'>@akx</a> / MIT license")));
	return root;

}

function init(engine) {
	var uiContainer = document.createElement("div");
	uiContainer.id = "ui-container";
	document.body.appendChild(uiContainer);
	m.startComputation();
	var ctrl = m.module(uiContainer, {controller: controller, view: view});
	ctrl.engine = engine;
	m.endComputation();
}

module.exports.init = init;
