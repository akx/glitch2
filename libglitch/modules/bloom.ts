import dataBlend from '../lib/dataBlend';
import stackBlurImageData from '../lib/stackBlurImageData';
import * as p from '../param';
import GlitchContext from '../GlitchContext';

interface BloomOptions {
  counterStrength: number;
  strength: number;
  radius: number;
}

function bloom(glitchContext: GlitchContext, pOptions: Partial<BloomOptions>) {
  const options = { ...bloomDefaults, ...pOptions };

  if (options.strength <= 0 || options.radius <= 0) {
    return;
  }

  const sourceData = glitchContext.getImageData();
  const blurData = glitchContext.copyImageData();
  stackBlurImageData(
    blurData,
    0,
    0,
    sourceData.width,
    sourceData.height,
    options.radius,
  );
  const counterStrength =
    options.counterStrength < 0
      ? 1 - options.strength
      : options.counterStrength;
  dataBlend(blurData, sourceData, options.strength, counterStrength, 'screen');
  glitchContext.setImageData(sourceData);
}

const bloomDefaults: BloomOptions = {
  radius: 5,
  strength: 0.7,
  counterStrength: -1,
};
bloom.paramDefaults = bloomDefaults;

bloom.params = [
  p.int('radius', { description: 'blur radius' }),
  p.num('strength', { description: 'bloom strength' }),
  p.num('counterStrength', {
    description: 'bloom counter-strength, set to < 0 for auto',
  }),
];

export default bloom;
