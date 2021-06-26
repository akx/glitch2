import * as p from '../param';
import dataBlend from '../lib/dataBlend';
import GlitchContext from '../GlitchContext';

function bufferLoad(
  glitchContext: GlitchContext,
  pOptions: Partial<BufferLoadOptions>,
) {
  const options = { ...bufferLoadDefaults, ...pOptions };
  const id = `buffer${options.id}`;
  const buf = glitchContext.persist[id] as ImageData | undefined;
  if (!buf) return;
  if (options.blend >= 1) {
    glitchContext.setImageData(buf);
  } else {
    const destData = glitchContext.getImageData();
    dataBlend(buf, destData, options.blend, 1.0 - options.blend, options.mode);
    glitchContext.setImageData(destData);
  }
}

interface BufferLoadOptions {
  mode: string;
  blend: number;
  id: number;
}

const bufferLoadDefaults: BufferLoadOptions = {
  id: 0,
  blend: 1,
  mode: 'normal',
};
bufferLoad.paramDefaults = bufferLoadDefaults;

bufferLoad.params = [
  p.int('id', { description: 'buffer ID' }),
  p.num('blend', { description: 'blend%' }),
  p.choice('mode', dataBlend.modes, { description: 'blend mode' }),
];

export default bufferLoad;
