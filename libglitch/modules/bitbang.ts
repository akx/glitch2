import lerper from '../lib/lerper';
import { randint } from '../lib/rand';
import { mod } from '../lib/num';
import * as p from '../param';
import GlitchContext from '../GlitchContext';

interface BitbangOptions {
  yDrift: number;
  offOutScale: number;
  feedback: number;
  offInScale: number;
  strideOut: number;
  strideIn: number;
}

function _bitbang(
  outputData: ImageData,
  inputData: ImageData,
  options: BitbangOptions,
) {
  const { strideIn } = options;
  const { strideOut } = options;
  const offIn = randint(-options.offInScale, options.offInScale);
  const offOut = randint(-options.offOutScale, options.offOutScale);
  const { yDrift } = options;
  const { feedback } = options;
  const fblerp = lerper(feedback);
  const inp = inputData.data;
  const inl = inp.length;
  const outp = outputData.data;
  const outl = outp.length;
  const { width } = outputData;
  let last = 0;
  for (let i = 0; i < outl; ++i) {
    let ii = offIn + i * strideIn;
    ii += (0 | (ii / width)) * yDrift;
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

function bitbang(
  glitchContext: GlitchContext,
  pOptions: Partial<BitbangOptions>,
) {
  const options = { ...bitbang.paramDefaults, ...pOptions };
  const inputData = glitchContext.copyImageData();
  const outputData = glitchContext.copyImageData();
  _bitbang(outputData, inputData, options);
  glitchContext.setImageData(outputData);
}

const bitbangDefaults: BitbangOptions = {
  offInScale: 0,
  offOutScale: 0,
  strideIn: 4,
  strideOut: 4,
  feedback: 0.5,
  yDrift: 0,
};
bitbang.paramDefaults = bitbangDefaults;

bitbang.params = [
  p.int('offInScale', { description: '' }),
  p.int('offOutScale', { description: '' }),
  p.int('strideIn', { description: 'Input stride', randomBias: 3 }),
  p.int('strideOut', { description: 'Output stride', randomBias: 3 }),
  p.num('feedback', { description: 'Feedback amount' }),
  p.int('yDrift', { description: 'Y drift' }),
];

export default bitbang;
