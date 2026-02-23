import { randint } from '../lib/rand';
import * as p from '../param';
import GlitchContext from '../GlitchContext';

interface NoiseOptions {
  n: number;
  brightnessMin: number;
  noisiness: number;
  brightnessMax: number;
  replace: boolean;
  height: number;
  full: boolean;
}

function _noiseBand(
  imageData: ImageData,
  y0: number,
  y1: number,
  noisiness: number,
  minBrightness: number,
  maxBrightness: number,
  replace: boolean,
) {
  let y;
  let yoff;
  let x;
  let offset;
  let brightness;
  const { data, width } = imageData;
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

function noise(glitchContext: GlitchContext, pOptions: Partial<NoiseOptions>) {
  const options = { ...noiseDefaults, ...pOptions };
  const n = options.full ? 1 : options.n;
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
      options.replace,
    );
  } else {
    const h = options.height * imageData.height;
    for (let x = 0; x < n; ++x) {
      if (h <= 0) continue;
      const y0 = randint(0, imageData.height - h);
      const y1 = y0 + h;
      _noiseBand(
        imageData,
        y0,
        y1,
        options.noisiness,
        options.brightnessMin,
        options.brightnessMax,
        options.replace,
      );
    }
  }

  glitchContext.setImageData(imageData);
}

const noiseDefaults: NoiseOptions = {
  height: 0.05,
  n: 5,
  brightnessMin: -50,
  brightnessMax: +50,
  noisiness: 1,
  replace: false,
  full: false,
};
noise.paramDefaults = noiseDefaults;

noise.params = [
  p.num('height', { description: 'Noise band height (fraction of image)' }),
  p.int('n', { description: 'Number of noise bands' }),
  p.num('brightnessMin', {
    description: 'Minimum brightness modulation amount',
    min: -255,
    max: +255,
  }),
  p.num('brightnessMax', {
    description: 'Maximum brightness modulation amount',
    min: -255,
    max: +255,
  }),
  p.num('noisiness', { description: 'Probability of noising pixel' }),
  p.bool('replace', {
    description: 'Use brightness as absolute value instead of modulator',
  }),
  p.bool('full', { description: "Don't band \u2013 noise the whole mess" }),
];

export default noise;
