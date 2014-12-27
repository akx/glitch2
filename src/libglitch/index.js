module.exports = (function() {
	return {
		modules: require("./modules"), // Expose the module registry.
		Context: require("./GlitchContext"),  // Expose the glitch context object.
		param: require("./param"),  // Expose the param library to make external modules more convenient.
	};
}());
