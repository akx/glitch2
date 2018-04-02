const defaults = require('../lib/defaults');
const dataBlend = require('../lib/dataBlend');
const stackBlurImageData = require('../lib/stackBlurImageData');
const p = require('../param');

function bloom(glitchContext, options) {
  options = defaults(options, bloom.paramDefaults);

  if (options.strength <= 0 || options.radius <= 0) {
    return;
  }

  const sourceData = glitchContext.getImageData();
  const blurData = glitchContext.copyImageData();
  stackBlurImageData(blurData, 0, 0, sourceData.width, sourceData.height, options.radius);
  const counterStrength = (options.counterStrength < 0 ? 1 - options.strength : options.counterStrength);
  dataBlend(blurData, sourceData, options.strength, counterStrength, 'screen');
  glitchContext.setImageData(sourceData);
}

bloom.paramDefaults = {
  radius: 5,
  strength: 0.7,
  counterStrength: -1,
};

bloom.params = [
  p.int('radius', { description: 'blur radius' }),
  p.num('strength', { description: 'bloom strength' }),
  p.num('counterStrength', { description: 'bloom counter-strength, set to < 0 for auto' }),
];


module.exports = bloom;
