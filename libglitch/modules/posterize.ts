import * as p from '../param';
import GlitchContext from '../GlitchContext';

interface PosterizeOptions {
  rLevels: number;
  gLevels: number;
  bLevels: number;
  rJitter: number;
  gJitter: number;
  bJitter: number;
  rBias: number;
  gBias: number;
  bBias: number;
}

const defaults: PosterizeOptions = {
  rLevels: 4,
  gLevels: 4,
  bLevels: 4,
  rJitter: 0,
  gJitter: 0,
  bJitter: 0,
  rBias: 0,
  gBias: 0,
  bBias: 0,
};

function posterize(
  glitchContext: GlitchContext,
  pOptions: Partial<PosterizeOptions>,
) {
  const o = { ...defaults, ...pOptions };
  const imageData = glitchContext.getImageData();
  const { data } = imageData;
  const levels = [o.rLevels, o.gLevels, o.bLevels];
  const jitters = [o.rJitter, o.gJitter, o.bJitter];
  const biases = [o.rBias, o.gBias, o.bBias];

  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const n = levels[c];
      if (n >= 256) continue;
      let bucket = (data[i + c] / 255) * (n - 1) + biases[c];
      const j = jitters[c];
      if (j > 0) {
        bucket += (Math.random() - 0.5) * j;
      }
      bucket = Math.max(0, Math.min(n - 1, Math.round(bucket)));
      data[i + c] = (bucket / (n - 1)) * 255;
    }
  }

  glitchContext.setImageData(imageData);
}

posterize.paramDefaults = defaults;
posterize.params = [
  p.int('rLevels', { description: 'Red levels', min: 2, max: 256 }),
  p.num('rBias', { description: 'Red bias', min: -5, max: 5 }),
  p.num('rJitter', { description: 'Red jitter', min: 0, max: 5 }),
  p.int('gLevels', { description: 'Green levels', min: 2, max: 256 }),
  p.num('gBias', { description: 'Green bias', min: -5, max: 5 }),
  p.num('gJitter', { description: 'Green jitter', min: 0, max: 5 }),
  p.int('bLevels', { description: 'Blue levels', min: 2, max: 256 }),
  p.num('bBias', { description: 'Blue bias', min: -5, max: 5 }),
  p.num('bJitter', { description: 'Blue jitter', min: 0, max: 5 }),
];

export default posterize;
