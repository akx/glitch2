export interface Parameter {
  type: 'num' | 'int' | 'bool' | 'choice';
  name: string;
  min?: number;
  max?: number;
  step?: number | null;
  choices?: string[];
  description?: string;
  randomBias?: number;
}

/**
 * Numeric (decimal) parameter.
 * @param name The name of the parameter.
 * @param options Options for the parameter.
 * @returns {*} Parameter definition object.
 */
function Num(name: string, options?: Partial<Parameter>): Parameter {
  return {
    type: 'num',
    min: 0,
    max: 1,
    step: null,
    name,
    ...options,
  };
}

/**
 * Integer parameter.
 * @param name The name of the parameter.
 * @param options Options for the parameter.
 * @returns {*} Parameter definition object.
 */
function Int(name: string, options?: Partial<Parameter>): Parameter {
  return {
    type: 'int',
    min: 0,
    max: 100,
    step: 1,
    name,
    ...options,
  };
}

/**
 * Boolean parameter.
 * @param name The name of the parameter.
 * @param options Options for the parameter.
 * @returns {*} Parameter definition object.
 */
function Bool(name: string, options?: Partial<Parameter>): Parameter {
  return { type: 'bool', name, ...options };
}

/**
 * Choice parameter.
 * @param name The name of the parameter.
 * @param choices Choices list
 * @param options Options for the parameter.
 * @returns {*} Parameter definition object.
 */
function Choice(
  name: string,
  choices: string[],
  options?: Partial<Parameter>,
): Parameter {
  return { type: 'choice', name, choices, ...options };
}

export { Num as num, Int as int, Bool as bool, Choice as choice };
