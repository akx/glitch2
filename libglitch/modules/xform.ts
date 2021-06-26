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
  context.globalAlpha = options.blend;
  context.globalCompositeOperation = options.operation;
  context.imageSmoothingEnabled = options.smooth;
  context.setTransform(1, 0, 0, 1, 0, 0);
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  context.translate(
    halfWidth + (options.xOffset / 100) * width,
    halfHeight + (options.yOffset / 100) * height,
  );
  context.rotate(options.rotation * 0.0174533);

  context.scale(
    options.xScale * (options.xFlip ? -1 : 1),
    options.yScale * (options.yFlip ? -1 : 1),
  );

  context.drawImage(context.canvas, -halfWidth, -halfHeight);
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
  operation: string;
  smooth: boolean;
}

const xformDefaults: XformOptions = {
  blend: 1,
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
];

export default xform;
