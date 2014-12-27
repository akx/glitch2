var defaults = require("../lib/defaults");
var mod = require("../lib/num").mod;
var p = require("../param");

function _tvScan(imageData, clock, speed, strength, heightPerc) {
	var data, width, height, mh, y1, y0, y, b, off, x;
	data = imageData.data;
	width = imageData.width;
	height = imageData.height;
	mh = 0 | height * heightPerc;
	y1 = mod(clock * speed, height + mh);
	y0 = y1 - mh;
	for (y = 0; y < height; ++y) {
		if (y0 < y && y < y1) {
			b = Math.pow((y - y0) / mh, 2) * 255 * strength;
			if (b > 0) {
				off = y * width * 4;
				for (x = 0; x < width; ++x) {
					data[off++] += b;
					data[off++] += b;
					data[off++] += b;
					data[off++] = 255;
				}
			}
		}
	}
}
function tvScan(glitchContext, options) {
	options = defaults(options, tvScan.paramDefaults);
	if(options.strength <= 0) return;
	if(options.heightPerc <= 0) return;
	var imageData = glitchContext.getImageData();
	_tvScan(imageData, glitchContext.clock, options.speed, options.strength, options.heightPerc);
	glitchContext.setImageData(imageData);
}

tvScan.paramDefaults = {
	speed: 0.2,
	strength: 0.2,
	heightPerc: 0.2
};


tvScan.params = [
	p.num("speed", {description: "Scan speed"}),
	p.num("strength", {description: "Scan brightness"}),
	p.num("heightPerc", {description: "Scan height (percentage)"}),
];


module.exports = tvScan;
