import m from 'mithril';
import { UIState } from '../types';

function loadImageFromFileField(
  event: Event,
  complete: (img: HTMLImageElement) => void,
) {
  const fileReader = new FileReader();
  fileReader.onload = (loadEvent) => {
    const src = loadEvent.target?.result;
    const img = document.createElement('img');
    img.src = String(src);
    img.onload = () => {
      complete(img);
    };
  };
  if (event.target) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) fileReader.readAsDataURL(file);
  }
}

const resizePrompt = (ctrl: UIState) => {
  const img = ctrl.engine.sourceImage;
  if (!img) return;
  const currSize = `${img.width}x${img.height}`;
  let newSize;
  if (
    (newSize = prompt('Enter the desired new size for the image.', currSize))
  ) {
    if (currSize === newSize) return;
    const match = /^(\d+)\s*x\s*(\d+)$/i.exec(newSize);
    if (!match) return;
    const width = parseInt(match[1], 10);
    const height = parseInt(match[2], 10);
    if (!(width > 0 && height > 0)) {
      alert('Unable to parse new size.');
      return;
    }
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempContext = tempCanvas.getContext('2d');
    if (!tempContext) return;
    tempContext.drawImage(img, 0, 0, width, height);
    const url = tempCanvas.toDataURL('image/png');
    const newImage = new Image();
    newImage.onload = () => {
      ctrl.engine.sourceImage = newImage;
    };
    newImage.src = url;
  }
};

const loadImageDiv = (ctrl: UIState) =>
  m(
    'div.image',
    { key: 'load-image' },
    m('label', [
      'Load Image: ',
      m('input', {
        type: 'file',
        id: 'select-image',
        accept: 'image/*',
        onchange(event: Event) {
          loadImageFromFileField(event, (img) => {
            ctrl.engine.sourceImage = img;
            if (event.target) (event.target as HTMLInputElement).value = '';
          });
        },
      }),
    ]),
    m(
      'div',
      { style: 'opacity: .5' },
      'You can also paste image data from the clipboard.',
    ),
    m('button', { onclick: () => resizePrompt(ctrl) }, [
      m('i.icon-arrow-maximise'),
      ' Resize',
    ]),
    m('label', [
      m('input', {
        type: 'checkbox',
        onchange: (e: Event) => {
          if (e.target) ctrl.ui.zoom = (e.target as HTMLInputElement).checked;
        },
      }),
      'zoom down to fit',
    ]),
  );

export default loadImageDiv;
