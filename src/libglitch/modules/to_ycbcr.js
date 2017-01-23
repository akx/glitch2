const colorTransformImageData = require('../lib/colorTransformImageData');
const ycbcr = require('../lib/ycbcr');

function toYCbCr(glitchContext) {
  const imageData = glitchContext.getImageData();
  colorTransformImageData(imageData, ycbcr.to);
  glitchContext.setImageData(imageData);
}
toYCbCr.params = [];

module.exports = toYCbCr;
