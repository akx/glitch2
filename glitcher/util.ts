import { Def } from './types';
import { Parameter } from '../libglitch/param';

function biasedRandom(bias: number): number {
  const rnd = Math.random();
  if (bias === 0) return rnd;
  // bias > 0 skews toward max, bias < 0 skews toward min
  return rnd ** (1 / (1 + bias));
}

function resolveRange(
  opts: Record<string, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  name: string,
): number | undefined {
  const rangeMin = opts[`${name}__rangeMin`];
  const rangeMax = opts[`${name}__rangeMax`];
  if (
    rangeMin !== undefined &&
    rangeMax !== undefined &&
    rangeMin !== rangeMax
  ) {
    const bias: number = opts[`${name}__rangeBias`] ?? 0;
    return rangeMin + biasedRandom(bias) * (rangeMax - rangeMin);
  }
  return undefined;
}

export function resolveIterations(def: Def): number {
  const val = resolveRange(def.options, 'iterations') ?? def.iterations ?? 1;
  return Math.max(0, Math.round(val));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveOptions(def: Def): Record<string, any> {
  const params: Parameter[] = def.module.params || [];
  const opts = { ...def.options };
  // eslint-disable-next-line no-restricted-syntax
  for (const paramDef of params) {
    const { name } = paramDef;

    if (paramDef.type === 'num' || paramDef.type === 'int') {
      const resolved = resolveRange(opts, name);
      if (resolved !== undefined) {
        opts[name] = paramDef.type === 'int' ? Math.round(resolved) : resolved;
      }
    } else if (paramDef.type === 'bool') {
      const threshold = opts[`${name}__rangeMin`];
      if (threshold !== undefined) {
        const bias: number = opts[`${name}__rangeBias`] ?? 0;
        opts[name] = biasedRandom(bias) < threshold;
      }
    }
  }

  return opts;
}

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
