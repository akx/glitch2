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

function getParamEditor(def: Def, paramDef: Parameter) {
  const paramName = paramDef.name;

  const children: Child[] = [];
  const value = def.options[paramName];

  if (paramDef.type === 'bool') {
    children.push(
      m(
        'label',
        m('input', {
          onclick() {
            def.options[paramName] = !def.options[paramName];
          },
          checked: !!value,
          type: 'checkbox',
        }),
        paramName,
      ),
    );
  }

  if (paramDef.type === 'int' || paramDef.type === 'num') {
    children.push(m('div.param-name', paramName));
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
      ? m(
          'div.params',
          params.map((pDef) => getParamEditor(def, pDef)),
        )
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
