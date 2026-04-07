import * as p from '../param';
import blendModes from '../lib/nativeBlendModes';
import GlitchContext from '../GlitchContext';

function xform(glitchContext: GlitchContext, pOptions: Partial<XformOptions>) {
  const options = { ...xformDefaults, ...pOptions };

  // TODO: reinstate?
  // if (options.multiplier >= 1) {
  //   return;
  // }
  const { width, height } = glitchContext.getSize();
  const context = glitchContext.getContext();
  const canvas = context.canvas;

  let newWidth = width;
  let newHeight = height;
  if (options.fitRotation && options.rotation !== 0) {
    const radians = Math.abs(options.rotation * 0.0174533);
    const cos = Math.abs(Math.cos(radians));
    const sin = Math.abs(Math.sin(radians));
    newWidth = Math.ceil(width * cos + height * sin);
    newHeight = Math.ceil(width * sin + height * cos);
  }

  // Copy the current canvas content before resizing
  const copy = document.createElement('canvas');
  copy.width = width;
  copy.height = height;
  copy.getContext('2d')!.drawImage(canvas, 0, 0);

  if (newWidth !== width || newHeight !== height) {
    canvas.width = newWidth;
    canvas.height = newHeight;
    // Redraw original content centered on the new canvas
    context.drawImage(copy, (newWidth - width) / 2, (newHeight - height) / 2);
  }

  context.globalAlpha = options.blend;
  context.globalCompositeOperation =
    options.operation as GlobalCompositeOperation;
  context.imageSmoothingEnabled = options.smooth;
  context.setTransform(1, 0, 0, 1, 0, 0);
  const halfWidth = newWidth / 2;
  const halfHeight = newHeight / 2;

  context.translate(
    halfWidth + (options.xOffset / 100) * newWidth,
    halfHeight + (options.yOffset / 100) * newHeight,
  );
  context.rotate(options.rotation * 0.0174533);

  context.scale(
    options.xScale * (options.xFlip ? -1 : 1),
    options.yScale * (options.yFlip ? -1 : 1),
  );

  context.drawImage(copy, -width / 2, -height / 2);
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.globalAlpha = 1;
  context.globalCompositeOperation = 'source-over';
}

interface XformOptions {
  yOffset: number;
  xOffset: number;
  blend: number;
  rotation: number;
  xScale: number;
  xFlip: boolean;
  yScale: number;
  yFlip: boolean;
  operation: GlobalCompositeOperation;
  smooth: boolean;
  fitRotation: boolean;
}

const xformDefaults: XformOptions = {
  blend: 1,
  fitRotation: false,
  operation: 'source-over',
  rotation: 0,
  smooth: true,
  xFlip: false,
  xOffset: 0,
  xScale: 1,
  yFlip: false,
  yOffset: 0,
  yScale: 1,
};
xform.paramDefaults = xformDefaults;

xform.params = [
  p.bool('xFlip'),
  p.bool('yFlip'),
  p.num('rotation', { min: -360, max: +360 }),
  p.num('xScale', { min: 0, max: 50 }),
  p.num('yScale', { min: 0, max: 50 }),
  p.num('xOffset', { min: -100, max: +100 }),
  p.num('yOffset', { min: -100, max: +100 }),
  p.num('blend', { description: 'blend' }),
  p.choice('operation', blendModes),
  p.bool('smooth'),
  p.bool('fitRotation'),
];

export default xform;
