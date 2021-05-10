import m from 'mithril';

const showHide = (ctrl, id, name) =>
  m(
    'a',
    {
      href: '#',
      onclick: (event) => {
        ctrl.ui[id] = !ctrl.ui[id];
        event.preventDefault();
      },
    },
    `${ctrl.ui[id] ? '-' : '+'} ${name}`,
  );

const titleUI = (ctrl) =>
  m('div.title', [
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
