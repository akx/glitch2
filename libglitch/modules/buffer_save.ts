import * as p from '../param';
import GlitchContext from '../GlitchContext';

interface BufferSaveOptions {
  id: number;
  reset: boolean;
}

function bufferSave(
  glitchContext: GlitchContext,
  pOptions: Partial<BufferSaveOptions>,
) {
  const options = { ...bufferSaveDefaults, ...pOptions };
  const id = `buffer${options.id}`;
  glitchContext.persist[id] = options.reset
    ? null
    : glitchContext.copyImageData();
}

const bufferSaveDefaults = {
  id: 0,
  reset: false,
};
bufferSave.paramDefaults = bufferSaveDefaults;

bufferSave.params = [
  p.int('id', { description: 'buffer ID' }),
  p.bool('reset', { description: 'reset the buffer' }),
];

export default bufferSave;
