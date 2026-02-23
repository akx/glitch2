// input: r,g,b in [0,255], out: h in [0,360) and s,v in [0,1]
// via https://stackoverflow.com/a/54070620/51685
export function rgb2hsv(
  r: number,
  g: number,
  b: number,
): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const v = Math.max(r, g, b);
  const c = v - Math.min(r, g, b);
  const h =
    c && (v === r ? (g - b) / c : v === g ? 2 + (b - r) / c : 4 + (r - g) / c);
  return [60 * (h < 0 ? h + 6 : h), v ? c / v : 0, v];
}
