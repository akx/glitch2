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

const resizePrompt = (ctrl) => {
  const img = ctrl.engine.sourceImage;
  const currSize = `${img.width}x${img.height}`;
  let newSize;
  if ((newSize = prompt('Enter the desired new size for the image.', currSize))) {  // eslint-disable-line no-alert
    if (currSize === newSize) return;
    let [_, width, height] = /^(\d+)\s*x\s*(\d+)$/i.exec(newSize);
    width = parseInt(width, 10);
    height = parseInt(height, 10);
    if (!(width > 0 && height > 0)) {
      alert('Unable to parse new size.');
      return;
    }
    const tempCanvas = Object.assign(document.createElement('canvas'), {width, height});
    const tempContext = tempCanvas.getContext('2d');
    tempContext.drawImage(img, 0, 0, width, height);
    const url = tempCanvas.toDataURL('image/png');
    const newImage = new Image();
    newImage.onload = () => {
      ctrl.engine.sourceImage = newImage;
    };
    newImage.src = url;
  }
};

const loadImageDiv = (ctrl) => (
  m(
    'div.image',
    {key: 'load-image'},
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
    m('div', {style: 'opacity: .5'}, 'You can also paste image data from the clipboard.'),
    m('button', {onclick: () => resizePrompt(ctrl)}, [m('i.fa.fa-arrows-alt'), ' Resize']),
  )
);

module.exports = loadImageDiv;
