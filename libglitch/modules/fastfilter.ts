import * as p from '../param';
import { Parameter } from '../param';
import blendModes from '../lib/nativeBlendModes';
import GlitchContext from '../GlitchContext';
import { Filter } from '../types';

export interface FastFilterOptions {
  blend: number;
  operation: GlobalCompositeOperation;
  iterations: number;
}

function fastfilterCore<T extends Record<string, never>>(
  glitchContext: GlitchContext,
  pOptions: Partial<T & FastFilterOptions>,
  filterFn: (t: T) => string,
) {
  const options: FastFilterOptions & T = {
    ...fastFilterDefaults,
    ...pOptions,
  } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
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

const fastFilterDefaults = {
  blend: 1,
  iterations: 1,
  operation: 'source-over', // TODO: implement
};
fastfilterCore.paramDefaults = fastFilterDefaults;

const baseParams: Parameter[] = [
  p.num('blend', { description: 'blend' }),
  p.int('iterations', { min: 1, max: 15 }),
  p.choice('operation', blendModes),
];

function build<T extends Record<string, never>>(
  filterFn: (t: T) => string,
  params: readonly Parameter[] = [],
  paramDefaults = {},
): Filter<T & FastFilterOptions> {
  const func: Filter<T & FastFilterOptions> = (
    glitchContext: GlitchContext,
    options: Partial<T & FastFilterOptions>,
  ) => fastfilterCore(glitchContext, options, filterFn);
  func.paramDefaults = {
    ...fastfilterCore.paramDefaults,
    ...paramDefaults,
  } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  func.params = params.concat(baseParams);
  return func;
}

export const blur = build(
  ({ strength }) => `blur(${strength}px)`,
  [p.num('strength', { max: 100 })],
  { strength: 0 },
);

export const brightness = build(
  ({ adjust }) => `brightness(${adjust}%)`,
  [p.num('adjust', { min: 0, max: 1000 })],
  { adjust: 100 },
);

export const contrast = build(
  ({ adjust }) => `contrast(${adjust}%)`,
  [p.num('adjust', { min: 0, max: 1000 })],
  { adjust: 100 },
);

export const saturate = build(
  ({ adjust }) => `saturate(${adjust}%)`,
  [p.num('adjust', { min: 0, max: 1000 })],
  { adjust: 100 },
);

export const hue = build(
  ({ degrees }) => `hue-rotate(${degrees}deg)`,
  [p.num('degrees', { min: -180, max: 180 })],
  { degrees: 0 },
);
