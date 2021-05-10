/* eslint-disable no-alert */
import m from 'mithril';

import generateGIF from '../generate-gif';
import { forceDownload } from '../util';

const saveCurrentButton = (ctrl) =>
  m(
    'button',
    {
      onclick() {
        ctrl.engine.toURL('image/png').then((url) => {
          forceDownload(url, `glitch-${new Date().toISOString()}.png`).then(
            () => {
              if (/^blob:/.test(url)) {
                URL.revokeObjectURL(url);
              }
            },
          );
        });
      },
      title: 'Save Current Image',
    },
    m('i.icon-flash'),
    ' Save Current Image',
  );

const refreshRow = (ctrl) => {
  const manualRefreshButton = m(
    'button',
    {
      onclick() {
        ctrl.engine.rate = 0;
        ctrl.engine.renderFrame();
      },
      title: 'manual refresh',
    },
    m('i.icon-refresh'),
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
  return m('div.button-row', [
    saveCurrentButton(ctrl),
    m('div', [refreshRateSetting, manualRefreshButton]),
  ]);
};

const recorder = (ctrl) =>
  m('div.recorder', { key: 'recorder' }, [
    refreshRow(ctrl),
    m('div.button-row', [
      m(
        'button',
        {
          onclick(event) {
            ctrl.recordFrames.push({
              data: ctrl.engine.toDataURL(),
            });
            event.preventDefault();
          },
        },
        m('i.icon-camera'),
        ' Add Frame',
      ),

      m(
        'button',
        {
          onclick() {
            const gif = generateGIF(ctrl.recordFrames);
            gif.on('progress', (prog) => {
              ctrl.gifRenderProgress = prog;
              m.redraw();
            });
            gif.on('finished', (blob) => {
              ctrl.gifRenderProgress = null;
              m.redraw();
              const url = URL.createObjectURL(blob);
              forceDownload(url, `glitchgif-${+new Date()}.gif`);
            });
            ctrl.gifRenderProgress = 0;
          },
          disabled:
            ctrl.recordFrames.length === 0 || ctrl.gifRenderProgress !== null,
        },
        m('i.icon-flash'),
        ctrl.gifRenderProgress !== null
          ? `Rendering ${(ctrl.gifRenderProgress * 100).toFixed(1)}%`
          : ' Save GIF',
      ),
      m(
        'button',
        {
          onclick(event) {
            // eslint-disable-next-line no-restricted-globals
            if (confirm('Clear animation?')) {
              ctrl.recordFrames = [];
            }
            event.preventDefault();
          },
          disabled: ctrl.recordFrames.length === 0,
        },
        m('i.icon-trash'),
        ' Clear',
      ),
    ]),
    m(
      `div.frames.${ctrl.ui.fx ? 'slim' : 'phat'}`,
      ctrl.recordFrames.map((f, index) =>
        m('div.frame', [
          m('img', { src: f.data }),
          m('div.tools', [
            m(
              'button',
              {
                onclick() {
                  ctrl.recordFrames.splice(index, 1);
                },
              },
              [m('i.icon-times')],
            ),
          ]),
        ]),
      ),
    ),
  ]);

export default recorder;
