const defaults = require('../lib/defaults');
const p = require('../param');
const blendModes = require('../lib/nativeBlendModes');

function xform(glitchContext, options) {
  options = defaults(options, xform.paramDefaults);

  if (options.multiplier >= 1) {
    return;
  }
  const { width, height } = glitchContext.getSize();
  const context = glitchContext.getContext();
  context.globalAlpha = options.blend;
  context.globalCompositeOperation = options.operation;
  context.setTransform(1, 0, 0, 1, 0, 0, 0);
  context.translate(
    width / 2 + (options.xOffset / 100 * width),
    height / 2 + (options.yOffset / 100 * height),
  );
  context.rotate(options.rotation * 0.0174533);

  if (options.xFlip) {
    context.scale(-1, 1);
  }
  if (options.yFlip) {
    context.scale(1, -1);
  }
  context.drawImage(
    context.canvas,
    width * -0.5,
    height * -0.5,
  );
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.globalAlpha = 1;
  context.globalCompositeOperation = 'source-over';
}

xform.paramDefaults = {
  blend: 1,
  xFlip: false,
  yFlip: false,
  rotation: 0,
  xOffset: 0,
  yOffset: 0,
  operation: 'source-over',
};

xform.params = [
  p.bool('xFlip'),
  p.bool('yFlip'),
  p.num('rotation', { min: -360, max: +360 }),
  p.num('xOffset', { min: -100, max: +100 }),
  p.num('yOffset', { min: -100, max: +100 }),
  p.num('blend', { description: 'blend' }),
  p.choice('operation', blendModes),
];

module.exports = xform;
