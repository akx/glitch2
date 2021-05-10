import Context from '../libglitch/GlitchContext';
import modules from '../libglitch/modules';
import State from './State';

class Engine {
  constructor(targetCanvas) {
    this.rate = 40;
    this.state = new State(modules);
    this.sourceImage = null;
    this.targetCanvas = targetCanvas;
    this.glitchContext = new Context(targetCanvas);
    this.renderTime = 0;
  }

  renderFrame() {
    const {
      sourceImage, targetCanvas, glitchContext, state,
    } = this;
    if (!sourceImage.complete) return;
    const t0 = +new Date();
    targetCanvas.width = 0 | sourceImage.width;
    targetCanvas.height = 0 | sourceImage.height;
    glitchContext.clock = +new Date();
    glitchContext.getContext().drawImage(sourceImage, 0, 0);
    if (state) {
      state.defs.forEach((def) => {
        if (!def.enabled) return;
        if (def.probability <= 0) return;
        if (def.probability < Math.random()) return;
        const defT0 = +new Date();
        def.module(glitchContext, def.options);
        const defT1 = +new Date();
        def.renderTime = (defT1 - defT0);
      });
    }
    glitchContext.finalize();
    const t1 = +new Date();
    this.renderTime = (t1 - t0);
  }

  renderLoop() {
    try {
      if (this.rate > 0) this.renderFrame();
    } finally {
      const self = this;
      setTimeout(() => {
        self.renderLoop();
      }, Math.max(2, 4000 / this.rate));
    }
  }

  toDataURL() {
    return this.targetCanvas.toDataURL();
  }

  toURL(type = 'image/png', encoderOptions, forceDataUrl = false) {
    const blobUrlSupported = (
      (typeof this.targetCanvas.toBlob === 'function')
      && (typeof URL.createObjectURL === 'function')
    );
    return new Promise((resolve) => {
      if (blobUrlSupported && !forceDataUrl) {
        this.targetCanvas.toBlob((blob) => {
          resolve(URL.createObjectURL(blob));
        }, type, encoderOptions);
      } else {
        resolve(this.targetCanvas.toDataURL(type, encoderOptions));
      }
    });
  }
}

export default Engine;
