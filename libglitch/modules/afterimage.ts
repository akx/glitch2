import defaults from '../lib/defaults';
import dataBlend from '../lib/dataBlend';
import * as p from '../param';

function afterimage(glitchContext, options) {
  options = defaults(options, afterimage.paramDefaults);

  const data = glitchContext.getImageData();
  if (glitchContext.persist.afterimageData) {
    dataBlend(
      glitchContext.persist.afterimageData,
      data,
      options.strengthOut,
      options.counterStrengthOut,
      'screen',
    );
  }
  if (glitchContext.persist.afterimageData && options.strengthIn < 1) {
    dataBlend(
      data,
      glitchContext.persist.afterimageData,
      options.strengthIn,
      1.0 - options.strengthIn,
      'normal',
    );
  } else {
    glitchContext.setImageData(data);
    glitchContext.persist.afterimageData = glitchContext.copyImageData();
  }
  glitchContext.setImageData(data);
}
afterimage.paramDefaults = {
  strengthOut: 0.2,
  counterStrengthOut: 0.3,
  strengthIn: 0.2,
};

afterimage.params = [
  p.num('strengthOut', { description: 'Afterimage write strength' }),
  p.num('counterStrengthOut', {
    description: 'Afterimage write counter-strength',
  }),
  p.num('strengthIn', { description: 'Afterimage read strength' }),
];

export default afterimage;
