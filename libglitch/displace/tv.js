/* eslint-env browser */
function createTVDisplacementMap(width = 256, height = 224) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);
  const data = context.getImageData(0, 0, width, height);
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      const ix = (x / width - 0.5) * 2;
      const iy = (y / height - 0.5) * 2;
      let cdis = 1.0 - (ix * ix + iy * iy);
      cdis = Math.cos(cdis * 3.141 / 2.0);
      const an = Math.atan2(iy, ix);
      const xd = -Math.cos(an) * 125 * cdis;
      const yd = -Math.sin(an) * 125 * cdis;
      const offset = y * width * 4 + x * 4;
      data.data[offset] = 127 + xd;
      data.data[offset + 1] = 127 + yd;
      data.data[offset + 2] = 127;
    }
  }
  context.putImageData(data, 0, 0);
  return canvas;
}

module.exports = createTVDisplacementMap;
