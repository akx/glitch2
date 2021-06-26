import makeTVDisplacement from '../displace/tv';
import displacementMapper from '../displace/mapper';
import * as p from '../param';
import GlitchContext from '../GlitchContext';

interface TVDisplacementOptions {
  strengthX: number;
  strengthY: number;
}

function tvDisplacement(
  glitchContext: GlitchContext,
  pOptions: Partial<TVDisplacementOptions>,
) {
  const options = { ...tvDisplacementDefaults, ...pOptions };
  const data = glitchContext.getImageData();
  const dismapCacheKey = `tvdis_${data.width}_${data.height}`;

  let dismap = glitchContext.persist[dismapCacheKey] as
    | HTMLCanvasElement
    | undefined;
  if (!dismap) {
    dismap = glitchContext.persist[dismapCacheKey] = makeTVDisplacement(
      data.width,
      data.height,
    );
  }
  const newData = displacementMapper(
    data,
    dismap,
    options.strengthX,
    options.strengthY,
  );
  if (newData) glitchContext.setImageData(newData);
}

const tvDisplacementDefaults = {
  strengthX: 0,
  strengthY: 0,
};
tvDisplacement.paramDefaults = tvDisplacementDefaults;

tvDisplacement.params = [
  p.int('strengthX', {
    description: 'displacement strength (x)',
    min: -250,
    max: +250,
  }),
  p.int('strengthY', {
    description: 'displacement strength (y)',
    min: -250,
    max: +250,
  }),
];

export default tvDisplacement;
