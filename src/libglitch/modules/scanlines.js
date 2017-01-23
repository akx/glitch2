const defaults = require('../lib/defaults');
const p = require('../param');

function scanlines(glitchContext, options) {
  options = defaults(options, scanlines.paramDefaults);

  if (options.multiplier >= 1) {
    return;
  }
  const imageData = glitchContext.getImageData();
  const {width, height, data} = imageData;
  const multiplier = options.multiplier;
  const density = Math.max(2, 0 | options.density);
  let x;
  let y;
  for (y = 0; y < height; y += density) {
    for (x = 0; x < width; ++x) {
      let offset = y * width * 4 + x * 4;
      data[offset++] *= multiplier;
      data[offset++] *= multiplier;
      data[offset++] *= multiplier;
    }
  }
  glitchContext.setImageData(imageData);
}
scanlines.paramDefaults = {
  multiplier: 0.7,
  density: 2,
};

scanlines.params = [
  p.num('multiplier', {description: 'Brightness multiplier'}),
  p.int('density', {description: 'Scanline density', min: 2}),
];

module.exports = scanlines;
