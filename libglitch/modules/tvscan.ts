import { mod } from '../lib/num';
import * as p from '../param';
import GlitchContext from '../GlitchContext';

interface TVScanOptions {
  speed: number;
  strength: number;
  heightPerc: number;
}

function runTvScan(
  imageData: ImageData,
  clock: number,
  speed: number,
  strength: number,
  heightPerc: number,
) {
  const { data, width, height } = imageData;
  let y;
  let b;
  let off;
  let x;
  const mh = 0 | (height * heightPerc);
  const y1 = mod(clock * speed, height + mh);
  const y0 = y1 - mh;
  for (y = 0; y < height; ++y) {
    if (y0 < y && y < y1) {
      b = ((y - y0) / mh) ** 2 * 255 * strength;
      if (b > 0) {
        off = y * width * 4;
        for (x = 0; x < width; ++x) {
          data[off++] += b;
          data[off++] += b;
          data[off++] += b;
          data[off++] = 255;
        }
      }
    }
  }
}

function tvScan(
  glitchContext: GlitchContext,
  pOptions: Partial<TVScanOptions>,
) {
  const options = { ...tvScanDefaults, ...pOptions };
  if (options.strength <= 0) {
    return;
  }
  if (options.heightPerc <= 0) {
    return;
  }
  const imageData = glitchContext.getImageData();
  runTvScan(
    imageData,
    glitchContext.clock,
    options.speed,
    options.strength,
    options.heightPerc,
  );
  glitchContext.setImageData(imageData);
}

const tvScanDefaults: TVScanOptions = {
  speed: 0.2,
  strength: 0.2,
  heightPerc: 0.2,
};
tvScan.paramDefaults = tvScanDefaults;

tvScan.params = [
  p.num('speed', { description: 'Scan speed' }),
  p.num('strength', { description: 'Scan brightness' }),
  p.num('heightPerc', { description: 'Scan height (percentage)' }),
];

export default tvScan;
