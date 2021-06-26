/* eslint-disable import/no-webpack-loader-syntax,@typescript-eslint/ban-ts-comment,import/no-unresolved */
import GIF from 'gif.js';
// @ts-ignore
import GIFWorker from 'file-loader!gif.js/dist/gif.worker.js';
import { RecordFrame } from './types';

export default function generateGIF(frames: readonly RecordFrame[]) {
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
}
