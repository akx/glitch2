var defaults = require("../lib/defaults");
var randint = require("../lib/rand").randint;
var rand = require("../lib/rand").rand;
var clamp = require("../lib/num").clamp;
var p = require("../param");

function streak(glitchContext, options) {
	options = defaults(options, streak.paramDefaults);
	var imageData = glitchContext.getImageData();
	var xoff = 0, yoff = 0, buf = imageData.data;
	var height = imageData.height;
	var width = imageData.width;
	for(var y = 0; y < height; y ++) {
		for (var x = 0; x < width; x++) {
			if(randint(0, 65535) < options.xOffsetChance) {
				xoff += (rand() < 0.5 ? -1 : +1);
			}
			if(randint(0, 65535) < options.yOffsetChance) {
				yoff += (rand() < 0.5 ? -1 : +1);
			}
			if(randint(0, 65535) < options.offsetHalveChance) {
				xoff = 0 | (xoff / 2);
				yoff = 0 | (yoff / 2);
			}
			var srcx = clamp(x + xoff, 0, width - 1);
			var srcy = clamp(y + yoff, 0, height - 1);
			if(srcx != x || srcy != y) {
				var srcOffset = srcy * 4 * width + srcx * 4;
				var offset = y * 4 * width + x * 4;
				buf[offset++] = buf[srcOffset++];
				buf[offset++] = buf[srcOffset++];
				buf[offset++] = buf[srcOffset++];
			}
		}
		if(options.offsetResetEveryLine) {
			xoff = 0;
			yoff = 0;
		}
	}
	glitchContext.setImageData(imageData);
}

streak.paramDefaults = {
	xOffsetChance: 100,
	yOffsetChance: 500,
	offsetHalveChance: 10,
	offsetResetEveryLine: false,
};

streak.params = [
	p.int("xOffsetChance", {min: 0, max: 65535}),
	p.int("yOffsetChance", {min: 0, max: 65535}),
	p.int("offsetHalveChance", {min: 0, max: 65535}),
	p.bool("offsetResetEveryLine"),
];

module.exports = streak;
