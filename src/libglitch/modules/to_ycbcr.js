var colorTransformImageData = require("../lib/colorTransformImageData");
var ycbcr = require("../lib/ycbcr");

function toYCbCr(glitchContext, options) {
	var imageData = glitchContext.getImageData();
	colorTransformImageData(imageData, ycbcr.to);
	glitchContext.setImageData(imageData);
}
toYCbCr.params = [];

module.exports = toYCbCr;
