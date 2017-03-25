(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Glitch"] = factory();
	else
		root["Glitch"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 28);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var extend = __webpack_require__(12);

/**
 * Numeric (decimal) parameter.
 * @param name The name of the parameter.
 * @param options Options for the parameter.
 * @returns {*} Parameter definition object.
 */
function Num(name, options) {
  return extend({}, { type: 'num', min: 0, max: 1, step: null, name: name }, options);
}

/**
 * Integer parameter.
 * @param name The name of the parameter.
 * @param options Options for the parameter.
 * @returns {*} Parameter definition object.
 */
function Int(name, options) {
  return extend({}, { type: 'int', min: 0, max: 100, step: 1, name: name }, options);
}

/**
 * Boolean parameter.
 * @param name The name of the parameter.
 * @param options Options for the parameter.
 * @returns {*} Parameter definition object.
 */
function Bool(name, options) {
  return extend({}, { type: 'bool', name: name }, options);
}

extend(module.exports, {
  num: Num, // num num num
  int: Int,
  bool: Bool
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function defaults(target, defaultValues) {
  for (var key in defaultValues) {
    // eslint-disable-line no-restricted-syntax
    if (defaultValues.hasOwnProperty(key) && !(key in target)) {
      // eslint-disable-line no-prototype-builtins
      target[key] = defaultValues[key];
    }
  }
  return target;
}

module.exports = defaults;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function randint(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function birandint(min, max) {
  var sign = Math.random() <= 0.5 ? -1 : +1;
  return randint(min, max) * sign;
}

function rand() {
  var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  return Math.random() * (max - min) + min;
}

module.exports = {
  randint: randint,
  birandint: birandint,
  rand: rand
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function lerp(a, b) {
  var alpha = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;

  return b * alpha + a * (1 - alpha);
}

function wrap(num, max) {
  while (num < 0) {
    num += max;
  }
  return num % max;
}

function clamp(num, min, max) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  if (num < min) {
    return min;
  }
  if (num >= max) {
    return max;
  }
  return num;
}

function mod(a, b) {
  if (a < 0) {
    a += (1 + 0 | a / -b) * b;
  }
  return 0 | a % b;
}

module.exports.lerp = lerp;
module.exports.wrap = wrap;
module.exports.clamp = clamp;
module.exports.mod = mod;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var lerperCache = {};
var constantA = function constantA(a) {
  return a;
};
var constantB = function constantB(a, b) {
  return b;
};

function lerper(alpha) {
  var cached = void 0;
  if (alpha <= 0) {
    return constantA;
  }
  if (alpha >= 1) {
    return constantB;
  }
  var key = 0 | alpha * 100;
  if (cached = lerperCache[key]) return cached;
  var beta = 1 - alpha;
  return lerperCache[key] = new Function('a', 'b', 'return b * ' + alpha + ' + a * ' + beta);
}

module.exports = lerper;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function colorTransformImageData(imageData, matrix) {
  var r = void 0;
  var g = void 0;
  var b = void 0;
  var data = imageData.data;
  var rPre = matrix[0];
  var rPost = matrix[1];
  var r0 = matrix[2];
  var r1 = matrix[3];
  var r2 = matrix[4];
  var gPre = matrix[5];
  var gPost = matrix[6];
  var g0 = matrix[7];
  var g1 = matrix[8];
  var g2 = matrix[9];
  var bPre = matrix[10];
  var bPost = matrix[11];
  var b0 = matrix[12];
  var b1 = matrix[13];
  var b2 = matrix[14];
  var to$ = data.length;
  for (var offset = 0; offset < to$; offset += 4) {
    r = data[offset] + rPre;
    g = data[offset + 1] + gPre;
    b = data[offset + 2] + bPre;
    data[offset] = r0 * r + r1 * g + r2 * b + rPost;
    data[offset + 1] = g0 * r + g1 * g + g2 * b + gPost;
    data[offset + 2] = b0 * r + b1 * g + b2 * b + bPost;
  }
}
module.exports = colorTransformImageData;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* based on https://github.com/Phrogz/context-blender */

function dataBlend(srcD, dstD, sA, dA, blendMode) {
  var src = srcD.data;
  var dst = dstD.data;
  var len = dst.length;
  var sRA = void 0;
  var sGA = void 0;
  var sBA = void 0;
  var dRA = void 0;
  var dGA = void 0;
  var dBA = void 0;
  var dA2 = void 0;
  var demultiply = void 0;
  dA2 = sA + dA - sA * dA;
  for (var px = 0; px < len; px += 4) {
    sRA = src[px] / 255 * sA;
    dRA = dst[px] / 255 * dA;
    sGA = src[px + 1] / 255 * sA;
    dGA = dst[px + 1] / 255 * dA;
    sBA = src[px + 2] / 255 * sA;
    dBA = dst[px + 2] / 255 * dA;

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
        dst[px + 1] = (sGA * dGA + sGA * (1 - dA) + dGA * (1 - sA)) * demultiply;
        dst[px + 2] = (sBA * dBA + sBA * (1 - dA) + dBA * (1 - sA)) * demultiply;
        break;

      case 'difference':
        dst[px] = (sRA + dRA - 2 * Math.min(sRA * dA, dRA * sA)) * demultiply;
        dst[px + 1] = (sGA + dGA - 2 * Math.min(sGA * dA, dGA * sA)) * demultiply;
        dst[px + 2] = (sBA + dBA - 2 * Math.min(sBA * dA, dBA * sA)) * demultiply;
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
        dst[px] = dRA <= 0.5 ? 2 * src[px] * dRA / dA : 255 - (2 - 2 * dRA / dA) * (255 - src[px]);
        dst[px + 1] = dGA <= 0.5 ? 2 * src[px + 1] * dGA / dA : 255 - (2 - 2 * dGA / dA) * (255 - src[px + 1]);
        dst[px + 2] = dBA <= 0.5 ? 2 * src[px + 2] * dBA / dA : 255 - (2 - 2 * dBA / dA) * (255 - src[px + 2]);

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
        dst[px] = sRA <= 0.5 ? 2 * dst[px] * sRA / dA : 255 - (2 - 2 * sRA / sA) * (255 - dst[px]);
        dst[px + 1] = sGA <= 0.5 ? 2 * dst[px + 1] * sGA / dA : 255 - (2 - 2 * sGA / sA) * (255 - dst[px + 1]);
        dst[px + 2] = sBA <= 0.5 ? 2 * dst[px + 2] * sBA / dA : 255 - (2 - 2 * sBA / sA) * (255 - dst[px + 2]);
        break;

      case 'colordodge':
      case 'dodge':
        if (src[px] === 255 && dRA === 0) dst[px] = 255;else dst[px] = Math.min(255, dst[px] / (255 - src[px])) * demultiply;

        if (src[px + 1] === 255 && dGA === 0) dst[px + 1] = 255;else dst[px + 1] = Math.min(255, dst[px + 1] / (255 - src[px + 1])) * demultiply;

        if (src[px + 2] === 255 && dBA === 0) dst[px + 2] = 255;else dst[px + 2] = Math.min(255, dst[px + 2] / (255 - src[px + 2])) * demultiply;
        break;

      case 'colorburn':
      case 'burn':
        if (src[px] === 0 && dRA === 0) dst[px] = 0;else dst[px] = (1 - Math.min(1, (1 - dRA) / sRA)) * demultiply;

        if (src[px + 1] === 0 && dGA === 0) dst[px + 1] = 0;else dst[px + 1] = (1 - Math.min(1, (1 - dGA) / sGA)) * demultiply;

        if (src[px + 2] === 0 && dBA === 0) dst[px + 2] = 0;else dst[px + 2] = (1 - Math.min(1, (1 - dBA) / sBA)) * demultiply;
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
module.exports = dataBlend;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports.to = [0, 0, 0.299, 0.587, 0.114, 0, 128, -0.169, -0.331, 0.500, 0, 128, 0.500, -0.419, 0.081];
module.exports.from = [0, 0, 1, 0, 1.4, -128, 0, 1, -0.343, -0.711, -128, 0, 1, 1.765, 0];

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function GlitchContext(canvas) {
  /** @type canvas {HTMLCanvasElement} */
  this._canvas = canvas;
  this._context = canvas.getContext('2d');
  this._imageData = null;
  this.clock = +new Date();
}

/**
 * Effect modules should primarily use this to get a reference to the image data
 * for the current context. It may return a pre-existing ImageData object, or it may
 * call the (possibly expensive) `context.getImageData` method.
 * @returns {ImageData}
 */
GlitchContext.prototype.getImageData = function getImageData() {
  if (this._imageData) return this._imageData;
  return this._context.getImageData(0, 0, this._canvas.width, this._canvas.height);
};

/**
 * When a fresh _copy_ of image data is required, call this potentially expensive method.
 * @returns {ImageData}
 */
GlitchContext.prototype.copyImageData = function copyImageData() {
  this._commitImageData();
  return this._context.getImageData(0, 0, this._canvas.width, this._canvas.height);
};

/**
 * When an effect is done with image data, it should call this to ensure the context
 * knows of any possible changes to it.
 * @param newImageData {ImageData} Modified image data.
 */
GlitchContext.prototype.setImageData = function setImageData(newImageData) {
  if (this._imageData === newImageData) return;
  this._commitImageData();
  this._imageData = newImageData;
};

GlitchContext.prototype._commitImageData = function _commitImageData() {
  if (this._imageData) {
    this._context.putImageData(this._imageData, 0, 0);
    this._imageData = null;
  }
};

/**
 * If an effect requires the actual 2D Canvas context instead of just ImageData,
 * it can call this. May be expensive.
 * @returns {CanvasRenderingContext2D}
 */
GlitchContext.prototype.getContext = function getContext() {
  this._commitImageData();
  return this._context;
};

/**
 * This should be called to ensure all changes to the canvas have been committed.
 */
GlitchContext.prototype.finalize = function finalize() {
  this._commitImageData();
};

module.exports = GlitchContext;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable global-require */
module.exports = {
  afterimage: __webpack_require__(15),
  bitbang: __webpack_require__(16),
  bloom: __webpack_require__(17),
  from_ycbcr: __webpack_require__(18),
  leak: __webpack_require__(19),
  noise: __webpack_require__(20),
  scanlines: __webpack_require__(21),
  sliceglitch: __webpack_require__(22),
  slicerep: __webpack_require__(23),
  streak: __webpack_require__(24),
  to_ycbcr: __webpack_require__(25),
  tv_displacement: __webpack_require__(26),
  tvscan: __webpack_require__(27)
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-env browser */
var makeDrawable = __webpack_require__(13);
var clamp = __webpack_require__(3).clamp;

function displacementMapper(imageData, displacementMap, scaleX, scaleY) {
  if (scaleX === 0 && scaleY === 0) return null;
  var width = imageData.width;
  var height = imageData.height;
  // Rescale displacement map
  var tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  var tempContext = tempCanvas.getContext('2d');
  tempContext.drawImage(makeDrawable(displacementMap), 0, 0, width, height);
  var displacementData = tempContext.getImageData(0, 0, width, height).data;
  var sourceBuf = imageData.data;
  var destBuf = new Uint8ClampedArray(sourceBuf);
  for (var y = 0; y < height; ++y) {
    var yoff = y * width * 4;
    for (var x = 0; x < width; ++x) {
      var offset = yoff + x * 4;
      var disZ = displacementData[offset + 2] / 127.0;
      var disX = (displacementData[offset] - 127) / 128.0 * scaleX * disZ;
      var disY = (displacementData[offset + 1] - 127) / 128.0 * scaleY * disZ;
      var sourceX = 0 | Math.round(x + disX);
      var sourceY = 0 | Math.round(y + disY);
      var sourceOffset = clamp(sourceY, height) * width * 4 + clamp(sourceX, width) * 4;
      destBuf[offset++] = sourceBuf[sourceOffset++];
      destBuf[offset++] = sourceBuf[sourceOffset++];
      destBuf[offset++] = sourceBuf[sourceOffset++];
    }
  }
  imageData.data.set(destBuf);
  return imageData;
}

module.exports = displacementMapper;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-env browser */
function createTVDisplacementMap() {
  var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 256;
  var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 224;

  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  var context = canvas.getContext('2d');
  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);
  var data = context.getImageData(0, 0, width, height);
  for (var y = 0; y < height; ++y) {
    for (var x = 0; x < width; ++x) {
      var ix = (x / width - 0.5) * 2;
      var iy = (y / height - 0.5) * 2;
      var cdis = 1.0 - (ix * ix + iy * iy);
      cdis = Math.cos(cdis * 3.141 / 2.0);
      var an = Math.atan2(iy, ix);
      var xd = -Math.cos(an) * 125 * cdis;
      var yd = -Math.sin(an) * 125 * cdis;
      var offset = y * width * 4 + x * 4;
      data.data[offset] = 127 + xd;
      data.data[offset + 1] = 127 + yd;
      data.data[offset + 2] = 127;
    }
  }
  context.putImageData(data, 0, 0);
  return canvas;
}

module.exports = createTVDisplacementMap;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function extend(target) {
  var source = void 0;

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  while (source = args.shift()) {
    for (var key in source) {
      // eslint-disable-line no-restricted-syntax
      if (source.hasOwnProperty(key)) {
        // eslint-disable-line no-prototype-builtins
        target[key] = source[key];
      }
    }
  }
  return target;
}

module.exports = extend;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-env browser */
function makeDrawable(obj) {
  if (obj.data && obj.width && obj.height) {
    // Quacks like an ImageData, so wrap it in a canvas
    var canvas = document.createElement('canvas');
    canvas.width = obj.width;
    canvas.height = obj.height;
    canvas.getContext('2d').putImageData(obj, 0, 0);
    return canvas;
  }
  if (obj.getContext) {
    // Quacks like a Canvas
    return obj;
  }
  if (/HTML(Image|Video|Canvas)Element/.test('' + obj)) {
    // Quacks like something drawable
    return obj;
  }
  throw new Error('Can\'t make a drawable out of ' + obj);
}

module.exports = makeDrawable;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable camelcase,no-tabs */
/*

 StackBlur - a fast almost Gaussian Blur For Canvas

 Version: 	0.5
 Author:		Mario Klingemann
 Contact: 	mario@quasimondo.com
 Website:	http://www.quasimondo.com/StackBlurForCanvas
 Twitter:	@quasimondo

 In case you find this class useful - especially in commercial projects -
 I am not totally unhappy for a small donation to my PayPal account
 mario@quasimondo.de

 Or support me on flattr:
 https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript

 Copyright (c) 2010 Mario Klingemann

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
 */

var mul_table = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259];

var shg_table = [9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];

function BlurStack() {
  this.r = 0;
  this.g = 0;
  this.b = 0;
  this.a = 0;
  this.next = null;
}

function stackBlurImageData(imageData, top_x, top_y, width, height, radius) {
  if (isNaN(radius) || radius < 1) return;
  radius |= 0;

  var pixels = imageData.data;

  var x = void 0;
  var y = void 0;
  var i = void 0;
  var p = void 0;
  var yp = void 0;
  var yi = void 0;
  var yw = void 0;
  var r_sum = void 0;
  var g_sum = void 0;
  var b_sum = void 0;
  var r_out_sum = void 0;
  var g_out_sum = void 0;
  var b_out_sum = void 0;
  var r_in_sum = void 0;
  var g_in_sum = void 0;
  var b_in_sum = void 0;
  var pr = void 0;
  var pg = void 0;
  var pb = void 0;
  var rbs = void 0;

  var div = radius + radius + 1;
  var widthMinus1 = width - 1;
  var heightMinus1 = height - 1;
  var radiusPlus1 = radius + 1;
  var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;

  var stackStart = new BlurStack();
  var stackEnd = void 0;
  var stack = stackStart;
  for (i = 1; i < div; i++) {
    stack = stack.next = new BlurStack();
    if (i === radiusPlus1) stackEnd = stack;
  }
  stack.next = stackStart;
  var stackIn = null;
  var stackOut = null;

  yw = yi = 0;

  var mul_sum = mul_table[radius];
  var shg_sum = shg_table[radius];

  for (y = 0; y < height; y++) {
    r_in_sum = g_in_sum = b_in_sum = r_sum = g_sum = b_sum = 0;

    r_out_sum = radiusPlus1 * (pr = pixels[yi]);
    g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
    b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);

    r_sum += sumFactor * pr;
    g_sum += sumFactor * pg;
    b_sum += sumFactor * pb;

    stack = stackStart;

    for (i = 0; i < radiusPlus1; i++) {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack = stack.next;
    }

    for (i = 1; i < radiusPlus1; i++) {
      p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
      r_sum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
      g_sum += (stack.g = pg = pixels[p + 1]) * rbs;
      b_sum += (stack.b = pb = pixels[p + 2]) * rbs;

      r_in_sum += pr;
      g_in_sum += pg;
      b_in_sum += pb;

      stack = stack.next;
    }

    stackIn = stackStart;
    stackOut = stackEnd;
    for (x = 0; x < width; x++) {
      pixels[yi] = r_sum * mul_sum >> shg_sum;
      pixels[yi + 1] = g_sum * mul_sum >> shg_sum;
      pixels[yi + 2] = b_sum * mul_sum >> shg_sum;

      r_sum -= r_out_sum;
      g_sum -= g_out_sum;
      b_sum -= b_out_sum;

      r_out_sum -= stackIn.r;
      g_out_sum -= stackIn.g;
      b_out_sum -= stackIn.b;

      p = yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1) << 2;

      r_in_sum += stackIn.r = pixels[p];
      g_in_sum += stackIn.g = pixels[p + 1];
      b_in_sum += stackIn.b = pixels[p + 2];

      r_sum += r_in_sum;
      g_sum += g_in_sum;
      b_sum += b_in_sum;

      stackIn = stackIn.next;

      r_out_sum += pr = stackOut.r;
      g_out_sum += pg = stackOut.g;
      b_out_sum += pb = stackOut.b;

      r_in_sum -= pr;
      g_in_sum -= pg;
      b_in_sum -= pb;

      stackOut = stackOut.next;

      yi += 4;
    }
    yw += width;
  }

  for (x = 0; x < width; x++) {
    g_in_sum = b_in_sum = r_in_sum = g_sum = b_sum = r_sum = 0;

    yi = x << 2;
    r_out_sum = radiusPlus1 * (pr = pixels[yi]);
    g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
    b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);

    r_sum += sumFactor * pr;
    g_sum += sumFactor * pg;
    b_sum += sumFactor * pb;

    stack = stackStart;

    for (i = 0; i < radiusPlus1; i++) {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack = stack.next;
    }

    yp = width;

    for (i = 1; i <= radius; i++) {
      yi = yp + x << 2;

      r_sum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
      g_sum += (stack.g = pg = pixels[yi + 1]) * rbs;
      b_sum += (stack.b = pb = pixels[yi + 2]) * rbs;

      r_in_sum += pr;
      g_in_sum += pg;
      b_in_sum += pb;

      stack = stack.next;

      if (i < heightMinus1) {
        yp += width;
      }
    }

    yi = x;
    stackIn = stackStart;
    stackOut = stackEnd;
    for (y = 0; y < height; y++) {
      p = yi << 2;
      pixels[p] = r_sum * mul_sum >> shg_sum;
      pixels[p + 1] = g_sum * mul_sum >> shg_sum;
      pixels[p + 2] = b_sum * mul_sum >> shg_sum;

      r_sum -= r_out_sum;
      g_sum -= g_out_sum;
      b_sum -= b_out_sum;

      r_out_sum -= stackIn.r;
      g_out_sum -= stackIn.g;
      b_out_sum -= stackIn.b;

      p = x + ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width << 2;

      r_sum += r_in_sum += stackIn.r = pixels[p];
      g_sum += g_in_sum += stackIn.g = pixels[p + 1];
      b_sum += b_in_sum += stackIn.b = pixels[p + 2];

      stackIn = stackIn.next;

      r_out_sum += pr = stackOut.r;
      g_out_sum += pg = stackOut.g;
      b_out_sum += pb = stackOut.b;

      r_in_sum -= pr;
      g_in_sum -= pg;
      b_in_sum -= pb;

      stackOut = stackOut.next;

      yi += width;
    }
  }
}

module.exports = stackBlurImageData;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(1);
var dataBlend = __webpack_require__(6);
var p = __webpack_require__(0);

function afterimage(glitchContext, options) {
  options = defaults(options, afterimage.paramDefaults);

  var data = glitchContext.getImageData();
  if (glitchContext.afterimageData) {
    dataBlend(glitchContext.afterimageData, data, options.strengthOut, options.counterStrengthOut, 'screen');
  }
  if (glitchContext.afterimageData && options.strengthIn < 1) {
    dataBlend(data, glitchContext.afterimageData, options.strengthIn, 1.0 - options.strengthIn, 'normal');
  } else {
    glitchContext.setImageData(data);
    glitchContext.afterimageData = glitchContext.copyImageData();
  }
  glitchContext.setImageData(data);
}
afterimage.paramDefaults = {
  strengthOut: 0.2,
  counterStrengthOut: 0.3,
  strengthIn: 0.2
};

afterimage.params = [p.num('strengthOut', { description: 'Afterimage write strength' }), p.num('counterStrengthOut', { description: 'Afterimage write counter-strength' }), p.num('strengthIn', { description: 'Afterimage read strength' })];

module.exports = afterimage;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var lerper = __webpack_require__(4);
var defaults = __webpack_require__(1);
var randint = __webpack_require__(2).randint;
var rand = __webpack_require__(2).rand;
var mod = __webpack_require__(3).mod;
var p = __webpack_require__(0);

function _bitbang(outputData, inputData, options) {
  var strideIn = randint(options.strideInMin, options.strideInMax);
  var strideOut = randint(options.strideOutMin, options.strideOutMax);
  var offIn = randint(-options.offInScale, options.offInScale);
  var offOut = randint(-options.offOutScale, options.offOutScale);
  var yDrift = randint(options.minYDrift, options.maxYDrift);
  var feedback = rand(options.feedbackMin, options.feedbackMax);
  var fblerp = lerper(feedback);
  var inp = inputData.data;
  var inl = inp.length;
  var outp = outputData.data;
  var outl = outp.length;
  var width = outputData.width;
  var last = 0;
  for (var i = 0; i < outl; ++i) {
    var ii = offIn + i * strideIn;
    ii += (0 | ii / width) * yDrift;
    ii = mod(ii, inl);
    var io = mod(offOut + i * strideOut, outl);
    if (feedback > 0) {
      last = outp[io] = 0 | fblerp(last, inp[ii]);
    } else {
      outp[io] = inp[ii];
    }
  }
  for (var _i = 0; _i < outl; _i += 4) {
    outp[_i + 3] = 255;
  }
}

function bitbang(glitchContext, options) {
  options = defaults(options, bitbang.paramDefaults);
  var inputData = glitchContext.copyImageData();
  var outputData = glitchContext.copyImageData();
  _bitbang(outputData, inputData, options);
  glitchContext.setImageData(outputData);
}

bitbang.paramDefaults = {
  offInScale: 0,
  offOutScale: 0,
  strideInMin: 1,
  strideInMax: 7,
  strideOutMin: 1,
  strideOutMax: 7,
  feedbackMin: 0.2,
  feedbackMax: 0.8,
  minYDrift: 0,
  maxYDrift: 0
};

bitbang.params = [p.int('offInScale', { description: '' }), p.int('offOutScale', { description: '' }), p.int('strideInMin', { description: '', randomBias: 3 }), p.int('strideInMax', { description: '', randomBias: 3 }), p.int('strideOutMin', { description: '', randomBias: 3 }), p.int('strideOutMax', { description: '', randomBias: 3 }), p.num('feedbackMin', { description: '' }), p.num('feedbackMax', { description: '' }), p.int('minYDrift', { description: '' }), p.int('maxYDrift', { description: '' })];

module.exports = bitbang;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(1);
var dataBlend = __webpack_require__(6);
var stackBlurImageData = __webpack_require__(14);
var p = __webpack_require__(0);

function bloom(glitchContext, options) {
  options = defaults(options, bloom.paramDefaults);

  if (options.strength <= 0 || options.radius <= 0) {
    return;
  }

  var sourceData = glitchContext.getImageData();
  var blurData = glitchContext.copyImageData();
  stackBlurImageData(blurData, 0, 0, sourceData.width, sourceData.height, options.radius);
  var counterStrength = options.counterStrength < 0 ? 1 - options.strength : options.counterStrength;
  dataBlend(blurData, sourceData, options.strength, counterStrength, 'screen');
  glitchContext.setImageData(sourceData);
}

bloom.paramDefaults = {
  radius: 5,
  strength: 0.7,
  counterStrength: -1
};

bloom.params = [p.int('radius', { description: 'blur radius' }), p.num('strength', { description: 'bloom strength' }), p.num('counterStrength', { description: 'bloom counter-strength, set to < 0 for auto' })];

module.exports = bloom;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var colorTransformImageData = __webpack_require__(5);
var ycbcr = __webpack_require__(7);

function fromYCbCr(glitchContext) {
  var imageData = glitchContext.getImageData();
  colorTransformImageData(imageData, ycbcr.from);
  glitchContext.setImageData(imageData);
}
fromYCbCr.params = [];

module.exports = fromYCbCr;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var lerper = __webpack_require__(4);
var defaults = __webpack_require__(1);
var randint = __webpack_require__(2).randint;
var p = __webpack_require__(0);

function _leak(imageData, lerp, magic1, magic2, yToMagic1, yToMagic2) {
  var width = imageData.width;
  var height = imageData.height;
  var data = imageData.data;
  var dwidth = width * 4;
  var len = data.length;
  for (var y = 0; y < height; ++y) {
    var fy = y / height;
    var yoffset = y * dwidth + 0 | magic1 + yToMagic1 * fy;
    for (var offset = yoffset, to$ = yoffset + dwidth; offset < to$; offset += 4) {
      var src = offset + 4 + 0 | magic2 + yToMagic2 * fy;
      if (src >= 0 && src < len && offset >= 0 && offset < len) {
        data[offset] = 0 | lerp(data[offset], data[src]);
      }
    }
  }
}

function leak(glitchContext, options) {
  options = defaults(options, leak.paramDefaults);
  if (options.intensity <= 0) return;
  var n = randint(options.nMin, options.nMax);
  if (n <= 0) return;
  var imageData = glitchContext.getImageData();
  var lerp = lerper(options.intensity);
  for (var i = 0; i < n; i++) {
    _leak(imageData, lerp, options.magic1, options.magic2, options.yToMagic1, options.yToMagic2);
  }
  glitchContext.setImageData(imageData);
}

leak.paramDefaults = {
  intensity: 0.5,
  magic1: 0,
  magic2: 0,
  yToMagic1: 0,
  yToMagic2: 0,
  nMin: 10,
  nMax: 10
};

leak.params = [p.num('intensity', { description: 'Effect intensity' }), p.int('magic1', { description: 'Magic 1', min: -40, max: +40 }), p.int('magic2', { description: 'Magic 2', min: -40, max: +40 }), p.num('yToMagic1', { description: 'Y coordinate to Magic 1', min: -100, max: +100 }), p.num('yToMagic2', { description: 'Y coordinate to Magic 2', min: -100, max: +100 }), p.int('nMin', { description: 'Min repetitions' }), p.int('nMax', { description: 'Max repetitions' })];

module.exports = leak;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable no-continue */
var defaults = __webpack_require__(1);
var randint = __webpack_require__(2).randint;
var p = __webpack_require__(0);

function _noiseBand(imageData, y0, y1, noisiness, minBrightness, maxBrightness, replace) {
  var y = void 0;
  var yoff = void 0;
  var x = void 0;
  var offset = void 0;
  var brightness = void 0;
  var data = imageData.data;
  var width = imageData.width;
  if (replace) {
    if (minBrightness <= 0) minBrightness = 0;
    if (maxBrightness >= 255) maxBrightness = 255;
  }
  for (y = y0; y < y1; ++y) {
    yoff = y * width * 4;
    for (x = 0; x < width; ++x) {
      if (noisiness >= 1 || Math.random() < noisiness) {
        offset = yoff + x * 4;
        brightness = randint(minBrightness, maxBrightness);
        if (replace) {
          data[offset++] = brightness;
          data[offset++] = brightness;
          data[offset++] = brightness;
        } else {
          data[offset++] += brightness;
          data[offset++] += brightness;
          data[offset++] += brightness;
        }
      }
    }
  }
}

function noise(glitchContext, options) {
  options = defaults(options, noise.paramDefaults);
  var n = options.full ? 1 : randint(options.nMin, options.nMax);
  if (n <= 0) return;
  var imageData = glitchContext.getImageData();
  if (options.full) {
    _noiseBand(imageData, 0, imageData.height, options.noisiness, options.brightnessMin, options.brightnessMax, options.replace);
  } else {
    var hMin = options.heightMin * imageData.height;
    var hMax = options.heightMax * imageData.height;
    for (var x = 0; x < n; ++x) {
      var h = randint(hMin, hMax);
      if (h <= 0) continue;
      var y0 = randint(0, imageData.height - h);
      var y1 = y0 + h;
      _noiseBand(imageData, y0, y1, options.noisiness, options.brightnessMin, options.brightnessMax, options.replace);
    }
  }

  glitchContext.setImageData(imageData);
}

noise.paramDefaults = {
  heightMin: 0,
  heightMax: 0.1,
  nMin: 0,
  nMax: 10,
  brightnessMin: -50,
  brightnessMax: +50,
  noisiness: 1,
  replace: false,
  full: false
};

noise.params = [p.num('heightMin', { description: 'Noise band min height' }), p.num('heightMax', { description: 'Noise band max height' }), p.int('nMin', { description: 'Minimum number of noise bands' }), p.int('nMax', { description: 'Maximum number of noise bands' }), p.num('brightnessMin', { description: 'Minimum brightness modulation amount', min: -255, max: +255 }), p.num('brightnessMax', { description: 'Maximum brightness modulation amount', min: -255, max: +255 }), p.num('noisiness', { description: 'Probability of noising pixel' }), p.bool('replace', { description: 'Use brightness as absolute value instead of modulator' }), p.bool('full', { description: 'Don\'t band \u2013 noise the whole mess' })];

module.exports = noise;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(1);
var p = __webpack_require__(0);

function scanlines(glitchContext, options) {
  options = defaults(options, scanlines.paramDefaults);

  if (options.multiplier >= 1) {
    return;
  }
  var imageData = glitchContext.getImageData();
  var width = imageData.width,
      height = imageData.height,
      data = imageData.data;

  var multiplier = options.multiplier;
  var density = Math.max(2, 0 | options.density);
  var x = void 0;
  var y = void 0;
  for (y = 0; y < height; y += density) {
    for (x = 0; x < width; ++x) {
      var offset = y * width * 4 + x * 4;
      data[offset++] *= multiplier;
      data[offset++] *= multiplier;
      data[offset++] *= multiplier;
    }
  }
  glitchContext.setImageData(imageData);
}
scanlines.paramDefaults = {
  multiplier: 0.7,
  density: 2
};

scanlines.params = [p.num('multiplier', { description: 'Brightness multiplier' }), p.int('density', { description: 'Scanline density', min: 2 })];

module.exports = scanlines;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable no-continue */
var lerper = __webpack_require__(4);
var defaults = __webpack_require__(1);
var randint = __webpack_require__(2).randint;
var wrap = __webpack_require__(3).wrap;
var p = __webpack_require__(0);

function sliceoffset(imageData, y0, y1, offset, channelMask, blend, drift) {
  var x0 = void 0;
  var x1 = void 0;
  var dir = void 0;
  var y = void 0;
  var yoff = void 0;
  var x = void 0;
  var dstOffset = void 0;
  var srcOffset = void 0;
  var data = imageData.data,
      width = imageData.width;

  if (!channelMask) {
    return;
  }
  var lerp = lerper(blend);
  if (offset > 0) {
    x0 = 0;
    x1 = width;
    dir = +1;
  } else {
    x0 = width - 1;
    x1 = 0;
    dir = -1;
  }
  for (y = y0; y < y1; ++y) {
    yoff = y * width * 4;
    offset += drift;
    for (x = x0; dir < 0 ? x > x1 : x < x1; x += dir) {
      dstOffset = yoff + x * 4;
      srcOffset = yoff + wrap(0 | x + offset, width) * 4;
      if (channelMask & 1) {
        data[dstOffset] = lerp(data[dstOffset], data[srcOffset]);
      }
      if (channelMask & 2) {
        data[dstOffset + 1] = lerp(data[dstOffset + 1], data[srcOffset + 1]);
      }
      if (channelMask & 4) {
        data[dstOffset + 2] = lerp(data[dstOffset + 2], data[srcOffset + 2]);
      }
    }
  }
}

function deriveChanMask(options) {
  var chanmask = 0;
  if (!options.randomChan || randint(0, 100) < 33) {
    chanmask |= +options.chanR;
  }
  if (!options.randomChan || randint(0, 100) < 33) {
    chanmask |= +options.chanG << 1;
  }
  if (!options.randomChan || randint(0, 100) < 33) {
    chanmask |= +options.chanB << 2;
  }
  return chanmask;
}

function sliceglitch(glitchContext, options) {
  options = defaults(options, sliceglitch.paramDefaults);
  var n = randint(options.nMin, options.nMax);
  if (n <= 0) return;
  var data = glitchContext.getImageData();
  for (var i = 0; i < n; i++) {
    var drift = Math.random() < options.driftProb ? options.driftMag : 0;
    var sliceHeight = randint(options.heightMin * data.height, options.heightMax * data.height);
    var offset = randint(options.offsetMin, options.offsetMax);
    if (sliceHeight <= 0) continue;
    if (offset === 0) continue;
    var channelMask = deriveChanMask(options);
    var y0 = randint(0, data.height - sliceHeight);
    sliceoffset(data, y0, y0 + sliceHeight, offset, channelMask, options.blend, drift);
  }
  glitchContext.setImageData(data);
}

sliceglitch.paramDefaults = {
  chanR: true,
  chanG: true,
  chanB: true,
  randomChan: true,
  blend: 0.8,
  driftProb: 0,
  driftMag: 1,
  heightMin: 0.02,
  heightMax: 0.02,
  nMin: 0,
  nMax: 10,
  offsetMin: -5,
  offsetMax: +5
};

sliceglitch.params = [p.bool('chanR', { description: 'Glitch red channel?' }), p.bool('chanG', { description: 'Glitch green channel?' }), p.bool('chanB', { description: 'Glitch blue channel?' }), p.bool('randomChan', { description: 'Randomize glitched channels among those selected?' }), p.num('blend', { description: 'Blending factor' }), p.num('driftProb', { description: 'Drift probability' }), p.num('driftMag', { description: 'Drift magnitude (pixels per line)', min: -2, max: +2 }), p.num('heightMin', { description: 'Glitch slice height (%) (minimum)' }), p.num('heightMax', { description: 'Glitch slice height (%) (maximum)' }), p.int('nMin', { description: 'Number of slices (minimum)' }), p.int('nMax', { description: 'Number of slices (maximum)' }), p.num('offsetMin', { description: 'Glitch offset (minimum)', min: -100, max: +100 }), p.num('offsetMax', { description: 'Glitch offset (maximum)', min: -100, max: +100 })];

module.exports = sliceglitch;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(1);
var randint = __webpack_require__(2).randint;
var p = __webpack_require__(0);

function runSliceRep(imageData, startY, sliceHeight, repeats) {
  var writeOffset = void 0;
  var rep = void 0;
  var width = imageData.width;
  var offsetStart = startY * width * 4;
  var sliceLength = sliceHeight * width * 4;
  var sourceSlice = new Uint8ClampedArray(imageData.data.buffer, offsetStart, sliceLength);
  writeOffset = offsetStart;
  for (rep = 1; rep < repeats; ++rep) {
    writeOffset = offsetStart + sliceLength * rep;
    if (writeOffset + sliceLength < imageData.data.length) {
      imageData.data.set(sourceSlice, writeOffset);
    }
  }
}

function slicerep(glitchContext, options) {
  options = defaults(options, slicerep.paramDefaults);
  var n = randint(options.nMin, options.nMax);
  if (n <= 0) return;
  var data = glitchContext.getImageData();
  for (var x = 0; x < n; ++x) {
    var height = randint(options.heightMin * data.height, options.heightMax * data.height);
    var repeats = randint(options.repeatsMin, options.repeatsMax);
    var y0 = randint(0, data.height - height);
    runSliceRep(data, y0, height, repeats);
  }
  glitchContext.setImageData(data);
}

slicerep.paramDefaults = {
  nMin: 0,
  nMax: 5,
  heightMin: 0,
  heightMax: 0.01,
  repeatsMin: 0,
  repeatsMax: 50
};

slicerep.params = [p.int('nMin', { description: '' }), p.int('nMax', { description: '' }), p.num('heightMin', { description: 'Slice height minimum (%)' }), p.num('heightMax', { description: 'Slice height maximum (%)' }), p.int('repeatsMin', { description: '' }), p.int('repeatsMax', { description: '' })];

module.exports = slicerep;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(1);
var randint = __webpack_require__(2).randint;
var rand = __webpack_require__(2).rand;
var clamp = __webpack_require__(3).clamp;
var p = __webpack_require__(0);

function streak(glitchContext, options) {
  options = defaults(options, streak.paramDefaults);
  var imageData = glitchContext.getImageData();
  var buf = imageData.data;
  var height = imageData.height;
  var width = imageData.width;
  var xoff = 0;
  var yoff = 0;
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      if (randint(0, 65535) < options.xOffsetChance) {
        xoff += rand() < 0.5 ? -1 : +1;
      }
      if (randint(0, 65535) < options.yOffsetChance) {
        yoff += rand() < 0.5 ? -1 : +1;
      }
      if (randint(0, 65535) < options.offsetHalveChance) {
        xoff = 0 | xoff / 2;
        yoff = 0 | yoff / 2;
      }
      var srcx = clamp(x + xoff, 0, width - 1);
      var srcy = clamp(y + yoff, 0, height - 1);
      if (srcx !== x || srcy !== y) {
        var srcOffset = srcy * 4 * width + srcx * 4;
        var offset = y * 4 * width + x * 4;
        buf[offset++] = buf[srcOffset++];
        buf[offset++] = buf[srcOffset++];
        buf[offset++] = buf[srcOffset++];
      }
    }
    if (options.offsetResetEveryLine) {
      xoff = 0;
      yoff = 0;
    }
  }
  glitchContext.setImageData(imageData);
}

