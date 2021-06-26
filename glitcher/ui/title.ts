import m from 'mithril';
import { UIState } from '../types';

const showHide = (ctrl: UIState, id: keyof UIState['ui'], name: string) =>
  m(
    'a',
    {
      href: '#',
      onclick: (event: MouseEvent) => {
        ctrl.ui[id] = !ctrl.ui[id];
        event.preventDefault();
      },
    },
    `${ctrl.ui[id] ? '-' : '+'} ${name}`,
  );

const titleUI = (ctrl: UIState) =>
  m('div.title', { key: 'title-ui' }, [
    m(
      'a.by',
      { href: 'https://github.com/akx/glitch2', target: '_blank' },
      'glitcher by @akx',
    ),
    showHide(ctrl, 'stateMgmt', 'state'),
    showHide(ctrl, 'recorder', 'recorder'),
    showHide(ctrl, 'image', 'image'),
    showHide(ctrl, 'fx', 'fx'),
    showHide(ctrl, 'misc', 'misc'),
  ]);

export default titleUI;
