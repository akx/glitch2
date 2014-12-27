extend = require("./lib/extend");

function Num(name, options) {
	return extend({}, {type: "num", min: 0, max: 1, step: null, name: name}, options);
}

function Int(name, options) {
	return extend({}, {type: "int", min: 0, max: 100, step: 1, name: name}, options);
}

function Bool(name, options) {
	return extend({}, {type: "bool", name: name}, options);
}

extend(module.exports, {
	num: Num, // num num num
	int: Int,
	bool: Bool
});
