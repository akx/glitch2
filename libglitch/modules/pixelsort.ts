import * as p from '../param';
import GlitchContext from '../GlitchContext';
import sortBy from '../lib/sortBy';
import { rgb2hsv } from '../lib/hsv';

type Func = (rgb: RGB) => number;
const functionMap: Record<string, Func> = {
  intensity: (rgb) => (rgb[0] + rgb[1] + rgb[2]) / 3,
  red: (rgb) => rgb[0],
  green: (rgb) => rgb[1],
  blue: (rgb) => rgb[2],
  hue: ([r, g, b]) => rgb2hsv(r, g, b)[0],
  sat: ([r, g, b]) => rgb2hsv(r, g, b)[1] * 100,
};
const functionNames = Object.keys(functionMap).sort();

interface PixelSortOptions {
  threshold: number;
  maxIntervalLength: number;
  metricXor: number;
  sortXor: number;
  metricFunc: string;
  sortFunc: string;
  writeOffset: number;
  mode: string;
  reverse: boolean;
}

type RGB = [number, number, number];

interface Interval {
  start: number;
  metricValue: number;
  pixels: RGB[];
}

function pixelSort(
  glitchContext: GlitchContext,
  pOptions: Partial<PixelSortOptions>,
) {
  const {
    threshold,
    metricXor,
    sortXor,
    metricFunc: metricFuncName,
    sortFunc: sortFuncName,
    writeOffset,
    mode,
    reverse,
    maxIntervalLength,
  } = {
    ...pixelSortDefaults,
    ...pOptions,
  };
  const metricFunc = functionMap[metricFuncName] as Func | undefined;
  const sortFunc = functionMap[sortFuncName] as Func | undefined;
  if (!(metricFunc && sortFunc)) return;
  const imageData = glitchContext.getImageData();
  const { width, height, data } = imageData;

  let aMax: number;
  let bMax: number;
  let getOffset: (a: number, b: number) => number;
  if (mode === 'columns') {
    aMax = width;
    bMax = height;
    getOffset = (a: number, b: number) => (width * b + a) * 4;
  } else {
    aMax = height;
    bMax = width;
    getOffset = (a: number, b: number) => (width * a + b) * 4;
  }

  for (let a = 0; a < aMax; a++) {
    const intervals: Interval[] = [];
    let currentInterval: Interval | null = null;
    for (let b = 0; b < bMax; b++) {
      const offset = getOffset(a, b);
      const rgb: RGB = [data[offset], data[offset + 1], data[offset + 2]];
      const metric = metricFunc(rgb) ^ metricXor;
      if (
        currentInterval &&
        (Math.abs(metric - currentInterval.metricValue) > threshold ||
          (maxIntervalLength > 0 &&
            currentInterval.pixels.length > maxIntervalLength))
      ) {
        currentInterval = null;
      }
      if (!currentInterval) {
        currentInterval = { start: b, metricValue: metric, pixels: [rgb] };
        intervals.push(currentInterval);
      } else {
        currentInterval.pixels.push(rgb);
      }
    }
    intervals.forEach(({ pixels, start }) => {
      const sortedPixels = sortBy(pixels, (px) => sortFunc(px) ^ sortXor);
      if (reverse) sortedPixels.reverse();
      for (let i = 0; i < sortedPixels.length; i++) {
        const [r, g, b] = sortedPixels[i];
        const offset = getOffset(a, i + start) + writeOffset;
        data[offset] = r;
        data[offset + 1] = g;
        data[offset + 2] = b;
      }
    });
  }
  glitchContext.setImageData(imageData);
}

const pixelSortDefaults: PixelSortOptions = {
  threshold: 50,
  maxIntervalLength: 0,
  metricXor: 0,
  sortXor: 0,
  writeOffset: 0,
  metricFunc: 'intensity',
  sortFunc: 'intensity',
  mode: 'rows',
  reverse: false,
};
pixelSort.paramDefaults = pixelSortDefaults;

pixelSort.params = [
  p.int('threshold', { min: 0, max: 255 }),
  p.int('maxIntervalLength', { min: 0, max: 1024 }),
  p.int('metricXor', { min: 0, max: 255 }),
  p.int('sortXor', { min: 0, max: 255 }),
  p.int('writeOffset', { min: -65535, max: 65535 }),
  p.choice('metricFunc', functionNames),
  p.choice('sortFunc', functionNames),
  p.choice('mode', ['rows', 'columns']),
  p.bool('reverse'),
];

export default pixelSort;
