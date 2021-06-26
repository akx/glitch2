import dataBlend from '../lib/dataBlend';
import * as p from '../param';
import GlitchContext from '../GlitchContext';

interface AfterimageOptions {
  strengthIn: number;
  strengthOut: number;
  counterStrengthOut: number;
}

function afterimage(
  glitchContext: GlitchContext,
  pOptions: Partial<AfterimageOptions>,
) {
  const options = { ...afterimageDefaults, ...pOptions };

  const data = glitchContext.getImageData();
  const afterimageData = glitchContext.persist.afterimageData as
    | ImageData
    | undefined;
  if (afterimageData) {
    dataBlend(
      afterimageData,
      data,
      options.strengthOut,
      options.counterStrengthOut,
      'screen',
    );
  }
  if (afterimageData && options.strengthIn < 1) {
    dataBlend(
      data,
      afterimageData,
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

const afterimageDefaults: AfterimageOptions = {
  strengthOut: 0.2,
  counterStrengthOut: 0.3,
  strengthIn: 0.2,
};
afterimage.paramDefaults = afterimageDefaults;

afterimage.params = [
  p.num('strengthOut', { description: 'Afterimage write strength' }),
  p.num('counterStrengthOut', {
    description: 'Afterimage write counter-strength',
  }),
  p.num('strengthIn', { description: 'Afterimage read strength' }),
];

export default afterimage;
