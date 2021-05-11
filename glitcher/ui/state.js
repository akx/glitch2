import m from 'mithril';

const stateButtons = (ctrl) =>
  m('div.state-box', { key: 'state-ui' }, [
    m(
      'div.button-row',
      { key: 'state-global-buttons' },
      m(
        'button',
        {
          onclick() {
            ctrl.engine.state.loadFromLocalStorage();
          },
        },
        'Load State',
      ),
      m(
        'button',
        {
          onclick() {
            ctrl.engine.state.saveIntoLocalStorage();
          },
        },
        'Save State',
      ),
      m(
        'button',
        {
          onclick() {
            ctrl.engine.state.clear();
          },
        },
        'Clear State',
      ),
      m(
        'button',
        {
          onclick() {
            const d = prompt(
              'Serialized content (copy/paste):',
              ctrl.engine.state.serialize(),
            );
            if (d) ctrl.engine.state.unserialize(d);
          },
        },
        'Import/Export State',
      ),
    ),
  ]);

export default stateButtons;
