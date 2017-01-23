const colorTransformImageData = require('../lib/colorTransformImageData');
const ycbcr = require('../lib/ycbcr');

function fromYCbCr(glitchContext) {
  const imageData = glitchContext.getImageData();
  colorTransformImageData(imageData, ycbcr.from);
  glitchContext.setImageData(imageData);
}
fromYCbCr.params = [];

module.exports = fromYCbCr;
