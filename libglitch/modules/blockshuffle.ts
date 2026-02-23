import * as p from '../param';
import GlitchContext from '../GlitchContext';

interface BlockShuffleOptions {
  cols: number;
  rows: number;
  amount: number;
  maxDistX: number;
  maxDistY: number;
  copy: boolean;
}

const defaults: BlockShuffleOptions = {
  cols: 8,
  rows: 8,
  amount: 1,
  maxDistX: 0,
  maxDistY: 0,
  copy: false,
};

function blockshuffle(
  glitchContext: GlitchContext,
  pOptions: Partial<BlockShuffleOptions>,
) {
  const { cols, rows, amount, maxDistX, maxDistY, copy } = {
    ...defaults,
    ...pOptions,
  };
  if (cols < 2 && rows < 2) {
    return;
  }

  const srcCanvas = glitchContext.copyCanvas();
  const ctx = glitchContext.getContext();
  const { width, height } = ctx.canvas;
  const blockW = width / cols;
  const blockH = height / rows;

  const count = cols * rows;
  // indices[dst] = src: block originally at src is drawn at dst
  const indices = Array.from({ length: count }, (_, i) => i);
  const unlimited = maxDistX <= 0 && maxDistY <= 0;

  // Process positions in random order
  const order = Array.from({ length: count }, (_, i) => i);
  const swaps = Math.round(count * Math.min(1, Math.max(0, amount)));
  // Shuffle the order array, then only process `swaps` of them
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  const withinDist = (src: number, dst: number) =>
    Math.abs((src % cols) - (dst % cols)) <= maxDistX &&
    Math.abs(Math.floor(src / cols) - Math.floor(dst / cols)) <= maxDistY;

  // Precompute per-position neighbor lists for copy mode with distance constraint
  let neighbors: number[][] | null = null;
  if (copy && !unlimited) {
    neighbors = new Array(count);
    for (let i = 0; i < count; i++) {
      neighbors[i] = [];
      for (let k = 0; k < count; k++) {
        if (k !== i && withinDist(k, i)) {
          neighbors[i].push(k);
        }
      }
    }
  }

  for (let s = 0; s < swaps; s++) {
    const i = order[s];
    if (copy) {
      if (unlimited) {
        // Any other block is a valid source
        let k = Math.floor(Math.random() * (count - 1));
        if (k >= i) {
          k++;
        }
        indices[i] = k;
      } else {
        const nb = neighbors![i];
        if (nb.length > 0) {
          indices[i] = nb[Math.floor(Math.random() * nb.length)];
        }
      }
    } else if (unlimited) {
      // Plain Fisher-Yates step: swap with any remaining position
      const j = order[Math.floor(Math.random() * (swaps - s)) + s];
      [indices[i], indices[j]] = [indices[j], indices[i]];
    } else {
      // Find valid swap candidates: swapping indices[i] and indices[j]
      // must keep both source blocks within max distance of their destinations
      const candidates: number[] = [];
      for (let k = s; k < swaps; k++) {
        const j = order[k];
        if (withinDist(indices[j], i) && withinDist(indices[i], j)) {
          candidates.push(k);
        }
      }
      if (candidates.length > 0) {
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        const j = order[pick];
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
    }
  }

  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < count; i++) {
    const src = indices[i];
    const srcX = (src % cols) * blockW;
    const srcY = Math.floor(src / cols) * blockH;
    const dstX = (i % cols) * blockW;
    const dstY = Math.floor(i / cols) * blockH;
    ctx.drawImage(
      srcCanvas,
      srcX,
      srcY,
      blockW,
      blockH,
      dstX,
      dstY,
      blockW,
      blockH,
    );
  }
}

blockshuffle.paramDefaults = defaults;
blockshuffle.params = [
  p.int('cols', { description: 'Columns', min: 1, max: 64 }),
  p.int('rows', { description: 'Rows', min: 1, max: 64 }),
  p.num('amount', { description: 'Shuffle amount', min: 0, max: 1 }),
  p.int('maxDistX', {
    description: 'Max X distance (0 = unlimited)',
    min: 0,
    max: 64,
  }),
  p.int('maxDistY', {
    description: 'Max Y distance (0 = unlimited)',
    min: 0,
    max: 64,
  }),
  p.bool('copy', { description: 'Copy instead of swap' }),
];

export default blockshuffle;
