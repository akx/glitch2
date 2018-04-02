function defaults(target, defaultValues) {
  for (const key in defaultValues) { // eslint-disable-line no-restricted-syntax
    if (defaultValues.hasOwnProperty(key) && !(key in target)) { // eslint-disable-line no-prototype-builtins
      target[key] = defaultValues[key];
    }
  }
  return target;
}

module.exports = defaults;
