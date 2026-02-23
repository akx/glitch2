import { Buffer } from 'buffer';
import jpegjs from 'jpeg-js';
import * as p from '../param';
import GlitchContext from '../GlitchContext';
import { canvasFromImageData, resizeImage } from '../lib/resize';
import { shiftImageData } from '../lib/shift';

// jpeg-js uses Node's Buffer internally; provide it in the browser
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (typeof (globalThis as any).Buffer === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).Buffer = Buffer;
}

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
    const sx = Math.round(options.shiftX);
    const sy = Math.round(options.shiftY);
    const toEncode =
      sx !== 0 || sy !== 0 ? shiftImageData(imageData, sx, sy) : imageData;
    const jpegImageData = jpegjs.encode(toEncode, options.quality).data;
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
      let result = new ImageData(
        new Uint8ClampedArray(decoded.data),
        decoded.width,
        decoded.height,
      );
      if (sx !== 0 || sy !== 0) {
        result = shiftImageData(result, -sx, -sy);
      }
      imageData = result;
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
  shiftX: number;
  shiftY: number;
}

const jpegDefaults: JpegOptions = {
  quality: 30,
  scaleX: 1,
  scaleY: 1,
  smoothScaleIn: true,
  smoothScaleOut: true,
  corruption: 0,
  shiftX: 0,
  shiftY: 0,
};
jpeg.paramDefaults = jpegDefaults;

jpeg.params = [
  p.int('quality', { min: 1, max: 100 }),
  p.num('scaleX', { min: 0, max: 2, step: 0.001 }),
  p.num('scaleY', { min: 0, max: 2, step: 0.001 }),
  p.num('corruption', { min: 0, max: 0.005, step: 0.0001 }),
  p.bool('smoothScaleIn'),
  p.bool('smoothScaleOut'),
  p.int('shiftX', {
    min: -16,
    max: 16,
    description: 'Pixel shift X before encoding',
  }),
  p.int('shiftY', {
    min: -16,
    max: 16,
    description: 'Pixel shift Y before encoding',
  }),
];

export default jpeg;
