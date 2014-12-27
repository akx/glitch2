var colorTransformImageData = require("../lib/colorTransformImageData");
var ycbcr = require("../lib/ycbcr");

function fromYCbCr(glitchContext, options) {
	var imageData = glitchContext.getImageData();
	colorTransformImageData(imageData, ycbcr.from);
	glitchContext.setImageData(imageData);
}
fromYCbCr.params = [];

module.exports = fromYCbCr;
