function defaults(target, defaults) {
	for (var key in defaults) {
		if (defaults.hasOwnProperty(key) && !(key in target)) {
			target[key] = defaults[key];
		}
	}
	return target;
}

module.exports = defaults;
