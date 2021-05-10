/* eslint-disable no-restricted-syntax, no-prototype-builtins */
function defaults(target, defaultValues) {
  for (const key in defaultValues) {
    if (defaultValues.hasOwnProperty(key) && !(key in target)) {
      target[key] = defaultValues[key];
    }
  }
  return target;
}

export default defaults;
