import { canvasFromImageData } from './resize';

export function shiftImageData(
  imageData: ImageData,
  shiftX: number,
  shiftY: number,
): ImageData {
  if (shiftX === 0 && shiftY === 0) return imageData;
  const { width, height } = imageData;
  const src = canvasFromImageData(imageData);
  const canvas =
    new OffscreenCanvas(width, height) ??
    Object.assign(document.createElement('canvas'), { width, height });
  const ctx = canvas.getContext('2d')!;
  const sx = ((shiftX % width) + width) % width;
  const sy = ((shiftY % height) + height) % height;
  // Draw four quadrants to wrap around
  ctx.drawImage(src, sx, sy);
  ctx.drawImage(src, sx - width, sy);
  ctx.drawImage(src, sx, sy - height);
  ctx.drawImage(src, sx - width, sy - height);
  return ctx.getImageData(0, 0, width, height);
}
