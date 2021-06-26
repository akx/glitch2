/* eslint-disable @typescript-eslint/no-explicit-any */
import { Filter } from '../libglitch/types';
import { Def } from './types';

class State {
  public readonly modules: Record<string, Filter<any>>;

  defs: Def[];

  constructor(modules: Record<string, Filter<any>>) {
    this.modules = modules;
    this.defs = [];
  }

  addModule(moduleName: string, pOptions: Record<string, any> = {}): Def {
    const moduleObj = this.modules[moduleName];
    if (!moduleObj) throw new Error(`Unknown module: ${moduleName}`);
    const options = {
      ...(moduleObj.paramDefaults || {}),
      ...pOptions,
    };
    const def: Def = {
      id: (0 | (Math.random() * 0xffffffff)).toString(36),
      module: moduleObj,
      moduleName,
      options,
      enabled: true,
      uiVisible: true,
      probability: 1,
    };
    this.defs.push(def);
    return def;
  }

  duplicateDef(def: Def) {
    const newDef = this.addModule(def.moduleName, def.options);
    newDef.enabled = def.enabled;
    newDef.probability = def.probability;
  }

  deleteDef(def: Def | string) {
    this.defs = this.defs.filter((d) => d !== def && d.id !== def);
  }

  clear() {
    this.defs = [];
  }

  moveDef(def: Def, direction: number): void {
    const { defs } = this;
    const idx = defs.indexOf(def);
    if (idx === -1) return;
    const [ndef] = defs.splice(idx, 1);
    let newIdx = idx + direction;
    if (newIdx < 0) newIdx = 0;
    if (newIdx >= defs.length) newIdx = defs.length;
    defs.splice(newIdx, 0, ndef);
  }

  serialize(): string {
    return JSON.stringify({
      defs: this.defs.map(
        ({ enabled, id, moduleName, options, probability }) => ({
          id,
          moduleName,
          options,
          enabled: !!enabled,
          probability: +probability,
        }),
      ),
    });
  }

  unserialize(ser: string): void {
    const ss = JSON.parse(ser);
    this.defs = [];
    ss.defs.forEach((serDef: Def) => {
      let def;
      try {
        def = this.addModule(serDef.moduleName, serDef.options);
      } catch (e) {
        return;
      }
      def.id = serDef.id;
      def.enabled = serDef.enabled;
      def.probability = serDef.probability;
    });
  }

  loadFromLocalStorage(key = 'GlitcherState') {
    const serialized = window.localStorage && window.localStorage[key];
    if (serialized) this.unserialize(serialized);
  }

  saveIntoLocalStorage(key = 'GlitcherState') {
    if (window.localStorage) {
      window.localStorage[key] = this.serialize();
    }
  }
}

export default State;
