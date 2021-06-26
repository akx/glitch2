import colorTransformImageData from '../lib/colorTransformImageData';
import { fromValues } from '../lib/ycbcr';

function fromYCbCr(glitchContext) {
  const imageData = glitchContext.getImageData();
  colorTransformImageData(imageData, fromValues);
  glitchContext.setImageData(imageData);
}

fromYCbCr.params = [];

export default fromYCbCr;
