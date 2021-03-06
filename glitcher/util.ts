import { Def } from './types';

export function randomizeDef(def: Def) {
  (def.module.params || []).forEach((paramDef) => {
    const paramName = paramDef.name;
    let rnd = Math.random();
    if (paramDef.randomBias) {
      rnd **= paramDef.randomBias;
    }
    switch (paramDef.type) {
      case 'bool':
        def.options[paramName] = rnd <= 0.5;
        break;
      case 'num':
      case 'int':
        {
          const min = paramDef.min || 0;
          const max = paramDef.max || 1;
          let val = min + rnd * (max - min);
          if (paramDef.type === 'int') val = Math.round(val);
          def.options[paramName] = val;
        }
        break;
      case 'choice':
        if (paramDef.choices) {
          def.options[paramName] =
            paramDef.choices[Math.floor(rnd * paramDef.choices.length)];
        }
        break;
      default:
        break;
    }
  });
}

export function forceDownload(url: string, filename: string): Promise<void> {
  return new Promise((resolve) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      try {
        link.parentNode?.removeChild(link);
      } catch (e) {
        // *shrug*
      }
      resolve();
    }, 15000);
  });
}
