/* eslint-env browser */
const UI = require('./ui');
const Engine = require('./engine');
const lennaData = require('./lenna');
const css = require('./glitcher.css');  // eslint-disable-line no-unused-vars

let engine = null;

function init() {
  const targetCanvas = document.createElement('canvas');
  targetCanvas.width = 32;
  targetCanvas.height = 32;
  targetCanvas.id = 'target';
  document.body.appendChild(targetCanvas);

  const sourceImage = new Image();
  sourceImage.src = lennaData;

  engine = new Engine(targetCanvas);
  engine.state.loadFromLocalStorage();
  engine.sourceImage = sourceImage;
  UI.init(engine);
  engine.renderLoop();
}

if (typeof window !== 'undefined') {
  window.addEventListener('load', init, false);
} else {
  throw new Error('Glitcher requires a browser-like environment.');
}
