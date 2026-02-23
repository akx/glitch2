import m from 'mithril';
import stateUI from './ui/state';
import fxUI from './ui/fx';
import imageUI from './ui/image';
import recorderUI from './ui/recorder';
import titleUI from './ui/title';
import Engine from './engine';
import { UIState } from './types';

function oninit(vnode: m.Vnode<unknown, UIState>, engine: Engine) {
  const uiState: UIState = {
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
    cameraStream: null,
  };
  Object.assign(vnode.state, uiState);
}

function view({ state: ctrl }: { state: UIState }) {
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

export function init(engine: Engine) {
  const uiContainer = document.createElement('div');
  uiContainer.id = 'ui-container';
  document.body.appendChild(uiContainer);
  m.mount(uiContainer, {
    oninit: (vnode: m.Vnode<unknown, UIState>) => oninit(vnode, engine),
    view,
  } as never);
}
