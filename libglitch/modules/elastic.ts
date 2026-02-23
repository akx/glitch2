import { rand, randint } from '../lib/rand';
import * as p from '../param';
import GlitchContext from '../GlitchContext';

interface ElasticOptions {
  xMinStretch: number;
  iterations: number;
  yMaxStretch: number;
  yChance: number;
  yMinStretch: number;
  xMaxStretch: number;
  xChance: number;
  smooth: boolean;
}

function elastic(
  glitchContext: GlitchContext,
  pOptions: Partial<ElasticOptions>,
) {
  const options = { ...elasticDefaults, ...pOptions };
  const canvas = glitchContext.copyCanvas();
  const context = canvas.getContext('2d');
  if (!context) {
    return;
  }
  context.imageSmoothingEnabled = options.smooth;
  const { iterations } = options;
  const { width, height } = canvas;
  for (let i = 0; i < iterations; i++) {
    if (rand() < options.xChance) {
      const x = randint(0, width);
      const stretch = 1 + rand(options.xMinStretch, options.xMaxStretch);
      if (rand() < 0.5) {
        // left half
        const targetWidth = x * stretch;
        context.drawImage(
          canvas,
          0,
          0,
          x,
          height,
          x - targetWidth,
          0,
          targetWidth,
          height,
        );
      } else {
        // right half
        const targetWidth = (width - x) * stretch;
        context.drawImage(
          canvas,
          x,
          0,
          width - x,
          height,
          x,
          0,
          targetWidth,
          height,
        );
      }
    }
    if (rand() < options.yChance) {
      const y = randint(0, height);
      const stretch = 1 + rand(options.yMinStretch, options.yMaxStretch);
      if (rand() < 0.5) {
        // top half
        const targetHeight = y * stretch;
        context.drawImage(
          canvas,
          0,
          0,
          width,
          y,
          0,
          y - targetHeight,
          width,
          targetHeight,
        );
      } else {
        // bottom half
        const targetHeight = (height - y) * stretch;
        context.drawImage(
          canvas,
          0,
          y,
          width,
          height - y,
          0,
          y,
          width,
          targetHeight,
        );
      }
    }
  }
  glitchContext.setImageData(context.getImageData(0, 0, width, height));
}

const elasticDefaults: ElasticOptions = {
  iterations: 1,
  smooth: true,
  xChance: 0.1,
  xMinStretch: 0,
  xMaxStretch: 0.1,
  yChance: 0.1,
  yMinStretch: 0,
  yMaxStretch: 0.1,
};
elastic.paramDefaults = elasticDefaults;

elastic.params = [
  p.int('iterations', {
    min: 0,
    max: 100,
    description: 'Number of iterations',
  }),
  p.num('xChance', { max: 1 }),
  p.num('xMinStretch', { max: 2 }),
  p.num('xMaxStretch', { max: 2 }),
  p.num('yChance', { max: 1 }),
  p.num('yMinStretch', { max: 2 }),
  p.num('yMaxStretch', { max: 2 }),
  p.bool('smooth'),
];

export default elastic;
