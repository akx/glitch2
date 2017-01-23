/* eslint-disable no-continue */
const defaults = require('../lib/defaults');
const randint = require('../lib/rand').randint;
const p = require('../param');

function _noiseBand(imageData, y0, y1, noisiness, minBrightness, maxBrightness, replace) {
  let y;
  let yoff;
  let x;
  let offset;
  let brightness;
  const data = imageData.data;
  const width = imageData.width;
  if (replace) {
    if (minBrightness <= 0) minBrightness = 0;
    if (maxBrightness >= 255) maxBrightness = 255;
  }
  for (y = y0; y < y1; ++y) {
    yoff = y * width * 4;
    for (x = 0; x < width; ++x) {
      if (noisiness >= 1 || Math.random() < noisiness) {
        offset = yoff + x * 4;
        brightness = randint(minBrightness, maxBrightness);
        if (replace) {
          data[offset++] = brightness;
          data[offset++] = brightness;
          data[offset++] = brightness;
        } else {
          data[offset++] += brightness;
          data[offset++] += brightness;
          data[offset++] += brightness;
        }
      }
    }
  }
}

function noise(glitchContext, options) {
  options = defaults(options, noise.paramDefaults);
  const n = (options.full ? 1 : randint(options.nMin, options.nMax));
  if (n <= 0) return;
  const imageData = glitchContext.getImageData();
  if (options.full) {
    _noiseBand(
      imageData,
      0,
      imageData.height,
      options.noisiness,
      options.brightnessMin,
      options.brightnessMax,
      options.replace
    );
  } else {
    const hMin = options.heightMin * imageData.height;
    const hMax = options.heightMax * imageData.height;
    for (let x = 0; x < n; ++x) {
      const h = randint(hMin, hMax);
      if (h <= 0) continue;
      const y0 = randint(0, imageData.height - h);
      const y1 = y0 + h;
      _noiseBand(imageData, y0, y1, options.noisiness, options.brightnessMin, options.brightnessMax, options.replace);
    }
  }

  glitchContext.setImageData(imageData);
}

noise.paramDefaults = {
  heightMin: 0,
  heightMax: 0.1,
  nMin: 0,
  nMax: 10,
  brightnessMin: -50,
  brightnessMax: +50,
  noisiness: 1,
  replace: false,
  full: false,
};


noise.params = [
  p.num('heightMin', {description: 'Noise band min height'}),
  p.num('heightMax', {description: 'Noise band max height'}),
  p.int('nMin', {description: 'Minimum number of noise bands'}),
  p.int('nMax', {description: 'Maximum number of noise bands'}),
  p.num('brightnessMin', {description: 'Minimum brightness modulation amount', min: -255, max: +255}),
  p.num('brightnessMax', {description: 'Maximum brightness modulation amount', min: -255, max: +255}),
  p.num('noisiness', {description: 'Probability of noising pixel'}),
  p.bool('replace', {description: 'Use brightness as absolute value instead of modulator'}),
  p.bool('full', {description: "Don't band \u2013 noise the whole mess"}),
];

module.exports = noise;
