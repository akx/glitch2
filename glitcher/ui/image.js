/* eslint-env browser */
const m = require('mithril');

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

const loadImageDiv = (ctrl) => (
  m('div.load-image', {key: 'load-image'},
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

module.exports = loadImageDiv;
