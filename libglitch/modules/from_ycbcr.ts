import colorTransformImageData from '../lib/colorTransformImageData';
import { fromValues } from '../lib/ycbcr';
import GlitchContext from '../GlitchContext';
import { Parameter } from '../param';

function fromYCbCr(glitchContext: GlitchContext) {
  const imageData = glitchContext.getImageData();
  colorTransformImageData(imageData, fromValues);
  glitchContext.setImageData(imageData);
}

fromYCbCr.params = [] as Parameter[];

export default fromYCbCr;
