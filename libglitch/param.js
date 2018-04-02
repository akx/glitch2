const extend = require('./lib/extend');

/**
 * Numeric (decimal) parameter.
 * @param name The name of the parameter.
 * @param options Options for the parameter.
 * @returns {*} Parameter definition object.
 */
function Num(name, options) {
  return extend({}, {
    type: 'num', min: 0, max: 1, step: null, name,
  }, options);
}

/**
 * Integer parameter.
 * @param name The name of the parameter.
 * @param options Options for the parameter.
 * @returns {*} Parameter definition object.
 */
function Int(name, options) {
  return extend({}, {
    type: 'int', min: 0, max: 100, step: 1, name,
  }, options);
}

/**
 * Boolean parameter.
 * @param name The name of the parameter.
 * @param options Options for the parameter.
 * @returns {*} Parameter definition object.
 */
function Bool(name, options) {
  return extend({}, { type: 'bool', name }, options);
}


/**
 * Choice parameter.
 * @param name The name of the parameter.
 * @param choices Choices list
 * @param options Options for the parameter.
 * @returns {*} Parameter definition object.
 */
function Choice(name, choices, options) {
  return extend({}, { type: 'choice', name, choices }, options);
}


extend(module.exports, {
  num: Num, // num num num
  int: Int,
  bool: Bool,
  choice: Choice,
});
