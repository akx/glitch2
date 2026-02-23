import m, { Child } from 'mithril';

import { randomizeDef } from '../util';
import { Def, UIState } from '../types';
import { Parameter } from '../../libglitch/param';
import State from '../State';

function moduleSelector(ctrl: UIState) {
  const { engine } = ctrl;
  if (!engine) return null;
  const options = [m('option', { value: '' }, '<< Add module... >>')];
  const { modules } = engine.state;
  Object.keys(modules).forEach((key) => {
    const module = modules[key];
    options.push(m('option', { value: key }, `${module.friendlyName || key}`));
  });
  return m(
    'div.module-selector',
    { key: 'module-sel' },
    m(
      'select',
      {
        onchange(event: Event) {
          const target = event.target as HTMLSelectElement;
          engine.state.addModule(target.value);
          target.value = '';
        },
      },
      options,
    ),
  );
}

function rotateChoiceParam(
  choices: string[],
  value: string,
  direction: number,
) {
  const currentValueIndex = choices.indexOf(value);
  if (currentValueIndex === -1) return value;
  const newValueIndex =
    (currentValueIndex + direction + choices.length) % choices.length;
  return choices[newValueIndex];
}

function rangeToggle(def: Def, paramName: string, isActive: boolean) {
  return m(
    'button.range-toggle',
    {
      onclick() {
        const minKey = `${paramName}__rangeMin`;
        const maxKey = `${paramName}__rangeMax`;
        const biasKey = `${paramName}__rangeBias`;
        if (isActive) {
          delete def.options[minKey];
          delete def.options[maxKey];
          delete def.options[biasKey];
        } else {
          // Initialize range from current value or param defaults
          const cur = def.options[paramName];
          def.options[minKey] = cur ?? 0;
          def.options[maxKey] = cur ?? 1;
          def.options[biasKey] = 0;
        }
      },
      title: isActive
        ? 'Disable range randomization'
        : 'Enable range randomization',
    },
    m(`i.${isActive ? 'icon-times' : 'icon-arrow-shuffle'}`),
  );
}

function rangeSliders(def: Def, paramName: string, paramDef: Parameter) {
  const minKey = `${paramName}__rangeMin`;
  const maxKey = `${paramName}__rangeMax`;
  const biasKey = `${paramName}__rangeBias`;
  const step = paramDef.step ?? 0.0001;

  const makeSliderRow = (
    label: string,
    key: string,
    min: number,
    max: number,
    sliderStep: number,
  ) => {
    const s = sliderStep;
    return m('div.range-row', [
      m('span.range-label', label),
      m('div.slider-and-input', [
        m('input.slider', {
          oninput(event: InputEvent) {
            if (event.target) {
              def.options[key] = (
                event.target as HTMLInputElement
              ).valueAsNumber;
            }
          },
          value: def.options[key],
          min,
          max,
          step: s,
          type: 'range',
        }),
        m('input.num', {
          oninput(event: InputEvent) {
            if (event.target) {
              def.options[key] = (
                event.target as HTMLInputElement
              ).valueAsNumber;
            }
          },
          value: def.options[key],
          step: s,
          type: 'number',
        }),
      ]),
    ]);
  };

  return m('div.range-controls', [
    makeSliderRow('Min', minKey, paramDef.min ?? 0, paramDef.max ?? 1, step),
    makeSliderRow('Max', maxKey, paramDef.min ?? 0, paramDef.max ?? 1, step),
    makeSliderRow('Bias', biasKey, -1, 1, 0.01),
  ]);
}

