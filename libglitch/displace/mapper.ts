/* eslint-env browser */
import makeDrawable from '../lib/makeDrawable';

import { clamp } from '../lib/num';

export default function displacementMapper(
  imageData: ImageData,
  displacementMap: HTMLCanvasElement,
  scaleX: number,
  scaleY: number,
): ImageData | null {
  if (scaleX === 0 && scaleY === 0) return null;
  const { width, height } = imageData;
  // Rescale displacement map
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempContext = tempCanvas.getContext('2d');
  if (!tempContext) return null;
  tempContext.drawImage(makeDrawable(displacementMap), 0, 0, width, height);
  const displacementData = tempContext.getImageData(0, 0, width, height).data;
  const sourceBuf = imageData.data;
  const destBuf = new Uint8ClampedArray(sourceBuf);
  for (let y = 0; y < height; ++y) {
    const yoff = y * width * 4;
    for (let x = 0; x < width; ++x) {
      let offset = yoff + x * 4;
      const disZ = displacementData[offset + 2] / 127.0;
      const disX = ((displacementData[offset] - 127) / 128.0) * scaleX * disZ;
      const disY =
        ((displacementData[offset + 1] - 127) / 128.0) * scaleY * disZ;
      const sourceX = 0 | Math.round(x + disX);
      const sourceY = 0 | Math.round(y + disY);
      let sourceOffset =
        clamp(sourceY, height) * width * 4 + clamp(sourceX, width) * 4;
      destBuf[offset++] = sourceBuf[sourceOffset++];
      destBuf[offset++] = sourceBuf[sourceOffset++];
      destBuf[offset++] = sourceBuf[sourceOffset++];
    }
  }
  imageData.data.set(destBuf);
  return imageData;
}
