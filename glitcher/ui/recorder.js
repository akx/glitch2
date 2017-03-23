/* eslint-env browser */
/* eslint-disable no-alert */
const m = require('mithril');
const generateGIF = require('../generate-gif');
const {forceDownload} = require('../util');

const saveCurrentButton = (ctrl) => (
  m('button',
    {
      onclick() {
        forceDownload(ctrl.engine.toDataURL(), `glitch-${+new Date()}.png`);
      },
      title: 'Save Current Image',
    },
    m('i.fa.fa-save'),
    ' Save Current Image'
  )
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


const recorder = (ctrl) => m(
  'div.recorder',
  {key: 'recorder'},
  [
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
          disabled: (ctrl.recordFrames.length === 0 || ctrl.gifRenderProgress !== null),
        },
        m('i.fa.fa-save'),
        (ctrl.gifRenderProgress !== null ? `Rendering ${(ctrl.gifRenderProgress * 100).toFixed(1)}%` : ' Save GIF'),
      ),
      m('button',
        {
          onclick(event) {
            if (confirm('Clear animation?')) {
              ctrl.recordFrames = [];
            }
            event.preventDefault();
          },
          disabled: ctrl.recordFrames.length === 0,
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
  ]
);

module.exports = recorder;
