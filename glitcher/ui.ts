import m from 'mithril';
import stateUI from './ui/state';
import fxUI from './ui/fx';
import imageUI from './ui/image';
import recorderUI from './ui/recorder';
import titleUI from './ui/title';

function oninit(vnode, engine) {
  Object.assign(vnode.state, {
    engine,
    ui: {
      stateMgmt: false,
      recorder: true,
      image: true,
      fx: true,
      misc: false,
      zoom: false,
    },
    recordFrames: [],
    gifRenderProgress: null,
  });
}

function view({ state: ctrl }) {
  if (ctrl.engine === null) return null;
  // Slightly yucky side effect
  document.body.classList.toggle('zoom-canvas-to-fit', ctrl.ui.zoom);
  return m(
    'div',
    [
      titleUI(ctrl),
      ctrl.ui.stateMgmt ? stateUI(ctrl) : null,
      ctrl.ui.image ? imageUI(ctrl) : null,
      ctrl.ui.recorder ? recorderUI(ctrl) : null,
      ctrl.ui.fx ? fxUI(ctrl) : null,
      ctrl.ui.misc
        ? m('div', { key: 'misc' }, [
            `Render time: ${ctrl.engine.renderTime} ms`,
          ])
        : null,
    ].filter(Boolean),
  );
}

export function init(engine) {
  const uiContainer = document.createElement('div');
  uiContainer.id = 'ui-container';
  document.body.appendChild(uiContainer);
  m.mount(uiContainer, {
    oninit: (vnode) => oninit(vnode, engine),
    view,
  });
}
