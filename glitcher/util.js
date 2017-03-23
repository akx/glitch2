function randomizeDef(def) {
  (def.module.params || []).forEach((paramDef) => {
    const paramName = paramDef.name;
    let rnd = Math.random();
    if (paramDef.randomBias) {
      rnd = Math.pow(rnd, paramDef.randomBias);  // eslint-disable-line no-restricted-properties
    }
    if (paramDef.type === 'bool') {
      def.options[paramName] = (rnd <= 0.5);
    } else if (paramDef.type === 'num' || paramDef.type === 'int') {
      const min = paramDef.min || 0;
      const max = paramDef.max || 1;
      let val = min + (rnd * (max - min));
      if (paramDef.type === 'int') val = Math.round(val, 0);
      def.options[paramName] = val;
    }
  });
}

module.exports.randomizeDef = randomizeDef;


function forceDownload(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
}

module.exports.forceDownload = forceDownload;
