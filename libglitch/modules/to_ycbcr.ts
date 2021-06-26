import colorTransformImageData from '../lib/colorTransformImageData';
import { toValues } from '../lib/ycbcr';

function toYCbCr(glitchContext) {
  const imageData = glitchContext.getImageData();
  colorTransformImageData(imageData, toValues);
  glitchContext.setImageData(imageData);
}

toYCbCr.params = [];

export default toYCbCr;
