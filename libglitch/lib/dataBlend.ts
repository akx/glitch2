/* based on https://github.com/Phrogz/context-blender */

function dataBlend(
  srcD: ImageData,
  dstD: ImageData,
  sA: number,
  dA: number,
  blendMode: string,
): void {
  const src = srcD.data;
  const dst = dstD.data;
  const len = dst.length;
  let sRA;
  let sGA;
  let sBA;
  let dRA;
  let dGA;
  let dBA;
  let dA2;
  let demultiply;
  dA2 = sA + dA - sA * dA;
  for (let px = 0; px < len; px += 4) {
    sRA = (src[px] / 255) * sA;
    dRA = (dst[px] / 255) * dA;
    sGA = (src[px + 1] / 255) * sA;
    dGA = (dst[px + 1] / 255) * dA;
    sBA = (src[px + 2] / 255) * sA;
    dBA = (dst[px + 2] / 255) * dA;

    demultiply = 255 / dA2;

    switch (blendMode) {
      // ******* Very close match to Photoshop
      case 'normal':
      case 'src-over':
        dst[px] = (sRA + dRA - dRA * sA) * demultiply;
        dst[px + 1] = (sGA + dGA - dGA * sA) * demultiply;
        dst[px + 2] = (sBA + dBA - dBA * sA) * demultiply;
        break;

      case 'screen':
        dst[px] = (sRA + dRA - sRA * dRA) * demultiply;
        dst[px + 1] = (sGA + dGA - sGA * dGA) * demultiply;
        dst[px + 2] = (sBA + dBA - sBA * dBA) * demultiply;
        break;

      case 'multiply':
        dst[px] = (sRA * dRA + sRA * (1 - dA) + dRA * (1 - sA)) * demultiply;
        dst[px + 1] =
          (sGA * dGA + sGA * (1 - dA) + dGA * (1 - sA)) * demultiply;
        dst[px + 2] =
          (sBA * dBA + sBA * (1 - dA) + dBA * (1 - sA)) * demultiply;
        break;

      case 'difference':
        dst[px] = (sRA + dRA - 2 * Math.min(sRA * dA, dRA * sA)) * demultiply;
        dst[px + 1] =
          (sGA + dGA - 2 * Math.min(sGA * dA, dGA * sA)) * demultiply;
        dst[px + 2] =
          (sBA + dBA - 2 * Math.min(sBA * dA, dBA * sA)) * demultiply;
        break;

      // ******* Slightly different from Photoshop, where alpha is concerned
      case 'src-in':
        // Only differs from Photoshop in low-opacity areas
        dA2 = sA * dA;
        demultiply = 255 / dA2;
        dst[px + 3] = dA2 * 255;
        dst[px] = sRA * dA * demultiply;
        dst[px + 1] = sGA * dA * demultiply;
        dst[px + 2] = sBA * dA * demultiply;
        break;

      case 'plus':
      case 'add':
        // Photoshop doesn't simply add the alpha channels; this might be correct wrt SVG 1.2
        // dA2 = Math.min(1,sA+dA);
        // dst[px+3] = dA2*255;
        // demultiply = 255 / dA2;
        dst[px] = Math.min(sRA + dRA, 1) * demultiply;
        dst[px + 1] = Math.min(sGA + dGA, 1) * demultiply;
        dst[px + 2] = Math.min(sBA + dBA, 1) * demultiply;
        break;

      case 'overlay':
        // Correct for 100% opacity case; colors get clipped as opacity falls
        dst[px] =
          dRA <= 0.5
            ? (2 * src[px] * dRA) / dA
            : 255 - (2 - (2 * dRA) / dA) * (255 - src[px]);
        dst[px + 1] =
          dGA <= 0.5
            ? (2 * src[px + 1] * dGA) / dA
            : 255 - (2 - (2 * dGA) / dA) * (255 - src[px + 1]);
        dst[px + 2] =
          dBA <= 0.5
            ? (2 * src[px + 2] * dBA) / dA
            : 255 - (2 - (2 * dBA) / dA) * (255 - src[px + 2]);

        // http://dunnbypaul.net/blends/
        // dst[px  ] = ( (dRA<=0.5) ? (2*sRA*dRA) : 1 - (1 - 2*(dRA-0.5)) * (1-sRA) ) * demultiply;
        // dst[px+1] = ( (dGA<=0.5) ? (2*sGA*dGA) : 1 - (1 - 2*(dGA-0.5)) * (1-sGA) ) * demultiply;
        // dst[px+2] = ( (dBA<=0.5) ? (2*sBA*dBA) : 1 - (1 - 2*(dBA-0.5)) * (1-sBA) ) * demultiply;

        // http://www.barbato.us/2010/12/01/blimageblending-emulating-photoshops-blending-modes-opencv/#toc-blendoverlay
        // dst[px  ] = ( (sRA<=0.5) ? (sRA*dRA + sRA*(1-dA) + dRA*(1-sA)) : (sRA + dRA - sRA*dRA) ) * demultiply;
        // dst[px+1] = ( (sGA<=0.5) ? (sGA*dGA + sGA*(1-dA) + dGA*(1-sA)) : (sGA + dGA - sGA*dGA) ) * demultiply;
        // dst[px+2] = ( (sBA<=0.5) ? (sBA*dBA + sBA*(1-dA) + dBA*(1-sA)) : (sBA + dBA - sBA*dBA) ) * demultiply;

        // http://www.nathanm.com/photoshop-blending-math/
        // dst[px  ] = ( (sRA < 0.5) ? (2 * dRA * sRA) : (1 - 2 * (1 - sRA) * (1 - dRA)) ) * demultiply;
        // dst[px+1] = ( (sGA < 0.5) ? (2 * dGA * sGA) : (1 - 2 * (1 - sGA) * (1 - dGA)) ) * demultiply;
        // dst[px+2] = ( (sBA < 0.5) ? (2 * dBA * sBA) : (1 - 2 * (1 - sBA) * (1 - dBA)) ) * demultiply;
        break;

      case 'hardlight':
        dst[px] =
          sRA <= 0.5
            ? (2 * dst[px] * sRA) / dA
            : 255 - (2 - (2 * sRA) / sA) * (255 - dst[px]);
        dst[px + 1] =
          sGA <= 0.5
            ? (2 * dst[px + 1] * sGA) / dA
            : 255 - (2 - (2 * sGA) / sA) * (255 - dst[px + 1]);
        dst[px + 2] =
          sBA <= 0.5
            ? (2 * dst[px + 2] * sBA) / dA
            : 255 - (2 - (2 * sBA) / sA) * (255 - dst[px + 2]);
        break;

      case 'colordodge':
      case 'dodge':
        if (src[px] === 255 && dRA === 0) dst[px] = 255;
        else dst[px] = Math.min(255, dst[px] / (255 - src[px])) * demultiply;

        if (src[px + 1] === 255 && dGA === 0) dst[px + 1] = 255;
        else {
          dst[px + 1] =
            Math.min(255, dst[px + 1] / (255 - src[px + 1])) * demultiply;
        }

        if (src[px + 2] === 255 && dBA === 0) dst[px + 2] = 255;
        else {
          dst[px + 2] =
            Math.min(255, dst[px + 2] / (255 - src[px + 2])) * demultiply;
        }
        break;

      case 'colorburn':
      case 'burn':
        if (src[px] === 0 && dRA === 0) dst[px] = 0;
        else dst[px] = (1 - Math.min(1, (1 - dRA) / sRA)) * demultiply;

        if (src[px + 1] === 0 && dGA === 0) dst[px + 1] = 0;
        else dst[px + 1] = (1 - Math.min(1, (1 - dGA) / sGA)) * demultiply;

        if (src[px + 2] === 0 && dBA === 0) dst[px + 2] = 0;
        else dst[px + 2] = (1 - Math.min(1, (1 - dBA) / sBA)) * demultiply;
        break;

      case 'darken':
      case 'darker':
        dst[px] = (sRA > dRA ? dRA : sRA) * demultiply;
        dst[px + 1] = (sGA > dGA ? dGA : sGA) * demultiply;
        dst[px + 2] = (sBA > dBA ? dBA : sBA) * demultiply;
        break;

      case 'lighten':
      case 'lighter':
        dst[px] = (sRA < dRA ? dRA : sRA) * demultiply;
        dst[px + 1] = (sGA < dGA ? dGA : sGA) * demultiply;
        dst[px + 2] = (sBA < dBA ? dBA : sBA) * demultiply;
        break;

      case 'exclusion':
        dst[px] = (dRA + sRA - 2 * dRA * sRA) * demultiply;
        dst[px + 1] = (dGA + sGA - 2 * dGA * sGA) * demultiply;
        dst[px + 2] = (dBA + sBA - 2 * dBA * sBA) * demultiply;
        break;

      // ******* UNSUPPORTED
      default:
        dst[px] = dst[px + 3] = 255;
        dst[px + 1] = px % 8 === 0 ? 255 : 0;
        dst[px + 2] = px % 8 === 0 ? 0 : 255;
    }
  }
}
dataBlend.modes = [
  'normal',
  'screen',
  'multiply',
  'difference',
  'src-in',
  'add',
  'overlay',
  'hardlight',
  'dodge',
  'burn',
  'darker',
  'lighter',
  'exclusion',
];
export default dataBlend;
