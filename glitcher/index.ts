import * as UI from './ui';
import Engine from './engine';
import './look/glitcher.less';
import injectGA from './inject-ga';

function loadLenna(engine: Engine) {
  const sourceImage = new Image();
  // eslint-disable-next-line global-require,@typescript-eslint/no-var-requires
  sourceImage.src = require('./lenna.jpg').default;
  engine.sourceImage = sourceImage;
}

function addPasteHandler(engine: Engine) {
  document.addEventListener(
    'paste',
    (event) => {
      const { clipboardData } = event;
      if (!clipboardData) return;
      const imageItem = Array.from(clipboardData.items).find(
        (item) => item.type.indexOf('image') > -1,
      );
      if (imageItem && confirm('Paste image into Glitch2?')) {
        const blob = imageItem.getAsFile();
        const url = URL.createObjectURL(blob);
        const pasteSourceImage = new Image();
        pasteSourceImage.src = url;
        engine.sourceImage = pasteSourceImage;
      }
    },
    false,
  );
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
  const gaid = window.GA_ID;
  if (gaid) {
    injectGA(gaid);
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('load', init, false);
} else {
  throw new Error('Glitcher requires a browser-like environment.');
}
