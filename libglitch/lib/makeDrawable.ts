/* eslint-env browser */
function makeDrawable(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any,
): HTMLCanvasElement | HTMLImageElement | HTMLVideoElement {
  if (obj.data && obj.width && obj.height) {
    // Quacks like an ImageData, so wrap it in a canvas
    const canvas = document.createElement('canvas');
    canvas.width = obj.width;
    canvas.height = obj.height;
    const context = canvas.getContext('2d');
    context?.putImageData(obj, 0, 0);
    return canvas;
  }
  if (obj.getContext) {
    // Quacks like a Canvas
    return obj as HTMLCanvasElement;
  }
  if (/HTML(Image|Video|Canvas)Element/.test(`${obj}`)) {
    // Quacks like something drawable
    return obj;
  }
  throw new Error(`Can't make a drawable out of ${obj}`);
}

export default makeDrawable;
