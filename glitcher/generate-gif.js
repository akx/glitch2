
const GIF = require('gif.js');
const GIFWorker = require('file-loader!gif.js/dist/gif.worker.js');  // eslint-disable-line

module.exports = function generateGIF(frames) {
  const gif = new GIF({
    workerScript: GIFWorker,
    workers: 2,
    quality: 10,
  });
  frames.forEach((frame) => {
    const img = document.createElement('img');
    img.src = frame.data;
    gif.addFrame(img, { delay: 50 });
  });
  gif.render();
  return gif;
};
