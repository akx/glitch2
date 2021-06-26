import colorTransformImageData from '../lib/colorTransformImageData';
import { toValues } from '../lib/ycbcr';
import GlitchContext from '../GlitchContext';
import { Parameter } from '../param';

function toYCbCr(glitchContext: GlitchContext) {
  const imageData = glitchContext.getImageData();
  colorTransformImageData(imageData, toValues);
  glitchContext.setImageData(imageData);
}

toYCbCr.params = [] as Parameter[];

export default toYCbCr;
