export default function sortBy<T, C>(objects: T[], keyer: (i: T) => C): T[] {
  return objects
    .map((o): [T, C] => [o, keyer(o)])
    .sort(([, a], [, b]) => {
      if (a !== b) {
        if (a > b) {
          return 1;
        }
        if (a < b) {
          return -1;
        }
      }
      return 0;
    })
    .map(([a]) => a);
}
