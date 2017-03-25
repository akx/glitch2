const defaults = require('../lib/defaults');
const p = require('../param');
const dataBlend = require('../lib/dataBlend');

function bufferLoad(glitchContext, options) {
  options = defaults(options, bufferLoad.paramDefaults);
  const id = `buffer${options.id}`;
  const buf = glitchContext.persist[id];
  if (!buf) return;
  if (options.blend >= 1) {
    glitchContext.setImageData(buf);
  } else {
    const destData = glitchContext.getImageData();
    dataBlend(buf, destData, options.blend, 1.0 - options.blend, 'normal');
    glitchContext.setImageData(destData);
  }
}

bufferLoad.paramDefaults = {
  id: 0,
  blend: 1,
};

bufferLoad.params = [
  p.int('id', {description: 'buffer ID'}),
  p.num('blend', {description: 'blend%'}),
];

module.exports = bufferLoad;
