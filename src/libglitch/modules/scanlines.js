var defaults = require("../lib/defaults");
var p = require("../param");

function scanlines(glitchContext, options) {
	options = defaults(options, scanlines.paramDefaults);

	if (options.multiplier >= 1) {
		return;
	}
	var imageData = glitchContext.getImageData();
	var x, y, offset;
	var width = imageData.width;
	var height = imageData.height;
	var data = imageData.data;
	var multiplier = options.multiplier;
	var density = Math.max(2, 0 | options.density);

	for (y = 0; y < height; y += density) {
		for (x = 0; x < width; ++x) {
			offset = y * width * 4 + x * 4;
			data[offset++] *= multiplier;
			data[offset++] *= multiplier;
			data[offset++] *= multiplier;
		}
	}
	glitchContext.setImageData(imageData);
}
scanlines.paramDefaults = {
	multiplier: 0.7,
	density: 2,
};

scanlines.params = [
	p.num("multiplier", {description: "Brightness multiplier"}),
	p.int("density", {description: "Scanline density", min: 2}),
];

module.exports = scanlines;
