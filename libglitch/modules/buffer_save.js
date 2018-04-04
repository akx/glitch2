import defaults from '../lib/defaults';
import p from '../param';

function bufferSave(glitchContext, options) {
  options = defaults(options, bufferSave.paramDefaults);
  const id = `buffer${options.id}`;
  glitchContext.persist[id] = (options.reset ? null : glitchContext.copyImageData());
}
bufferSave.paramDefaults = {
  id: 0,
  reset: false,
};

bufferSave.params = [
  p.int('id', { description: 'buffer ID' }),
  p.bool('reset', { description: 'reset the buffer' }),
];

export default bufferSave;
