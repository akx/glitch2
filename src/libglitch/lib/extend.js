function extend() {
	var args = [].slice.call(arguments);
	var target = args.shift(), source;
	while (source = args.shift()) {
		for (var key in source) {
			if (source.hasOwnProperty(key)) {
				target[key] = source[key];
			}
		}
	}
	return target;
}

module.exports = extend;
