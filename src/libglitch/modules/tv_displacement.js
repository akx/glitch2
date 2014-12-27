var makeTVDisplacement = require("../displace/tv");
var displacementMapper = require("../displace/mapper");
var defaults = require("../lib/defaults");
var p = require("../param");

function tvDisplacement(glitchContext, options) {
	options = defaults(options, tvDisplacement.paramDefaults);
	var data = glitchContext.getImageData();
	var dismap, dismapCacheKey = "tvdis_" + data.width + "_" + data.height;
	if(!(dismap = glitchContext[dismapCacheKey])) {
		dismap = glitchContext[dismapCacheKey] = makeTVDisplacement(data.width, data.height);
	}
	data = displacementMapper(data, dismap, options.strengthX, options.strengthY);
	glitchContext.setImageData(data);
}

tvDisplacement.paramDefaults = {
	strengthX: 0,
	strengthY: 0,
};

tvDisplacement.params = [
	p.int("strengthX", {description: "displacement strength (x)", min: -250, max: +250}),
	p.int("strengthY", {description: "displacement strength (y)", min: -250, max: +250}),
];

module.exports = tvDisplacement;
