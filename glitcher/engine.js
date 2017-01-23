const Glitch = require('../libglitch');
const State = require('./State');

const Engine = function Engine(targetCanvas) {
  this.rate = 40;
  this.state = new State(Glitch.modules);
  this.sourceImage = null;
  this.targetCanvas = targetCanvas;
  this.glitchContext = new Glitch.Context(targetCanvas);
  this.renderTime = 0;
};


Engine.prototype.renderFrame = function renderFrame() {
  const sourceImage = this.sourceImage;
  const targetCanvas = this.targetCanvas;
  const glitchContext = this.glitchContext;
  if (!sourceImage.complete) return;
  const t0 = +new Date();
  targetCanvas.width = 0 | sourceImage.width;
  targetCanvas.height = 0 | sourceImage.height;
  glitchContext.clock = +new Date();
  glitchContext.getContext().drawImage(sourceImage, 0, 0);
  const state = this.state;
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
};

Engine.prototype.renderLoop = function renderLoop() {
  try {
    if (this.rate > 0) this.renderFrame();
  } finally {
    const self = this;
    setTimeout(() => {
      self.renderLoop();
    }, Math.max(2, 4000 / this.rate));
  }
};

Engine.prototype.toDataURL = function toDataURL() {
  return this.targetCanvas.toDataURL();
};

module.exports = Engine;
