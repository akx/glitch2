/* eslint-env browser */
const m = require('mithril');
const stateUI = require('./ui/state');
const fxUI = require('./ui/fx');
const imageUI = require('./ui/image');
const recorderUI = require('./ui/recorder');

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
  this.gifRenderProgress = null;
}

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
    (ctrl.ui.stateMgmt ? stateUI(ctrl) : null),
    (ctrl.ui.image ? imageUI(ctrl) : null),
    (ctrl.ui.recorder ? recorderUI(ctrl) : null),
    (ctrl.ui.fx ? fxUI(ctrl) : null),
    (ctrl.ui.misc ? m('div', [`Render time: ${ctrl.engine.renderTime} ms`]) : null),
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
