import defaults from '../lib/defaults';
import { rand, randint } from '../lib/rand';
import * as p from '../param';

function desolve(glitchContext, options) {
  options = defaults(options, desolve.paramDefaults);
  const imageData = glitchContext.getImageData();
  const { data, height, width } = imageData;
  const xRes = randint(options.xMin % width, options.xMax % width);
  const yRes = randint(options.yMin % height, options.yMax % height);
  const op = (a, b, xor) => (xor ? a ^ b : b);
  for (let y = 0; y < height; y += yRes) {
    for (let x = 0; x < width; x += xRes) {
      const srcOffset = y * 4 * width + x * 4;
      const rXor = (rand() < options.rXorChance);
      const gXor = (rand() < options.gXorChance);
      const bXor = (rand() < options.bXorChance);
      for (let yo = 0; yo < yRes; yo++) {
        for (let xo = 0; xo < xRes; xo++) {
          const dx = x + xo;
          const dy = y + yo;
          if (dx >= 0 && dy >= 0 && dx < width && dy < height) {
            const dstOffset = dy * 4 * width + dx * 4;
            data[dstOffset] = op(data[dstOffset], data[srcOffset], rXor);
            data[dstOffset + 1] = op(data[dstOffset + 1], data[srcOffset + 1], gXor);
            data[dstOffset + 2] = op(data[dstOffset + 2], data[srcOffset + 2], bXor);
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
  rXorChance: 0,
  gXorChance: 0,
  bXorChance: 0,
};

desolve.params = [
  p.int('xMax', { min: 1, max: 800 }),
  p.int('xMin', { min: 1, max: 800 }),
  p.int('yMax', { min: 1, max: 800 }),
  p.int('yMin', { min: 1, max: 800 }),
  p.num('rXorChance'),
  p.num('gXorChance'),
  p.num('bXorChance'),
];

export default desolve;
