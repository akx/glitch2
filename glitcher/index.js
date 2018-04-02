const UI = require('./ui');
const Engine = require('./engine');
const lennaData = require('!url-loader!./lenna.jpg');  // eslint-disable-line
require('font-awesome/css/font-awesome.css');
require('./look/glitcher.less');
const injectGA = require('./inject-ga');

function loadLenna(engine) {
  const sourceImage = new Image();
  sourceImage.src = lennaData;
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
  const targetCanvas = document.createElement('canvas');
  targetCanvas.width = 32;
  targetCanvas.height = 32;
  targetCanvas.id = 'target';
  document.body.appendChild(targetCanvas);

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
