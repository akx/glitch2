/* eslint-disable no-restricted-syntax, no-prototype-builtins */
function extend(target, ...args) {
  let source;
  while ((source = args.shift())) {
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
}

export default extend;
