/* eslint-disable no-continue */
const lerper = require('../lib/lerper');
const defaults = require('../lib/defaults');
const randint = require('../lib/rand').randint;
const wrap = require('../lib/num').wrap;
const p = require('../param');

function sliceoffset(imageData, y0, y1, offset, channelMask, blend, drift) {
  let x0;
  let x1;
  let dir;
  let y;
  let yoff;
  let x;
  let dstOffset;
  let srcOffset;
  const {data, width} = imageData;
  if (!channelMask) {
    return;
  }
  const lerp = lerper(blend);
  if (offset > 0) {
    x0 = 0;
    x1 = width;
    dir = +1;
  } else {
    x0 = width - 1;
    x1 = 0;
    dir = -1;
  }
  for (y = y0; y < y1; ++y) {
    yoff = y * width * 4;
    offset += drift;
    for (x = x0; dir < 0 ? x > x1 : x < x1; x += dir) {
      dstOffset = yoff + x * 4;
      srcOffset = yoff + wrap(0 | x + offset, width) * 4;
      if (channelMask & 1) {
        data[dstOffset] = lerp(data[dstOffset], data[srcOffset]);
      }
      if (channelMask & 2) {
        data[dstOffset + 1] = lerp(data[dstOffset + 1], data[srcOffset + 1]);
      }
      if (channelMask & 4) {
        data[dstOffset + 2] = lerp(data[dstOffset + 2], data[srcOffset + 2]);
      }
    }
  }
}

function deriveChanMask(options) {
  let chanmask = 0;
  if (!options.randomChan || randint(0, 100) < 33) {
    chanmask |= +options.chanR;
  }
  if (!options.randomChan || randint(0, 100) < 33) {
    chanmask |= +options.chanG << 1;
  }
  if (!options.randomChan || randint(0, 100) < 33) {
    chanmask |= +options.chanB << 2;
  }
  return chanmask;
}

function sliceglitch(glitchContext, options) {
  options = defaults(options, sliceglitch.paramDefaults);
  const n = randint(options.nMin, options.nMax);
  if (n <= 0) return;
  const data = glitchContext.getImageData();
  for (let i = 0; i < n; i++) {
    const drift = (Math.random() < options.driftProb ? options.driftMag : 0);
    const sliceHeight = randint(options.heightMin * data.height, options.heightMax * data.height);
    const offset = randint(options.offsetMin, options.offsetMax);
    if (sliceHeight <= 0) continue;
    if (offset === 0) continue;
    const channelMask = deriveChanMask(options);
    const y0 = randint(0, data.height - sliceHeight);
    sliceoffset(data, y0, y0 + sliceHeight, offset, channelMask, options.blend, drift);
  }
  glitchContext.setImageData(data);
}

sliceglitch.paramDefaults = {
  chanR: true,
  chanG: true,
  chanB: true,
  randomChan: true,
  blend: 0.8,
  driftProb: 0,
  driftMag: 1,
  heightMin: 0.02,
  heightMax: 0.02,
  nMin: 0,
  nMax: 10,
  offsetMin: -5,
  offsetMax: +5,
};

sliceglitch.params = [
  p.bool('chanR', {description: 'Glitch red channel?'}),
  p.bool('chanG', {description: 'Glitch green channel?'}),
  p.bool('chanB', {description: 'Glitch blue channel?'}),
  p.bool('randomChan', {description: 'Randomize glitched channels among those selected?'}),
  p.num('blend', {description: 'Blending factor'}),
  p.num('driftProb', {description: 'Drift probability'}),
  p.num('driftMag', {description: 'Drift magnitude (pixels per line)', min: -2, max: +2}),
  p.num('heightMin', {description: 'Glitch slice height (%) (minimum)'}),
  p.num('heightMax', {description: 'Glitch slice height (%) (maximum)'}),
  p.int('nMin', {description: 'Number of slices (minimum)'}),
  p.int('nMax', {description: 'Number of slices (maximum)'}),
  p.num('offsetMin', {description: 'Glitch offset (minimum)', min: -100, max: +100}),
  p.num('offsetMax', {description: 'Glitch offset (maximum)', min: -100, max: +100}),
];

module.exports = sliceglitch;