function getParamEditor(def: Def, paramDef: Parameter) {
  const paramName = paramDef.name;

  const children: Child[] = [];
  const value = def.options[paramName];

  if (paramDef.type === 'bool') {
    const minKey = `${paramName}__rangeMin`;
    const biasKey = `${paramName}__rangeBias`;
    const rangeActive = minKey in def.options;

    children.push(
      m('div.param-header', [
        m(
          'label',
          m('input', {
            onclick() {
              def.options[paramName] = !def.options[paramName];
            },
            checked: !!value,
            type: 'checkbox',
            disabled: rangeActive,
          }),
          paramName,
        ),
        rangeToggle(def, paramName, rangeActive),
      ]),
    );

    if (rangeActive) {
      const step = 0.01;
      children.push(
        m('div.range-controls', [
          m('div.range-row', [
            m('span.range-label', 'P(true)'),
            m('div.slider-and-input', [
              m('input.slider', {
                oninput(event: InputEvent) {
                  if (event.target) {
                    def.options[minKey] = (
                      event.target as HTMLInputElement
                    ).valueAsNumber;
                  }
                },
                value: def.options[minKey],
                min: 0,
                max: 1,
                step,
                type: 'range',
              }),
              m('input.num', {
                oninput(event: InputEvent) {
                  if (event.target) {
                    def.options[minKey] = (
                      event.target as HTMLInputElement
                    ).valueAsNumber;
                  }
                },
                value: def.options[minKey],
                step,
                type: 'number',
              }),
            ]),
          ]),
          m('div.range-row', [
            m('span.range-label', 'Bias'),
            m('div.slider-and-input', [
              m('input.slider', {
                oninput(event: InputEvent) {
                  if (event.target) {
                    def.options[biasKey] = (
                      event.target as HTMLInputElement
                    ).valueAsNumber;
                  }
                },
                value: def.options[biasKey] ?? 0,
                min: -1,
                max: 1,
                step: 0.01,
                type: 'range',
              }),
              m('input.num', {
                oninput(event: InputEvent) {
                  if (event.target) {
                    def.options[biasKey] = (
                      event.target as HTMLInputElement
                    ).valueAsNumber;
                  }
                },
                value: def.options[biasKey] ?? 0,
                step: 0.01,
                type: 'number',
              }),
            ]),
          ]),
        ]),
      );
    }
  }

  if (paramDef.type === 'int' || paramDef.type === 'num') {
    const minKey = `${paramName}__rangeMin`;
    const rangeActive = minKey in def.options;

    children.push(
      m('div.param-header', [
        m('div.param-name', paramName),
        rangeToggle(def, paramName, rangeActive),
      ]),
    );

    if (rangeActive) {
      children.push(rangeSliders(def, paramName, paramDef));
    } else {
      const oninput = (event: InputEvent) => {
        if (event.target) {
          def.options[paramName] = (
            event.target as HTMLInputElement
          ).valueAsNumber;
        }
      };

      children.push(
        m(
          'div.slider-and-input',
          m('input.slider', {
            oninput,
            value,
            min: paramDef.min,
            max: paramDef.max,
            step: paramDef.step !== null ? paramDef.step : 0.0001,
            type: 'range',
          }),
          m('input.num', {
            oninput,
            value,
            step: paramDef.step !== null ? paramDef.step : 0.0001,
            type: 'number',
          }),
        ),
      );
    }
  }

  if (paramDef.type === 'choice') {
    children.push(m('div.param-name', paramName));
    children.push(
      m('div', [
        m(
          'select',
          {
            value,
            oninput(event: InputEvent) {
              if (event.target) {
                def.options[paramName] = (
                  event.target as HTMLSelectElement
                ).value;
              }
            },
          },
          paramDef.choices?.map((choice) =>
            m('option', { value: choice }, choice),
          ),
        ),
        m(
          'a',
          {
            href: '#',
            onclick() {
              const { choices } = paramDef;
              if (choices) {
                def.options[paramName] = rotateChoiceParam(choices, value, -1);
              }
            },
          },
          m('i.icon-flash'),
        ),
        '\u2022',
        m(
          'a',
          {
            href: '#',
            onclick() {
              const { choices } = paramDef;
              if (choices) {
                def.options[paramName] = rotateChoiceParam(choices, value, +1);
              }
            },
          },
          m('i.icon-arrow-right-thick'),
        ),
      ]),
    );
  }
  return m(
    `div.param.param-${paramDef.type}`,
    { key: `${def.id}-${paramName}` },
    children,
  );
}

