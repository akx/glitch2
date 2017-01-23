const defaults = require('../lib/defaults');
const dataBlend = require('../lib/dataBlend');
const p = require('../param');

function afterimage(glitchContext, options) {
  options = defaults(options, afterimage.paramDefaults);

  const data = glitchContext.getImageData();
  if (glitchContext.afterimageData) {
    dataBlend(glitchContext.afterimageData, data, options.strengthOut, options.counterStrengthOut, 'screen');
  }
  if (glitchContext.afterimageData && options.strengthIn < 1) {
    dataBlend(data, glitchContext.afterimageData, options.strengthIn, 1.0 - options.strengthIn, 'normal');
  } else {
    glitchContext.setImageData(data);
    glitchContext.afterimageData = glitchContext.copyImageData();
  }
  glitchContext.setImageData(data);
}
afterimage.paramDefaults = {
  strengthOut: 0.2,
  counterStrengthOut: 0.3,
  strengthIn: 0.2,
};

afterimage.params = [
  p.num('strengthOut', {description: 'Afterimage write strength'}),
  p.num('counterStrengthOut', {description: 'Afterimage write counter-strength'}),
  p.num('strengthIn', {description: 'Afterimage read strength'}),
];

module.exports = afterimage;
