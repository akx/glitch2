const defaults = require('../lib/defaults');
const p = require('../param');
const blendModes = require('../lib/nativeBlendModes');

function fastfilterCore(glitchContext, options, filterFn) {
  options = defaults(options, fastfilterCore.options);
  const context = glitchContext.getContext();
  context.filter = filterFn(options);
  context.globalAlpha = options.blend;
  context.globalCompositeOperation = options.operation;
  for (let i = 0; i < options.iterations; i++) {
    context.drawImage(context.canvas, 0, 0);
  }
  context.globalAlpha = 1;
  context.globalCompositeOperation = 'source-over';
}
fastfilterCore.paramDefaults = {
  blend: 1,
  iterations: 1,
  operation: 'source-over', // TODO: implement
};

const baseParams = [
  p.num('blend', { description: 'blend' }),
  p.int('iterations', { min: 1, max: 15 }),
  p.choice('operation', blendModes),
];


const build = (filterFn, params = [], paramDefaults = {}) => Object.assign(
  (glitchContext, options) => fastfilterCore(glitchContext, options, filterFn),
  {
    paramDefaults: Object.assign({}, fastfilterCore.paramDefaults, paramDefaults),
    params: [].concat(params).concat(baseParams),
  }
);

module.exports.blur = build(
  ({ strength }) => `blur(${strength}px)`,
  [p.num('strength', { max: 100 })],
  { strength: 0 }
);

module.exports.brightness = build(
  ({ adjust }) => `brightness(${adjust}%)`,
  [p.num('adjust', { min: 0, max: 1000 })],
  { adjust: 100 }
);

module.exports.contrast = build(
  ({ adjust }) => `contrast(${adjust}%)`,
  [p.num('adjust', { min: 0, max: 1000 })],
  { adjust: 100 }
);

module.exports.saturate = build(
  ({ adjust }) => `saturate(${adjust}%)`,
  [p.num('adjust', { min: 0, max: 1000 })],
  { adjust: 100 }
);

module.exports.hue = build(
  ({ degrees }) => `hue-rotate(${degrees}deg)`,
  [p.num('degrees', { min: -180, max: 180 })],
  { degrees: 0 }
);
