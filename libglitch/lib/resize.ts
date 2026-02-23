export function canvasFromImageData(imageData: ImageData): CanvasImageSource {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = imageData.width;
  tempCanvas.height = imageData.height;
  const tempContext = tempCanvas.getContext('2d');
  if (!tempContext) {
    throw new Error('oops');
  }
  tempContext.putImageData(imageData, 0, 0);
  return tempCanvas;
}

export function resizeImage(
  img: CanvasImageSource,
  width: number,
  height: number,
  smooth: boolean,
): ImageData {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = 0 | width;
  tempCanvas.height = 0 | height;
  const tempContext = tempCanvas.getContext('2d');
  if (!tempContext) {
    throw new Error('oops');
  }
  tempContext.imageSmoothingEnabled = smooth;
  tempContext.drawImage(img, 0, 0, width, height);
  return tempContext.getImageData(0, 0, width, height);
}
