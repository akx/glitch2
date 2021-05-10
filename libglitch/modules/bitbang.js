import lerper from '../lib/lerper';
import defaults from '../lib/defaults';
import { randint, rand } from '../lib/rand';
import { mod } from '../lib/num';
import * as p from '../param';

function _bitbang(outputData, inputData, options) {
  const strideIn = randint(options.strideInMin, options.strideInMax);
  const strideOut = randint(options.strideOutMin, options.strideOutMax);
  const offIn = randint(-options.offInScale, options.offInScale);
  const offOut = randint(-options.offOutScale, options.offOutScale);
  const yDrift = randint(options.minYDrift, options.maxYDrift);
  const feedback = rand(options.feedbackMin, options.feedbackMax);
  const fblerp = lerper(feedback);
  const inp = inputData.data;
  const inl = inp.length;
  const outp = outputData.data;
  const outl = outp.length;
  const { width } = outputData;
  let last = 0;
  for (let i = 0; i < outl; ++i) {
    let ii = offIn + i * strideIn;
    ii += (0 | ii / width) * yDrift;
    ii = mod(ii, inl);
    const io = mod(offOut + i * strideOut, outl);
    if (feedback > 0) {
      last = outp[io] = 0 | fblerp(last, inp[ii]);
    } else {
      outp[io] = inp[ii];
    }
  }
  for (let i = 0; i < outl; i += 4) {
    outp[i + 3] = 255;
  }
}

function bitbang(glitchContext, options) {
  options = defaults(options, bitbang.paramDefaults);
  const inputData = glitchContext.copyImageData();
  const outputData = glitchContext.copyImageData();
  _bitbang(outputData, inputData, options);
  glitchContext.setImageData(outputData);
}

bitbang.paramDefaults = {
  offInScale: 0,
  offOutScale: 0,
  strideInMin: 1,
  strideInMax: 7,
  strideOutMin: 1,
  strideOutMax: 7,
  feedbackMin: 0.2,
  feedbackMax: 0.8,
  minYDrift: 0,
  maxYDrift: 0,
};

bitbang.params = [
  p.int('offInScale', { description: '' }),
  p.int('offOutScale', { description: '' }),
  p.int('strideInMin', { description: '', randomBias: 3 }),
  p.int('strideInMax', { description: '', randomBias: 3 }),
  p.int('strideOutMin', { description: '', randomBias: 3 }),
  p.int('strideOutMax', { description: '', randomBias: 3 }),
  p.num('feedbackMin', { description: '' }),
  p.num('feedbackMax', { description: '' }),
  p.int('minYDrift', { description: '' }),
  p.int('maxYDrift', { description: '' }),
];

export default bitbang;
