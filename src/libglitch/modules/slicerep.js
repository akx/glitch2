var defaults = require("../lib/defaults");
var randint = require("../lib/rand").randint;
var wrap = require("../lib/num").wrap;
var p = require("../param");

function _sliceRep(imageData, startY, sliceHeight, repeats) {
	var width, offsetStart, sliceLength, sourceSlice, writeOffset, rep;
	width = imageData.width;
	offsetStart = startY * width * 4;
	sliceLength = sliceHeight * width * 4;
	sourceSlice = new Uint8ClampedArray(imageData.data.buffer, offsetStart, sliceLength);
	writeOffset = offsetStart;
	for (rep = 1; rep < repeats; ++rep) {
		writeOffset = offsetStart + sliceLength * rep;
		if (writeOffset + sliceLength < imageData.data.length) {
			imageData.data.set(sourceSlice, writeOffset);
		}
	}
}
function slicerep(glitchContext, options) {
	options = defaults(options, slicerep.paramDefaults);
	var n = randint(options.nMin, options.nMax);
	if (n <= 0) return;
	var data = glitchContext.getImageData();
	for (var x = 0; x < n; ++x) {
		var height = randint(options.heightMin * data.height, options.heightMax * data.height);
		var repeats = randint(options.repeatsMin, options.repeatsMax);
		var y0 = randint(0, data.height - height);
		_sliceRep(data, y0, height, repeats);
	}
	glitchContext.setImageData(data);
}

slicerep.paramDefaults = {
	nMin: 0,
	nMax: 5,
	heightMin: 0,
	heightMax: 0.01,
	repeatsMin: 0,
	repeatsMax: 50,
};

slicerep.params = [
	p.int("nMin", {description: ""}),
	p.int("nMax", {description: ""}),
	p.num("heightMin", {description: "Slice height minimum (%)"}),
	p.num("heightMax", {description: "Slice height maximum (%)"}),
	p.int("repeatsMin", {description: ""}),
	p.int("repeatsMax", {description: ""}),
];

module.exports = slicerep;
