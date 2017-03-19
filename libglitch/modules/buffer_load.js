const defaults = require('../lib/defaults');
const p = require('../param');

function bufferLoad(glitchContext, options) {
  options = defaults(options, bufferLoad.paramDefaults);
  const id = `buffer${options.id}`;
  const buf = glitchContext.persist[id];
  if (!buf) return;
  glitchContext.setImageData(buf);
}

bufferLoad.paramDefaults = {
  id: 0,
};

bufferLoad.params = [
  p.int('id', {description: 'buffer ID'}),
];

module.exports = bufferLoad;
