function lerp(a, b, alpha = 0.5) {
  return b * alpha + a * (1 - alpha);
}


function wrap(num, max) {
  while (num < 0) {
    num += max;
  }
  return num % max;
}

function clamp(num, min, max) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  if (num < min) {
    return min;
  }
  if (num >= max) {
    return max;
  }
  return num;
}

function mod(a, b) {
  if (a < 0) {
    a += (1 + 0 | a / -b) * b;
  }
  return 0 | a % b;
}

module.exports.lerp = lerp;
module.exports.wrap = wrap;
module.exports.clamp = clamp;
module.exports.mod = mod;
