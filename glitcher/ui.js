/* eslint-env browser */
/* eslint-disable no-restricted-syntax, no-prototype-builtins, no-continue, no-alert */
const m = require('mithril');
const util = require('./util');

function controller() {
  this.state = null;
  this.engine = null;
  this.ui = {
    stateMgmt: false,
    recorder: true,
    image: true,
    fx: true,
    misc: false,
  };
  this.recordFrames = [];
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
        m('input.slider', {
          oninput(event) {
            def.options[paramName] = event.target.valueAsNumber;
          },
          value: def.options[paramName],
          min: paramDef.min,
          max: paramDef.max,
          step: (paramDef.step !== null ? paramDef.step : 0.0001),
          type: 'range',
        }),
        m('input.num', {
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

const defEditor = (ctrl, state, def) => {
  const enabled = (def.enabled && def.probability > 0);
  const params = (def.module.params || []);
  const collapseBtn = (
    params.length ?
      m('button',
        {
          onclick() {
            def.uiVisible = !def.uiVisible;
          },
          title: (def.uiVisible ? 'Collapse' : 'Expand'),
        },
        m((def.uiVisible ? 'i.fa.fa-chevron-up' : 'i.fa.fa-chevron-down')),
      ) : null
  );
  return m(`div.def-edit${!enabled ? '.disabled' : ''}`,
    {key: def.id},
    [
      m('div.def-kit.button-row',
        [
          m('div.module-name', [def.moduleName]),
          m('input.prob-slider',
            {
              oninput(event) {
                def.probability = event.target.valueAsNumber;
              },
              value: def.probability,
              min: 0,
              max: 1,
              step: 0.01,
              type: 'range',
              title: `probability: ${def.probability.toFixed(2)}`,
            }),
          collapseBtn,
          m('button', {
            onclick() {
              def.enabled = !def.enabled;
            },
            title: (def.enabled ? 'Disable' : 'Enable'),
          }, m('i.fa.fa-power-off')),
          m('button', {
            onclick() {
              state.deleteDef(def);
            },
            title: 'Delete',
          }, m('i.fa.fa-times')),
          m('button', {
            onclick() {
              state.moveDef(def, -1);
            },
            title: 'Move Up',
          }, m('i.fa.fa-arrow-up')),
          m('button', {
            onclick() {
              state.moveDef(def, +1);
            },
            title: 'Move down',
          }, m('i.fa.fa-arrow-down')),
          m('button', {
            onclick() {
              util.randomizeDef(def);
            },
            title: 'Randomize',
          }, m('i.fa.fa-random')),
          m('button', {
            onclick() {
              state.duplicateDef(def);
            },
            title: 'Duplicate',
          }, m('i.fa.fa-plus')),
        ]),
      (def.uiVisible ?
          m(
            'div.params',
            params.map((pDef) => getParamEditor(def, pDef))
          ) : null
      ),
    ],
  );
};


function moduleList(ctrl) {
  const state = ctrl.engine.state;
  return m(
    'div.module-list',
    {key: 'module-list'},
    state.defs.map((def) => defEditor(ctrl, state, def))
  );
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

const stateButtons = (ctrl) => (
  m('div.state-box', [
    m('div.button-row', {key: 'state-global-buttons'},
      m('button', {
        onclick() {
          ctrl.engine.state.loadFromLocalStorage();
        },
      }, 'Load State'),
      m('button', {
        onclick() {
          ctrl.engine.state.saveIntoLocalStorage();
        },
      }, 'Save State'),
      m('button', {
        onclick() {
          ctrl.engine.state.clear();
        },
      }, 'Clear State'),
      m('button', {
        onclick() {
          const d = prompt('Serialized content (copy/paste):', ctrl.engine.state.serialize());
          if (d) ctrl.engine.state.unserialize(d);
        },
      }, 'Import/Export State'),
    ),
  ])
);

const loadImageDiv = (ctrl) => (
  m('div.load-image',
    m('label', ['Load Image: ',
      m('input', {
        type: 'file',
        id: 'select-image',
        accept: 'image/*',
        onchange(event) {
          loadImageFromFileField(event, (img) => {
            ctrl.engine.sourceImage = img;
            event.target.value = null;
          });
        },
      }),
    ]),
  )
);

const saveCurrentButton = (ctrl) => (
  m('button',
    {
      onclick() {
        const link = document.createElement('a');
        link.href = ctrl.engine.toDataURL();
        link.download = `glitch-${+new Date()}.png`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
      },
      title: 'Save Current Image',
    },
    m('i.fa.fa-save'),
    ' Save Current Image'
  )
);

const refreshRow = (ctrl) => {
  const manualRefreshButton = m('button', {
      onclick() {
        ctrl.engine.rate = 0;
        ctrl.engine.renderFrame();
      },
      title: 'manual refresh',
    },
    m('i.fa.fa-refresh'),
    ' Refresh',
  );
  const refreshRateSetting = m('span', [
    m('label', ' Refresh rate: '),
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
  ]);
  return m('div.button-row',
    [
      saveCurrentButton(ctrl),
      m('div', [refreshRateSetting, manualRefreshButton]),
    ],
  );
};


const recorder = (ctrl) => {
  return m('div.recorder', [
    refreshRow(ctrl),
    m('div.button-row', [
      m('button',
        {
          onclick(event) {
            ctrl.recordFrames.push({
              data: ctrl.engine.toDataURL(),
            });
            event.preventDefault();
          },
        },
        m('i.fa.fa-camera'),
        ' Add Frame',
      ),

      m('button',
        {
          onclick(event) {
            alert('TODO'); // TODO
          },
        },
        m('i.fa.fa-save'),
        ' Save GIF',
      ),
      m('button',
        {
          onclick(event) {
            if (confirm('Clear animation?')) {
              ctrl.recordFrames = [];
            }
            event.preventDefault();
          },
        },
        m('i.fa.fa-trash'),
        ' Clear',
      ),
    ]),
    m(`div.frames.${ctrl.ui.fx ? 'slim' : 'phat'}`, ctrl.recordFrames.map(
      (f, index) => m('div.frame', [
        m('img', {src: f.data}),
        m('div.tools', [
          m(
            'button', {
              onclick() {
                ctrl.recordFrames.splice(index, 1);
              },
            },
            [m('i.fa.fa-times')],
          ),
        ]),
      ])
    )),
  ]);
};

const showHide = (ctrl, id, name) => (
  m('a',
    {
      href: '#',
      onclick: (event) => {
        ctrl.ui[id] = !ctrl.ui[id];
        event.preventDefault();
      },
    },
    `${ctrl.ui[id] ? '-' : '+'} ${name}`
  )
);

const titleDiv = (ctrl) => (
  m('div.title',
    [
      m('a.by', {href: 'https://github.com/akx/glitch2', target: '_blank'}, 'glitcher by @akx'),
      showHide(ctrl, 'stateMgmt', 'state'),
      showHide(ctrl, 'recorder', 'recorder'),
      showHide(ctrl, 'image', 'image'),
      showHide(ctrl, 'fx', 'fx'),
      showHide(ctrl, 'misc', 'misc'),
    ],
  )
);

function view(ctrl) {
  if (ctrl.engine === null) return null;
  return m('div', [
    titleDiv(ctrl),
    (ctrl.ui.stateMgmt ? stateButtons(ctrl) : null),
    (ctrl.ui.image ? loadImageDiv(ctrl) : null),
    (ctrl.ui.recorder ? recorder(ctrl) : null),
    (ctrl.ui.fx ? [moduleSelector(ctrl), moduleList(ctrl)] : null),
    (ctrl.ui.misc ? m('div', [` ~ ${ctrl.engine.renderTime} ms`]) : null),
  ]);
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
