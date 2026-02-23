import Engine from './engine';
import { Filter } from '../libglitch/types';

export interface RecordFrame {
  data: string;
}

export interface UIState {
  engine: Engine;
  ui: {
    stateMgmt: boolean;
    recorder: boolean;
    image: boolean;
    fx: boolean;
    misc: boolean;
    zoom: boolean;
  };
  recordFrames: RecordFrame[];
  gifRenderProgress: number | null;
  cameraStream: MediaStream | null;
}

export interface Def {
  id: string;
  module: Filter<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  moduleName: string;
  options: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  enabled: boolean;
  uiVisible: boolean;
  probability: number;
  iterations: number;
  renderTime?: number;
}
