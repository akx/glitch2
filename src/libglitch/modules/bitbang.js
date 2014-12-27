var lerper = require("../lib/lerper");
var defaults = require("../lib/defaults");
var randint = require("../lib/rand").randint;
var rand = require("../lib/rand").rand;
var mod = require("../lib/num").mod;
var p = require("../param");

function _bitbang(outputData, inputData, options) {
	var i, ii, io;
	var strideIn = randint(options.strideInMin, options.strideInMax);
	var strideOut = randint(options.strideOutMin, options.strideOutMax);
	var offIn = randint(-options.offInScale, options.offInScale);
	var offOut = randint(-options.offOutScale, options.offOutScale);
	var yDrift = randint(options.minYDrift, options.maxYDrift);
	var feedback = rand(options.feedbackMin, options.feedbackMax);
	var fblerp = lerper(feedback);
	var inp = inputData.data;
	var inl = inp.length;
	var outp = outputData.data;
	var outl = outp.length;
	var width = outputData.width;
	var last = 0;
	for (var i = 0; i < outl; ++i) {
		ii = offIn + i * strideIn;
		ii += (0 | ii / width) * yDrift;
		ii = mod(ii, inl);
		io = mod(offOut + i * strideOut, outl);
		if (feedback > 0) {
			last = outp[io] = 0 | fblerp(last, inp[ii]);
		} else {
			outp[io] = inp[ii];
		}
	}
	for (i = 0; i < outl; i += 4) {
		outp[i + 3] = 255;
	}
}

function bitbang(glitchContext, options) {
	options = defaults(options, bitbang.paramDefaults);
	var inputData = glitchContext.copyImageData();
	var outputData = glitchContext.copyImageData();
	_bitbang(outputData, inputData, options);
	glitchContext.setImageData(outputData);
}

bitbang.paramDefaults = {
	offInScale: 0,
	offOutScale: 0,
	strideInMin: 1,
	strideInMax: 7,
	strideOutMin: 1,
	strideOutMax: 7,
	feedbackMin: 0.2,
	feedbackMax: 0.8,
	minYDrift: 0,
	maxYDrift: 0,
};


bitbang.params = [
	p.int("offInScale", {description: ""}),
	p.int("offOutScale", {description: ""}),
	p.int("strideInMin", {description: "", randomBias: 3}),
	p.int("strideInMax", {description: "", randomBias: 3}),
	p.int("strideOutMin", {description: "", randomBias: 3}),
	p.int("strideOutMax", {description: "", randomBias: 3}),
	p.num("feedbackMin", {description: ""}),
	p.num("feedbackMax", {description: ""}),
	p.int("minYDrift", {description: ""}),
	p.int("maxYDrift", {description: ""}),
];


module.exports = bitbang;
