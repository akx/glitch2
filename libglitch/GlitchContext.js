function GlitchContext(canvas) {
  /** @type canvas {HTMLCanvasElement} */
  this._canvas = canvas;
  this._context = canvas.getContext('2d');
  this._imageData = null;
  this.clock = +new Date();
  this.persist = {};
}

/**
 * Effect modules should primarily use this to get a reference to the image data
 * for the current context. It may return a pre-existing ImageData object, or it may
 * call the (possibly expensive) `context.getImageData` method.
 * @returns {ImageData}
 */
GlitchContext.prototype.getImageData = function getImageData() {
  if (this._imageData) return this._imageData;
  return this._context.getImageData(0, 0, this._canvas.width, this._canvas.height);
};

/**
 * When a fresh _copy_ of image data is required, call this potentially expensive method.
 * @returns {ImageData}
 */
GlitchContext.prototype.copyImageData = function copyImageData() {
  this._commitImageData();
  return this._context.getImageData(0, 0, this._canvas.width, this._canvas.height);
};

/**
 * When an effect is done with image data, it should call this to ensure the context
 * knows of any possible changes to it.
 * @param newImageData {ImageData} Modified image data.
 */
GlitchContext.prototype.setImageData = function setImageData(newImageData) {
  if (this._imageData === newImageData) return;
  this._commitImageData();
  this._imageData = newImageData;
};

GlitchContext.prototype._commitImageData = function _commitImageData() {
  if (this._imageData) {
    this._context.putImageData(this._imageData, 0, 0);
    this._imageData = null;
  }
};

/**
 * If an effect requires the actual 2D Canvas context instead of just ImageData,
 * it can call this. May be expensive.
 * @returns {CanvasRenderingContext2D}
 */
GlitchContext.prototype.getContext = function getContext() {
  this._commitImageData();
  return this._context;
};

/**
 * Copy the image data into a new `canvas` element. Can be expensive.
 * @returns {HTMLCanvasElement}
 */
GlitchContext.prototype.copyCanvas = function copyCanvas() {
  /* eslint-env browser */
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = this._canvas.width;
  tempCanvas.height = this._canvas.height;
  const tempContext = tempCanvas.getContext('2d');
  this._commitImageData();
  tempContext.drawImage(this._canvas, 0, 0);
  return tempCanvas;
};

/**
 * This should be called to ensure all changes to the canvas have been committed.
 */
GlitchContext.prototype.finalize = function finalize() {
  this._commitImageData();
};


module.exports = GlitchContext;
