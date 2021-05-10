export function randomizeDef(def) {
  (def.module.params || []).forEach((paramDef) => {
    const paramName = paramDef.name;
    let rnd = Math.random();
    if (paramDef.randomBias) {
      rnd = Math.pow(rnd, paramDef.randomBias); // eslint-disable-line no-restricted-properties
    }
    switch (paramDef.type) {
      case 'bool':
        def.options[paramName] = rnd <= 0.5;
        break;
      case 'num':
      case 'int':
        {
          const min = paramDef.min || 0;
          const max = paramDef.max || 1;
          let val = min + rnd * (max - min);
          if (paramDef.type === 'int') val = Math.round(val, 0);
          def.options[paramName] = val;
        }
        break;
      case 'choice':
        def.options[paramName] =
          paramDef.choices[Math.floor(rnd * paramDef.choices.length)];
        break;
      default:
        break;
    }
  });
}

export function forceDownload(url, filename) {
  return new Promise((resolve) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      try {
        link.parentNode.removeChild(link);
      } catch (e) {
        // *shrug*
      }
      resolve();
    }, 15000);
  });
}
