import * as p from '../param';
import GlitchContext from '../GlitchContext';

interface ScanlinesOptions {
  multiplier: number;
  density: number;
}

function scanlines(
  glitchContext: GlitchContext,
  pOptions: Partial<ScanlinesOptions>,
) {
  const options = { ...scanlinesDefaults, ...pOptions };
  if (options.multiplier >= 1) {
    return;
  }
  const imageData = glitchContext.getImageData();
  const { width, height, data } = imageData;
  const { multiplier } = options;
  const density = Math.max(2, 0 | options.density);
  let x;
  let y;
  for (y = 0; y < height; y += density) {
    for (x = 0; x < width; ++x) {
      let offset = y * width * 4 + x * 4;
      data[offset++] *= multiplier;
      data[offset++] *= multiplier;
      data[offset++] *= multiplier;
    }
  }
  glitchContext.setImageData(imageData);
}

const scanlinesDefaults = {
  multiplier: 0.7,
  density: 2,
};
scanlines.paramDefaults = scanlinesDefaults;

scanlines.params = [
  p.num('multiplier', { description: 'Brightness multiplier' }),
  p.int('density', { description: 'Scanline density', min: 2 }),
];

export default scanlines;