function iterationsEditor(def: Def) {
  const rangeMinKey = 'iterations__rangeMin';
  const rangeMaxKey = 'iterations__rangeMax';
  const rangeBiasKey = 'iterations__rangeBias';
  const rangeActive = rangeMinKey in def.options;

  const toggleRange = () => {
    if (rangeActive) {
      delete def.options[rangeMinKey];
      delete def.options[rangeMaxKey];
      delete def.options[rangeBiasKey];
    } else {
      def.options[rangeMinKey] = def.iterations;
      def.options[rangeMaxKey] = def.iterations;
      def.options[rangeBiasKey] = 0;
    }
  };

  if (rangeActive) {
    const makeRow = (
      label: string,
      key: string,
      min: number,
      max: number,
      step: number,
    ) =>
      m('div.range-row', [
        m('span.range-label', label),
        m('div.slider-and-input', [
          m('input.slider', {
            oninput(event: InputEvent) {
              if (event.target) {
                def.options[key] = (
                  event.target as HTMLInputElement
                ).valueAsNumber;
              }
            },
            value: def.options[key],
            min,
            max,
            step,
            type: 'range',
          }),
          m('input.num', {
            oninput(event: InputEvent) {
              if (event.target) {
                def.options[key] = (
                  event.target as HTMLInputElement
                ).valueAsNumber;
              }
            },
            value: def.options[key],
            step,
            type: 'number',
          }),
        ]),
      ]);

    return m('div.iterations-editor', { key: `${def.id}-iters` }, [
      m('div.param-header', [
        m('div.param-name', 'iterations'),
        m(
          'button.range-toggle',
          { onclick: toggleRange, title: 'Disable range randomization' },
          m('i.icon-times'),
        ),
      ]),
      m('div.range-controls', [
        makeRow('Min', rangeMinKey, 0, 100, 1),
        makeRow('Max', rangeMaxKey, 0, 100, 1),
        makeRow('Bias', rangeBiasKey, -1, 1, 0.01),
      ]),
    ]);
  }

  return m('div.iterations-editor', { key: `${def.id}-iters` }, [
    m('div.param-header', [
      m('div.param-name', 'iterations'),
      m(
        'button.range-toggle',
        { onclick: toggleRange, title: 'Enable range randomization' },
        m('i.icon-arrow-shuffle'),
      ),
    ]),
    m('div.slider-and-input', [
      m('input.slider', {
        oninput(event: InputEvent) {
          if (event.target) {
            def.iterations = (event.target as HTMLInputElement).valueAsNumber;
          }
        },
        value: def.iterations,
        min: 1,
        max: 20,
        step: 1,
        type: 'range',
      }),
      m('input.num', {
        oninput(event: InputEvent) {
          if (event.target) {
            def.iterations = (event.target as HTMLInputElement).valueAsNumber;
          }
        },
        value: def.iterations,
        step: 1,
        type: 'number',
      }),
    ]),
  ]);
}

const defEditor = (ctrl: UIState, state: State, def: Def) => {
  const enabled = def.enabled && def.probability > 0;
  const params = def.module.params || [];
  const collapseBtn = params.length
    ? m(
        'button',
        {
          onclick() {
            def.uiVisible = !def.uiVisible;
          },
          title: def.uiVisible ? 'Collapse' : 'Expand',
        },
        m('i.icon-th-small'),
      )
    : null;
  return m(`div.def-edit${!enabled ? '.disabled' : ''}`, { key: def.id }, [
    m('div.def-kit.button-row', [
      m('div.module-name', [def.moduleName]),
      m('input.prob-slider', {
        oninput(event: InputEvent) {
          if (event.target) {
            def.probability = (event.target as HTMLInputElement).valueAsNumber;
          }
        },
        value: def.probability,
        min: 0,
        max: 1,
        step: 0.01,
        type: 'range',
        title: `probability: ${def.probability.toFixed(2)}`,
      }),
      collapseBtn,
      m(
        'button',
        {
          onclick() {
            def.enabled = !def.enabled;
          },
          title: def.enabled ? 'Disable' : 'Enable',
        },
        m('i.icon-power'),
      ),
      m(
        'button',
        {
          onclick() {
            state.deleteDef(def);
          },
          title: 'Delete',
        },
        m('i.icon-times'),
      ),
      m(
        'button',
        {
          onclick() {
            state.moveDef(def, -1);
          },
          title: 'Move Up',
        },
        m('i.icon-arrow-up-thick'),
      ),
      m(
        'button',
        {
          onclick() {
            state.moveDef(def, +1);
          },
          title: 'Move down',
        },
        m('i.icon-arrow-down-thick'),
      ),
      m(
        'button',
        {
          onclick() {
            randomizeDef(def);
          },
          title: 'Randomize',
        },
        m('i.icon-arrow-shuffle'),
      ),
      m(
        'button',
        {
          onclick() {
            state.duplicateDef(def);
          },
          title: 'Duplicate',
        },
        m('i.icon-plus'),
      ),
    ]),
    def.uiVisible
      ? [
          iterationsEditor(def),
          m(
            'div.params',
            { key: `${def.id}-params` },
            params.map((pDef) => getParamEditor(def, pDef)),
          ),
        ]
      : null,
  ]);
};

function moduleList(ctrl: UIState) {
  const { state } = ctrl.engine;
  return m(
    'div.module-list',
    { key: 'module-list' },
    state.defs.map((def: Def) => defEditor(ctrl, state, def)),
  );
}

export default function fxUI(ctrl: UIState) {
  return m('div.fx-ui', { key: 'fx-ui' }, [
    moduleSelector(ctrl),
    moduleList(ctrl),
  ]);
}
