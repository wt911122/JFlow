"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCanvas = createCanvas;
exports.requestCacheCanvas = requestCacheCanvas;

/**
 * @typedef {Object} CanvasMeta
 * @property {Element} canvas - canvas 元素
 * @property {number} width - 画布宽度
 * @property {number} height - 画布高度
 * @property {number} raw_width - 画布元素宽度
 * @property {number} raw_height - 画布元素高度
 * @property {number} left - 画布距离左端距离
 * @property {number} top - 画布距离顶端距离
 * @property {Context2d} ctx - Context2d
 * @property {number} scale - 当前的像素设备比
 */

/**
 * 创建一个 canvas 元素
 * @param  {Element} wrapper - dom元素
 * @return {CanvasMeta}
 */
function createCanvas(wrapper) {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');

  var _wrapper$getBoundingC = wrapper.getBoundingClientRect(),
      width = _wrapper$getBoundingC.width,
      height = _wrapper$getBoundingC.height,
      left = _wrapper$getBoundingC.left,
      top = _wrapper$getBoundingC.top;

  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  canvas.style.userSelect = 'none';
  var scale = window.devicePixelRatio;
  canvas.width = Math.floor(width * scale);
  canvas.height = Math.floor(height * scale);

  if (wrapper) {
    wrapper.style.position = 'relative';
    wrapper.append(canvas);
  }

  return {
    canvas: canvas,
    width: width,
    height: height,
    raw_width: canvas.width,
    raw_height: canvas.height,
    left: left,
    top: top,
    ctx: ctx,
    scale: scale
  };
}

var caheCanvas = document.createElement('canvas');
caheCanvas.width = 1;
caheCanvas.height = 1;
var caheCanvasctx = caheCanvas.getContext('2d');
var scale = window.devicePixelRatio;
caheCanvasctx.scale(scale, scale);
/**
 * 在离线canvas上绘制元素
 * @param  {render} render - 绘图函数
 */

function requestCacheCanvas(render) {
  caheCanvasctx.clearRect(0, 0, 5, 5);
  caheCanvasctx.save();
  render(caheCanvasctx);
  caheCanvasctx.restore();
  caheCanvasctx.clearRect(0, 0, 5, 5);
}
//# sourceMappingURL=canvas.js.map
