import { randint, rand } from '../lib/rand';
import { clamp } from '../lib/num';
import * as p from '../param';
import GlitchContext from '../GlitchContext';

function streak(
  glitchContext: GlitchContext,
  pOptions: Partial<StreakOptions>,
) {
  const options = { ...streakDefaults, ...pOptions };
  const imageData = glitchContext.getImageData();
  const { height, width, data: buf } = imageData;
  let xoff = 0;
  let yoff = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (randint(0, 65535) < options.xOffsetChance) {
        xoff += rand() < 0.5 ? -1 : +1;
      }
      if (randint(0, 65535) < options.yOffsetChance) {
        yoff += rand() < 0.5 ? -1 : +1;
      }
      if (randint(0, 65535) < options.offsetHalveChance) {
        xoff = 0 | (xoff / 2);
        yoff = 0 | (yoff / 2);
      }
      const srcx = clamp(x + xoff, 0, width - 1);
      const srcy = clamp(y + yoff, 0, height - 1);
      if (srcx !== x || srcy !== y) {
        let srcOffset = srcy * 4 * width + srcx * 4;
        let offset = y * 4 * width + x * 4;
        buf[offset++] = buf[srcOffset++];
        buf[offset++] = buf[srcOffset++];
        buf[offset++] = buf[srcOffset++];
      }
    }
    if (options.offsetResetEveryLine) {
      xoff = 0;
      yoff = 0;
    }
  }
  glitchContext.setImageData(imageData);
}

interface StreakOptions {
  yOffsetChance: number;
  offsetHalveChance: number;
  offsetResetEveryLine: boolean;
  xOffsetChance: number;
}

const streakDefaults: StreakOptions = {
  xOffsetChance: 100,
  yOffsetChance: 500,
  offsetHalveChance: 10,
  offsetResetEveryLine: false,
};
streak.paramDefaults = streakDefaults;

streak.params = [
  p.int('xOffsetChance', { min: 0, max: 65535 }),
  p.int('yOffsetChance', { min: 0, max: 65535 }),
  p.int('offsetHalveChance', { min: 0, max: 65535 }),
  p.bool('offsetResetEveryLine'),
];

export default streak;
