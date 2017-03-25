const defaults = require('../lib/defaults');
const randint = require('../lib/rand').randint;
const p = require('../param');

function desolve(glitchContext, options) {
  options = defaults(options, desolve.paramDefaults);
  const imageData = glitchContext.getImageData();
  const {data, height, width} = imageData;
  const xRes = randint(options.xMin % width, options.xMax % width);
  const yRes = randint(options.yMin % height, options.yMax % height);
  for (let y = 0; y < height; y += yRes) {
    for (let x = 0; x < width; x += xRes) {
      const srcOffset = y * 4 * width + x * 4;
      for (let yo = 0; yo < yRes; yo++) {
        for (let xo = 0; xo < xRes; xo++) {
          const dx = x + xo;
          const dy = y + yo;
          if (dx >= 0 && dy >= 0 && dx < width && dy < height) {
            const dstOffset = dy * 4 * width + dx * 4;
            data[dstOffset] = data[srcOffset];
            data[dstOffset + 1] = data[srcOffset + 1];
            data[dstOffset + 2] = data[srcOffset + 2];
          }
        }
      }
    }
  }
  glitchContext.setImageData(imageData);
}

desolve.paramDefaults = {
  xMin: 1,
  xMax: 4,
  yMin: 1,
  yMax: 4,
};

desolve.params = [
  p.int('xMax', {min: 1, max: 800}),
  p.int('xMin', {min: 1, max: 800}),
  p.int('yMax', {min: 1, max: 800}),
  p.int('yMin', {min: 1, max: 800}),
];

module.exports = desolve;
