export type Lerper = (a: number, b: number) => number;
const lerperCache: Record<string, Lerper> = {};
const constantA = (a: number) => a;
const constantB = (a: number, b: number) => b;

function makeLerper(alpha: number): Lerper {
  let cached;
  if (alpha <= 0) {
    return constantA;
  }
  if (alpha >= 1) {
    return constantB;
  }
  const key = 0 | (alpha * 100);
  if ((cached = lerperCache[key])) return cached;
  const beta = 1 - alpha;
  const lerper = (lerperCache[key] = new Function(
    'a',
    'b',
    `return b * ${alpha} + a * ${beta}`,
  ) as Lerper);
  return lerper;
}

export default makeLerper;
