import lerper from '../lib/lerper';
import defaults from '../lib/defaults';
import { randint } from '../lib/rand';
import * as p from '../param';

function _leak(imageData, lerp, magic1, magic2, yToMagic1, yToMagic2) {
  const { width, height, data } = imageData;
  const dwidth = width * 4;
  const len = data.length;
  for (let y = 0; y < height; ++y) {
    const fy = y / height;
    const yoffset = y * dwidth + (0 | (magic1 + yToMagic1 * fy));
    for (
      let offset = yoffset, to$ = yoffset + dwidth;
      offset < to$;
      offset += 4
    ) {
      const src = offset + 4 + (0 | (magic2 + yToMagic2 * fy));
      if (src >= 0 && src < len && offset >= 0 && offset < len) {
        data[offset] = 0 | lerp(data[offset], data[src]);
      }
    }
  }
}

function leak(glitchContext, options) {
  options = defaults(options, leak.paramDefaults);
  if (options.intensity <= 0) return;
  const n = randint(options.nMin, options.nMax);
  if (n <= 0) return;
  const imageData = glitchContext.getImageData();
  const lerp = lerper(options.intensity);
  for (let i = 0; i < n; i++) {
    _leak(
      imageData,
      lerp,
      options.magic1,
      options.magic2,
      options.yToMagic1,
      options.yToMagic2,
    );
  }
  glitchContext.setImageData(imageData);
}

leak.paramDefaults = {
  intensity: 0.5,
  magic1: 0,
  magic2: 0,
  yToMagic1: 0,
  yToMagic2: 0,
  nMin: 10,
  nMax: 10,
};

leak.params = [
  p.num('intensity', { description: 'Effect intensity' }),
  p.int('magic1', { description: 'Magic 1', min: -40, max: +40 }),
  p.int('magic2', { description: 'Magic 2', min: -40, max: +40 }),
  p.num('yToMagic1', {
    description: 'Y coordinate to Magic 1',
    min: -100,
    max: +100,
  }),
  p.num('yToMagic2', {
    description: 'Y coordinate to Magic 2',
    min: -100,
    max: +100,
  }),
  p.int('nMin', { description: 'Min repetitions' }),
  p.int('nMax', { description: 'Max repetitions' }),
];

export default leak;