streak.paramDefaults = {
  xOffsetChance: 100,
  yOffsetChance: 500,
  offsetHalveChance: 10,
  offsetResetEveryLine: false
};

streak.params = [p.int('xOffsetChance', { min: 0, max: 65535 }), p.int('yOffsetChance', { min: 0, max: 65535 }), p.int('offsetHalveChance', { min: 0, max: 65535 }), p.bool('offsetResetEveryLine')];

module.exports = streak;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var colorTransformImageData = __webpack_require__(5);
var ycbcr = __webpack_require__(7);

function toYCbCr(glitchContext) {
  var imageData = glitchContext.getImageData();
  colorTransformImageData(imageData, ycbcr.to);
  glitchContext.setImageData(imageData);
}
toYCbCr.params = [];

module.exports = toYCbCr;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var makeTVDisplacement = __webpack_require__(11);
var displacementMapper = __webpack_require__(10);
var defaults = __webpack_require__(1);
var p = __webpack_require__(0);

function tvDisplacement(glitchContext, options) {
  options = defaults(options, tvDisplacement.paramDefaults);
  var data = glitchContext.getImageData();
  var dismap = void 0;
  var dismapCacheKey = 'tvdis_' + data.width + '_' + data.height;
  if (!(dismap = glitchContext[dismapCacheKey])) {
    dismap = glitchContext[dismapCacheKey] = makeTVDisplacement(data.width, data.height);
  }
  data = displacementMapper(data, dismap, options.strengthX, options.strengthY);
  glitchContext.setImageData(data);
}

