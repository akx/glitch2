import GlitchContext from './GlitchContext';
import { Parameter } from './param';

export type FilterFunc<T> = (
  glitchContext: GlitchContext,
  pOptions: Partial<T>,
) => void;

export type Filter<T> = FilterFunc<T> & {
  params: Parameter[];
  paramDefaults: T;
  friendlyName?: string;
};
