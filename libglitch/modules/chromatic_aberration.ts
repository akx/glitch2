import * as p from '../param';
import GlitchContext from '../GlitchContext';

const channelColors = ['#ff0000', '#00ff00', '#0000ff'] as const;

export function chromaticAberrationCore(
  glitchContext: GlitchContext,
  offsets: [[number, number], [number, number], [number, number]],
  hueRotate: number,
) {
  if (
    !offsets[0][0] &&
    !offsets[0][1] &&
    !offsets[1][0] &&
    !offsets[1][1] &&
    !offsets[2][0] &&
    !offsets[2][1]
  ) {
    return;
  }

  const ctx = glitchContext.getContext();

  if (hueRotate) {
    ctx.filter = `hue-rotate(${hueRotate}deg)`;
    ctx.drawImage(ctx.canvas, 0, 0);
    ctx.filter = 'none';
  }

  const srcCanvas = glitchContext.copyCanvas();
  const { width, height } = ctx.canvas;

  const tmpCanvas = document.createElement('canvas');
  tmpCanvas.width = width;
  tmpCanvas.height = height;
  const tmpCtx = tmpCanvas.getContext('2d')!;

  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'lighter';

  for (let i = 0; i < 3; i++) {
    const [dx, dy] = offsets[i];
    const color = channelColors[i];

    tmpCtx.globalCompositeOperation = 'source-over';
    tmpCtx.clearRect(0, 0, width, height);
    tmpCtx.drawImage(srcCanvas, dx, dy);
    tmpCtx.globalCompositeOperation = 'multiply';
    tmpCtx.fillStyle = color;
    tmpCtx.fillRect(0, 0, width, height);

    ctx.drawImage(tmpCanvas, 0, 0);
  }

  ctx.globalCompositeOperation = 'source-over';

  if (hueRotate) {
    ctx.filter = `hue-rotate(${-hueRotate}deg)`;
    ctx.drawImage(ctx.canvas, 0, 0);
    ctx.filter = 'none';
  }
}

// Angular variant: angle + distance per channel

interface AngularOptions {
  rAngle: number;
  rDistance: number;
  gAngle: number;
  gDistance: number;
  bAngle: number;
  bDistance: number;
  hueRotate: number;
}

const angularDefaults: AngularOptions = {
  rAngle: 0,
  rDistance: 0,
  gAngle: 120,
  gDistance: 0,
  bAngle: 240,
  bDistance: 0,
  hueRotate: 0,
};

function polarToXY(angle: number, distance: number): [number, number] {
  const rad = (angle * Math.PI) / 180;
  return [Math.cos(rad) * distance, Math.sin(rad) * distance];
}

function chromaticAberrationAngular(
  glitchContext: GlitchContext,
  pOptions: Partial<AngularOptions>,
) {
  const o = { ...angularDefaults, ...pOptions };
  chromaticAberrationCore(
    glitchContext,
    [
      polarToXY(o.rAngle, o.rDistance),
      polarToXY(o.gAngle, o.gDistance),
      polarToXY(o.bAngle, o.bDistance),
    ],
    o.hueRotate,
  );
}

chromaticAberrationAngular.paramDefaults = angularDefaults;
chromaticAberrationAngular.params = [
  p.int('rAngle', { description: 'Red angle (degrees)', min: 0, max: 359 }),
  p.int('rDistance', { description: 'Red distance', min: -50, max: 50 }),
  p.int('gAngle', { description: 'Green angle (degrees)', min: 0, max: 359 }),
  p.int('gDistance', { description: 'Green distance', min: -50, max: 50 }),
  p.int('bAngle', { description: 'Blue angle (degrees)', min: 0, max: 359 }),
  p.int('bDistance', { description: 'Blue distance', min: -50, max: 50 }),
  p.int('hueRotate', {
    description: 'Hue rotation (degrees)',
    min: -180,
    max: 180,
  }),
];

// Cartesian variant: x/y offset per channel

interface CartesianOptions {
  rOffsetX: number;
  rOffsetY: number;
  gOffsetX: number;
  gOffsetY: number;
  bOffsetX: number;
  bOffsetY: number;
  hueRotate: number;
}

const cartesianDefaults: CartesianOptions = {
  rOffsetX: 0,
  rOffsetY: 0,
  gOffsetX: 0,
  gOffsetY: 0,
  bOffsetX: 0,
  bOffsetY: 0,
  hueRotate: 0,
};

const offsetRange = { min: -50, max: 50 };

function chromaticAberrationCartesian(
  glitchContext: GlitchContext,
  pOptions: Partial<CartesianOptions>,
) {
  const o = { ...cartesianDefaults, ...pOptions };
  chromaticAberrationCore(
    glitchContext,
    [
      [o.rOffsetX, o.rOffsetY],
      [o.gOffsetX, o.gOffsetY],
      [o.bOffsetX, o.bOffsetY],
    ],
    o.hueRotate,
  );
}

chromaticAberrationCartesian.paramDefaults = cartesianDefaults;
chromaticAberrationCartesian.params = [
  p.int('rOffsetX', { description: 'Red X offset', ...offsetRange }),
  p.int('rOffsetY', { description: 'Red Y offset', ...offsetRange }),
  p.int('gOffsetX', { description: 'Green X offset', ...offsetRange }),
  p.int('gOffsetY', { description: 'Green Y offset', ...offsetRange }),
  p.int('bOffsetX', { description: 'Blue X offset', ...offsetRange }),
  p.int('bOffsetY', { description: 'Blue Y offset', ...offsetRange }),
  p.int('hueRotate', {
    description: 'Hue rotation (degrees)',
    min: -180,
    max: 180,
  }),
];

export { chromaticAberrationAngular, chromaticAberrationCartesian };