tvDisplacement.paramDefaults = {
  strengthX: 0,
  strengthY: 0
};

tvDisplacement.params = [p.int('strengthX', { description: 'displacement strength (x)', min: -250, max: +250 }), p.int('strengthY', { description: 'displacement strength (y)', min: -250, max: +250 })];

module.exports = tvDisplacement;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable no-restricted-properties */
var defaults = __webpack_require__(1);
var mod = __webpack_require__(3).mod;
var p = __webpack_require__(0);

function runTvScan(imageData, clock, speed, strength, heightPerc) {
  var data = imageData.data,
      width = imageData.width,
      height = imageData.height;

  var y = void 0;
  var b = void 0;
  var off = void 0;
  var x = void 0;
  var mh = 0 | height * heightPerc;
  var y1 = mod(clock * speed, height + mh);
  var y0 = y1 - mh;
  for (y = 0; y < height; ++y) {
    if (y0 < y && y < y1) {
      b = Math.pow((y - y0) / mh, 2) * 255 * strength;
      if (b > 0) {
        off = y * width * 4;
        for (x = 0; x < width; ++x) {
          data[off++] += b;
          data[off++] += b;
          data[off++] += b;
          data[off++] = 255;
        }
      }
    }
  }
}
function tvScan(glitchContext, options) {
  options = defaults(options, tvScan.paramDefaults);
  if (options.strength <= 0) return;
  if (options.heightPerc <= 0) return;
  var imageData = glitchContext.getImageData();
  runTvScan(imageData, glitchContext.clock, options.speed, options.strength, options.heightPerc);
  glitchContext.setImageData(imageData);
}

tvScan.paramDefaults = {
  speed: 0.2,
  strength: 0.2,
  heightPerc: 0.2
};

tvScan.params = [p.num('speed', { description: 'Scan speed' }), p.num('strength', { description: 'Scan brightness' }), p.num('heightPerc', { description: 'Scan height (percentage)' })];

module.exports = tvScan;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _modules = __webpack_require__(9);

Object.defineProperty(exports, 'modules', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_modules).default;
  }
});

var _GlitchContext = __webpack_require__(8);

Object.defineProperty(exports, 'Context', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_GlitchContext).default;
  }
});

var _param = __webpack_require__(0);

Object.defineProperty(exports, 'param', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_param).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ })
/******/ ]);
});