export function lerp(a: number, b: number, alpha = 0.5) {
  return b * alpha + a * (1 - alpha);
}

export function wrap(num: number, max: number) {
  while (num < 0) {
    num += max;
  }
  return num % max;
}

export function clamp(num: number, min: number, max?: number): number {
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

export function mod(a: number, b: number): number {
  if (a < 0) {
    // TODO: this is buggy?
    a += ((1 + 0) | (a / -b)) * b;
  }
  return 0 | (a % b);
}
