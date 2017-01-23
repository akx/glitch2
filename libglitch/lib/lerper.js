const lerperCache = {};
const constantA = a => a;
const constantB = (a, b) => b;

function lerper(alpha) {
  let cached;
  if (alpha <= 0) {
    return constantA;
  }
  if (alpha >= 1) {
    return constantB;
  }
  const key = 0 | alpha * 100;
  if (cached = lerperCache[key]) return cached;
  const beta = 1 - alpha;
  return (lerperCache[key] = new Function('a', 'b', `return b * ${alpha} + a * ${beta}`));
}

module.exports = lerper;
