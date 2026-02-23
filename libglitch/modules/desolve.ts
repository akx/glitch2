import { rand } from '../lib/rand';
import * as p from '../param';
import GlitchContext from '../GlitchContext';

interface DesolveOptions {
  yRes: number;
  rXorChance: number;
  bXorChance: number;
  xRes: number;
  gXorChance: number;
}

function desolve(
  glitchContext: GlitchContext,
  pOptions: Partial<DesolveOptions>,
) {
  const options = { ...desolveDefaults, ...pOptions };
  const imageData = glitchContext.getImageData();
  const { data, height, width } = imageData;
  const xRes = options.xRes % width;
  const yRes = options.yRes % height;
  const op = (a: number, b: number, xor: boolean) => (xor ? a ^ b : b);
  for (let y = 0; y < height; y += yRes) {
    for (let x = 0; x < width; x += xRes) {
      const srcOffset = y * 4 * width + x * 4;
      const rXor = rand() < options.rXorChance;
      const gXor = rand() < options.gXorChance;
      const bXor = rand() < options.bXorChance;
      for (let yo = 0; yo < yRes; yo++) {
        for (let xo = 0; xo < xRes; xo++) {
          const dx = x + xo;
          const dy = y + yo;
          if (dx >= 0 && dy >= 0 && dx < width && dy < height) {
            const dstOffset = dy * 4 * width + dx * 4;
            data[dstOffset] = op(data[dstOffset], data[srcOffset], rXor);
            data[dstOffset + 1] = op(
              data[dstOffset + 1],
              data[srcOffset + 1],
              gXor,
            );
            data[dstOffset + 2] = op(
              data[dstOffset + 2],
              data[srcOffset + 2],
              bXor,
            );
          }
        }
      }
    }
  }
  glitchContext.setImageData(imageData);
}

const desolveDefaults: DesolveOptions = {
  xRes: 4,
  yRes: 4,
  rXorChance: 0,
  gXorChance: 0,
  bXorChance: 0,
};
desolve.paramDefaults = desolveDefaults;

desolve.params = [
  p.int('xRes', { min: 1, max: 800, description: 'X resolution' }),
  p.int('yRes', { min: 1, max: 800, description: 'Y resolution' }),
  p.num('rXorChance'),
  p.num('gXorChance'),
  p.num('bXorChance'),
];

export default desolve;
