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
    if (file) {
      fileReader.readAsDataURL(file);
    }
  }
}

const resizePrompt = (ctrl: UIState) => {
  const [w, h] = ctrl.engine.getSourceDimensions();
  const currSize = `${w}x${h}`;
  let newSize;
  if (
    (newSize = prompt('Enter the desired new size for the image.', currSize))
  ) {
    if (currSize === newSize) {
      return;
    }
    const match = /^(\d+)\s*x\s*(\d+)$/i.exec(newSize);
    if (!match) {
      return;
    }
    const width = parseInt(match[1], 10);
    const height = parseInt(match[2], 10);
    if (!(width > 0 && height > 0)) {
      alert('Unable to parse new size.');
      return;
    }
    const src = ctrl.engine.sourceImage;
    if (src instanceof HTMLImageElement) {
      // Static image: snapshot at the new size to avoid per-frame resampling
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempContext = tempCanvas.getContext('2d');
      if (!tempContext) {
        return;
      }
      tempContext.drawImage(src, 0, 0, width, height);
      const url = tempCanvas.toDataURL('image/png');
      const newImage = new Image();
      newImage.onload = () => {
        ctrl.engine.sourceImage = newImage;
        ctrl.engine.targetSize = null;
      };
      newImage.src = url;
    } else {
      // Live source (camera etc.): use targetSize override
      ctrl.engine.targetSize = [width, height];
    }
  }
};

function stopCamera(ctrl: UIState) {
  if (ctrl.cameraStream) {
    ctrl.cameraStream.getTracks().forEach((track) => track.stop());
    ctrl.cameraStream = null;
  }
}

async function startCamera(ctrl: UIState) {
  stopCamera(ctrl);
  try {
    const [w, h] = ctrl.engine.getSourceDimensions();
    const videoConstraints: MediaTrackConstraints = {};
    if (w > 0 && h > 0) {
      videoConstraints.width = { ideal: w };
      videoConstraints.height = { ideal: h };
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      video: videoConstraints,
    });
    ctrl.cameraStream = stream;
    const video = document.createElement('video');
    video.srcObject = stream;
    video.playsInline = true;
    video.muted = true;
    video.onloadedmetadata = () => {
      video.play();
      ctrl.engine.sourceImage = video;
      m.redraw();
    };
  } catch (err) {
    alert(`Camera access failed: ${err}`);
  }
}

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
            stopCamera(ctrl);
            ctrl.engine.sourceImage = img;
            if (event.target) {
              (event.target as HTMLInputElement).value = '';
            }
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
    ' ',
    ctrl.cameraStream
      ? m(
          'button',
          {
            onclick: () => {
              stopCamera(ctrl);
            },
          },
          [m('i.icon-camera'), ' Stop Camera'],
        )
      : m(
          'button',
          {
            onclick: () => {
              startCamera(ctrl);
            },
          },
          [m('i.icon-camera'), ' Start Camera'],
        ),
    m('label', [
      m('input', {
        type: 'checkbox',
        onchange: (e: Event) => {
          if (e.target) {
            ctrl.ui.zoom = (e.target as HTMLInputElement).checked;
          }
        },
      }),
      'zoom down to fit',
    ]),
  );

export default loadImageDiv;
