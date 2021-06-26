export function randint(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function birandint(min: number, max: number): number {
  const sign = Math.random() <= 0.5 ? -1 : +1;
  return randint(min, max) * sign;
}

export function rand(min = 0, max = 1): number {
  return Math.random() * (max - min) + min;
}
