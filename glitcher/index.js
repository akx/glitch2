import * as UI from './ui';
import Engine from './engine';
import './look/glitcher.less';
import injectGA from './inject-ga';

function loadLenna(engine) {
  const sourceImage = new Image();
  // eslint-disable-next-line global-require
  sourceImage.src = require('./lenna.jpg');
  engine.sourceImage = sourceImage;
}

function addPasteHandler(engine) {
  document.addEventListener('paste', (event) => {
    let imageItem = null;
    for (let i = 0; i < event.clipboardData.items.length; i++) {
      const item = event.clipboardData.items[i];
      if (item.type.indexOf('image') > -1) {
        imageItem = item;
        break;
      }
    }
    // eslint-disable-next-line no-restricted-globals, no-alert
    if (imageItem && confirm('Paste image into Glitch2?')) {
      const blob = imageItem.getAsFile();
      const url = URL.createObjectURL(blob);
      const pasteSourceImage = new Image();
      pasteSourceImage.src = url;
      engine.sourceImage = pasteSourceImage;
    }
  }, false);
}

function init() {
  const targetCanvasWrapper = document.createElement('div');
  targetCanvasWrapper.id = 'target-wrapper';
  const targetCanvas = document.createElement('canvas');
  targetCanvas.width = 32;
  targetCanvas.height = 32;
  targetCanvas.id = 'target';
  document.body.appendChild(targetCanvasWrapper);
  targetCanvasWrapper.appendChild(targetCanvas);

  const engine = new Engine(targetCanvas);
  loadLenna(engine);
  addPasteHandler(engine);
  engine.state.loadFromLocalStorage();
  UI.init(engine);
  engine.renderLoop();
  if (typeof GA_ID !== 'undefined') {
    // eslint-disable-next-line no-undef
    injectGA(GA_ID);
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('load', init, false);
} else {
  throw new Error('Glitcher requires a browser-like environment.');
}
