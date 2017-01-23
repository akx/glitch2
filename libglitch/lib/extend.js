function extend(target, ...args) {
  let source;
  while (source = args.shift()) {
    for (const key in source) {  // eslint-disable-line no-restricted-syntax
      if (source.hasOwnProperty(key)) {  // eslint-disable-line no-prototype-builtins
        target[key] = source[key];
      }
    }
  }
  return target;
}

module.exports = extend;
