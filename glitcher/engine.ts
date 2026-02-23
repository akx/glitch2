import modules from '../libglitch/modules';
import State from './State';
import GlitchContext from '../libglitch/GlitchContext';
import { Filter } from '../libglitch/types';
import { resolveIterations, resolveOptions } from './util';

class Engine {
  public rate: number;

  public state: State;

  public sourceImage: CanvasImageSource | null;

  public targetSize: [number, number] | null;

  private readonly targetCanvas: HTMLCanvasElement;

  private glitchContext: GlitchContext;

  public renderTime: number;

  constructor(targetCanvas: HTMLCanvasElement) {
    this.rate = 40;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.state = new State(modules as unknown as Record<string, Filter<any>>); // TODO
    this.sourceImage = null;
    this.targetSize = null;
    this.targetCanvas = targetCanvas;
    this.glitchContext = new GlitchContext(targetCanvas);
    this.renderTime = 0;
  }

  private isSourceReady(): boolean {
    const { sourceImage } = this;
    if (!sourceImage) return false;
    if (sourceImage instanceof HTMLVideoElement) {
      return sourceImage.readyState >= 2;
    }
    if (sourceImage instanceof HTMLImageElement) {
      return sourceImage.complete;
    }
    return true;
  }

  private getNativeSourceDimensions(): [number, number] {
    const { sourceImage, targetCanvas } = this;
    if (sourceImage instanceof HTMLVideoElement) {
      return [sourceImage.videoWidth, sourceImage.videoHeight];
    }
    if (sourceImage instanceof HTMLImageElement) {
      return [sourceImage.width, sourceImage.height];
    }
    return [targetCanvas.width, targetCanvas.height];
  }

  public getSourceDimensions(): [number, number] {
    return this.targetSize ?? this.getNativeSourceDimensions();
  }

  public renderFrame() {
    const { sourceImage, targetCanvas, glitchContext, state } = this;
    if (!sourceImage || !this.isSourceReady()) return;
    const [width, height] = this.getSourceDimensions();
    if (!width || !height) return;
    const t0 = +new Date();
    targetCanvas.width = 0 | width;
    targetCanvas.height = 0 | height;
    glitchContext.clock = +new Date();
    glitchContext.getContext().drawImage(sourceImage, 0, 0, width, height);
    if (state) {
      state.defs.forEach((def) => {
        if (!def.enabled) return;
        if (def.probability <= 0) return;
        if (def.probability < Math.random()) return;
        const defT0 = +new Date();
        const iters = resolveIterations(def);
        for (let i = 0; i < iters; i++) {
          def.module(glitchContext, resolveOptions(def));
        }
        const defT1 = +new Date();
        def.renderTime = defT1 - defT0;
      });
    }
    glitchContext.finalize();
    const t1 = +new Date();
    this.renderTime = t1 - t0;
  }

  public renderLoop() {
    try {
      if (this.rate > 0) this.renderFrame();
    } finally {
      setTimeout(
        () => {
          this.renderLoop();
        },
        Math.max(2, 4000 / this.rate),
      );
    }
  }

  public toDataURL(): string {
    return this.targetCanvas.toDataURL();
  }

  public toURL(
    type = 'image/png',
    encoderOptions: unknown = {},
    forceDataUrl = false,
  ): Promise<string> {
    const blobUrlSupported =
      typeof this.targetCanvas.toBlob === 'function' &&
      typeof URL.createObjectURL === 'function';
    return new Promise((resolve) => {
      if (blobUrlSupported && !forceDataUrl) {
        this.targetCanvas.toBlob(
          (blob) => {
            if (!blob) {
              throw new Error('Failed to create blob');
            }
            resolve(URL.createObjectURL(blob));
          },
          type,
          encoderOptions,
        );
      } else {
        resolve(this.targetCanvas.toDataURL(type, encoderOptions));
      }
    });
  }
}

export default Engine;
