import jpegjs from 'jpeg-js';
import * as p from '../param';
import GlitchContext from '../GlitchContext';
import { canvasFromImageData, resizeImage } from '../lib/resize';

function jpeg(glitchContext: GlitchContext, pOptions: Partial<JpegOptions>) {
  const options = { ...jpegDefaults, ...pOptions };
  let imageData = glitchContext.getImageData();
  const { width: origW, height: origH } = imageData;
  const needsScale =
    (options.scaleX !== 1 && options.scaleX > 0) ||
    (options.scaleY !== 1 && options.scaleY > 0);
  if (needsScale) {
    imageData = resizeImage(
      canvasFromImageData(imageData),
      origW * options.scaleX,
      origH * options.scaleY,
      options.smoothScaleIn,
    );
  }
  if (options.quality < 100) {
    const jpegImageData = jpegjs.encode(imageData, options.quality).data;
    if (options.corruption > 0) {
      const bytes = new Uint8ClampedArray(jpegImageData.buffer);
      const start = 0 | (bytes.length / 2);
      const end = bytes.length - 16;
      for (let i = start; i < end; i++) {
        if (Math.random() < options.corruption) {
          bytes[i] = 0;
        }
      }
    }
    try {
      const decoded = jpegjs.decode(jpegImageData, {
        tolerantDecoding: true,
        useTArray: true,
      });
      imageData = new ImageData(
        new Uint8ClampedArray(decoded.data),
        decoded.width,
        decoded.height,
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('JPEG failed:', e);
    }
  }
  if (needsScale) {
    imageData = resizeImage(
      canvasFromImageData(imageData),
      origW,
      origH,
      options.smoothScaleOut,
    );
  }
  glitchContext.setImageData(imageData);
}

interface JpegOptions {
  scaleX: number;
  scaleY: number;
  quality: number;
  smoothScaleIn: boolean;
  smoothScaleOut: boolean;
  corruption: number;
}

const jpegDefaults: JpegOptions = {
  quality: 30,
  scaleX: 1,
  scaleY: 1,
  smoothScaleIn: true,
  smoothScaleOut: true,
  corruption: 0,
};
jpeg.paramDefaults = jpegDefaults;

jpeg.params = [
  p.int('quality', { min: 1, max: 100 }),
  p.num('scaleX', { min: 0, max: 2, step: 0.001 }),
  p.num('scaleY', { min: 0, max: 2, step: 0.001 }),
  p.num('corruption', { min: 0, max: 0.005, step: 0.0001 }),
  p.bool('smoothScaleIn'),
  p.bool('smoothScaleOut'),
];

export default jpeg;
