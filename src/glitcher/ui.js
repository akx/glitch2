/* eslint-env browser */
/* eslint-disable no-restricted-syntax, no-prototype-builtins, no-continue, no-alert */
const m = require('mithril');
const util = require('./util');

function controller() {
  this.state = null;
}

function moduleSelector(ctrl) {
  const options = [m('option', {value: ''}, '<< Add module... >>')];
  const modules = ctrl.engine.state.modules;
  for (const key in modules) {
    if (!modules.hasOwnProperty(key)) continue;
    const module = modules[key];
    options.push(m('option', {value: key}, `${module.friendlyName || key}`));
  }
  return m('div.module-selector', {key: 'module-sel'}, m('select', {
    onchange(event) {
      ctrl.engine.state.addModule(event.target.value);
      event.target.value = '';
    },
  }, options));
}

function getParamEditor(def, paramDef) {
  const paramName = paramDef.name;
  const paramNode = m(`div.param.param-${paramDef.type}`, {key: `${def.id}-${paramName}`}, []);

  if (paramDef.type === 'bool') {
    paramNode.children.push(m('label',
      m('input', {
        onclick() {
          def.options[paramName] = !def.options[paramName];
        },
        checked: !!def.options[paramName],
        type: 'checkbox',
      }),
      paramName,
    ));
  }
  if (paramDef.type === 'int' || paramDef.type === 'num') {
    paramNode.children.push(m('div.param-name', paramName));

    paramNode.children.push(
      m('div.slider-and-input',
        m('input', {
          oninput(event) {
            def.options[paramName] = event.target.valueAsNumber;
          },
          value: def.options[paramName],
          min: paramDef.min,
          max: paramDef.max,
          step: (paramDef.step !== null ? paramDef.step : 0.0001),
          type: 'range',
        }),
        m('input', {
          oninput(event) {
            def.options[paramName] = event.target.valueAsNumber;
          },
          value: def.options[paramName],
          step: (paramDef.step !== null ? paramDef.step : 0.0001),
          type: 'number',
        }),
      ),
    );
  }
  return paramNode;
}


function moduleList(ctrl) {
  const root = m('div.module-list', {key: 'module-list'});
  const state = ctrl.engine.state;
  state.defs.forEach((def) => {
    const defNode = m('div.def-edit', {key: def.id}, [def.moduleName]);
    defNode.children.push(m('div.def-kit.button-row', [
      m('button', {
        onclick() {
          state.deleteDef(def);
        },
      }, 'X'),
      m('button', {
        onclick() {
          state.moveDef(def, -1);
        },
      }, '\u2191'),
      m('button', {
        onclick() {
          state.moveDef(def, +1);
        },
      }, '\u2193'),
      m('button', {
        onclick() {
          util.randomizeDef(def);
        },
      }, '\u21BB'),
      m('button', {
        onclick() {
          state.duplicateDef(def);
        },
      }, '+'),
    ]));
    defNode.children.push(m('div.def-enable', [
      m('input', {
        onclick() {
          def.enabled = !def.enabled;
        },
        checked: !!def.enabled,
        type: 'checkbox',
      }),
      m('input', {
        oninput(event) {
          def.probability = event.target.valueAsNumber;
        },
        value: def.probability,
        min: 0,
        max: 1,
        step: 0.01,
        type: 'range',
      }),
    ]));
    const paramsNode = m('div.params');
    (def.module.params || []).forEach((pDef) => {
      paramsNode.children.push(getParamEditor(def, pDef));
    });

    defNode.children.push(paramsNode);
    root.children.push(defNode);
  });
  return root;
}

function loadImageFromFileField(event, complete) {
  const fileReader = new FileReader();
  fileReader.onload = (loadEvent) => {
    const src = loadEvent.target.result;
    const img = document.createElement('img');
    img.src = src;
    img.onload = () => {
      complete(img);
    };
  };
  fileReader.readAsDataURL(event.target.files[0]);
}

function view(ctrl) {
  if (ctrl.engine == null) return null;
  const root = m('div');
  root.children.push(m('div.button-row', {key: 'state-global-buttons'},
    m('div', 'State:'),
    m('button', {
      onclick() {
        ctrl.engine.state.loadFromLocalStorage();
      },
    }, 'Load'),
    m('button', {
      onclick() {
        ctrl.engine.state.saveIntoLocalStorage();
      },
    }, 'Save'),
    m('button', {
      onclick() {
        ctrl.engine.state.clear();
      },
    }, 'Clear'),
    m('button', {
      onclick() {
        const d = prompt('Serialized content (copy/paste):', ctrl.engine.state.serialize());
        if (d) ctrl.engine.state.unserialize(d);
      },
    }, 'Import/Export'),
  ));
  root.children.push(m('div.button-row', {key: 'load-image'},
    m('label', ['Load Image: ',
      m('input', {
        type: 'file',
        id: 'select-image',
        accept: 'image/*',
        onchange(event) {
          loadImageFromFileField(event, (img) => {
            ctrl.engine.sourceImage = img;
          });
        },
      }),
    ]),
  ));
  root.children.push(m('div.button-row', {key: 'result-buttons'},
    m('button', {
      onclick() {
        const link = document.createElement('a');
        link.href = ctrl.engine.toDataURL();
        link.download = `glitch-${+new Date()}.png`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
      },
    }, 'Save current image'),
  ));
  root.children.push(m('div.button-row', {key: 'state-refresh-rate'},
    m('div', 'refresh rate:'),
    m('input', {
      type: 'number',
      step: 1,
      min: 0,
      max: 1000,
      value: ctrl.engine.rate,
      oninput() {
        ctrl.engine.rate = 0 | this.value;
      },
    }),
    m('button', {
      onclick() {
        ctrl.engine.rate = 0;
        ctrl.engine.renderFrame();
      },
      title: 'manual refresh',
    }, '\u21BB'),
  ));

  root.children.push(moduleSelector(ctrl));
  root.children.push(moduleList(ctrl));
  root.children.push(m('div', 'render time: ', ctrl.engine.renderTime));
  root.children.push(m('div', m.trust("glitcher by <a href='https://github.com/akx'>@akx</a> / MIT license")));
  return root;
}

function init(engine) {
  const uiContainer = document.createElement('div');
  uiContainer.id = 'ui-container';
  document.body.appendChild(uiContainer);
  m.startComputation();
  const ctrl = m.module(uiContainer, {controller, view});
  ctrl.engine = engine;
  m.endComputation();
}

module.exports.init = init;
