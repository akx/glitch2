export default class GlitchContext {
  private readonly _canvas: HTMLCanvasElement;

  private readonly _context: CanvasRenderingContext2D;

  private _imageData: ImageData | null = null;

  public clock: number = +new Date();

  public persist: Record<string, unknown> = {};

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Unable to get context');
    }
    this._context = context;
  }

  /**
   * Effect modules should primarily use this to get a reference to the image data
   * for the current context. It may return a pre-existing ImageData object, or it may
   * call the (possibly expensive) `context.getImageData` method.
   * @returns {ImageData}
   */
  getImageData(): ImageData {
    if (this._imageData) return this._imageData;
    return this._context.getImageData(
      0,
      0,
      this._canvas.width,
      this._canvas.height,
    );
  }

  /**
   * When a fresh _copy_ of image data is required, call this potentially expensive method.
   * @returns {ImageData}
   */
  copyImageData(): ImageData {
    this._commitImageData();
    return this._context.getImageData(
      0,
      0,
      this._canvas.width,
      this._canvas.height,
    );
  }

  /**
   * When an effect is done with image data, it should call this to ensure the context
   * knows of any possible changes to it.
   * @param newImageData {ImageData} Modified image data.
   */
  setImageData(newImageData: ImageData) {
    if (this._imageData === newImageData) return;
    this._commitImageData();
    this._imageData = newImageData;
  }

  _commitImageData() {
    if (this._imageData) {
      this._context.putImageData(this._imageData, 0, 0);
      this._imageData = null;
    }
  }

  /**
   * If an effect requires the actual 2D Canvas context instead of just ImageData,
   * it can call this. May be expensive.
   */
  getContext(): CanvasRenderingContext2D {
    this._commitImageData();
    return this._context;
  }

  /**
   * Copy the image data into a new `canvas` element. Can be expensive.
   */
  copyCanvas(): HTMLCanvasElement {
    /* eslint-env browser */
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this._canvas.width;
    tempCanvas.height = this._canvas.height;
    const tempContext = tempCanvas.getContext('2d');
    if (!tempContext) {
      throw new Error('unable to get context');
    }
    this._commitImageData();
    tempContext.drawImage(this._canvas, 0, 0);
    return tempCanvas;
  }

  /**
   * This should be called to ensure all changes to the canvas have been committed.
   */
  finalize() {
    this._commitImageData();
  }

  /**
   * Get the size of the glitch canvas.
   */
  getSize(): { width: number; height: number } {
    const { width, height } = this._canvas;
    return { width, height };
  }
}
