
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
export function createCanvas(wrapper) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const { width, height, left, top } = wrapper.getBoundingClientRect();
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.style.userSelect = 'none';
    const scale = window.devicePixelRatio;
    canvas.width = Math.floor(width * scale);
    canvas.height = Math.floor(height * scale);

    if(wrapper) {
        wrapper.style.position = 'relative';
        wrapper.style.overflow = 'hidden';
        wrapper.append(canvas);
    }
    return {
        canvas,
        width,
        height,
        raw_width: canvas.width,
        raw_height: canvas.height,
        left,
        top,
        ctx,
        scale,
    }
}

export function resizeCanvas(canvas, wrapper) {
    const { width, height, left, top } = wrapper.getBoundingClientRect();
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    const scale = window.devicePixelRatio;
    canvas.width = Math.floor(width * scale);
    canvas.height = Math.floor(height * scale);
    return {
        width,
        height,
        raw_width: canvas.width,
        raw_height: canvas.height,
    }
}

const caheCanvas = document.createElement('canvas');
caheCanvas.width = 1;
caheCanvas.height = 1;
const caheCanvasctx = caheCanvas.getContext('2d');
const scale = window.devicePixelRatio;
caheCanvasctx.scale(scale, scale);

/**
 * 在离线canvas上绘制元素
 * @param  {render} render - 绘图函数
 */
export function requestCacheCanvas(render) {
    caheCanvasctx.clearRect(0,0,5,5);
    caheCanvasctx.save();
    render(caheCanvasctx);
    caheCanvasctx.restore();
    caheCanvasctx.clearRect(0,0,5,5);
}

export function listenOnDevicePixelRatio(callback, destroyHandler) {
    const target = matchMedia(
        `(resolution: ${window.devicePixelRatio}dppx)`
    );
    function onChange() {
      console.log("devicePixelRatio changed: " + window.devicePixelRatio);
      callback(window.devicePixelRatio);
      listenOnDevicePixelRatio(callback, destroyHandler);
    }
    destroyHandler(() => {
        console.log('remove devicePixelRatio event handler')
        target.removeEventListener("change", onChange, { once: true });
    })
    target.addEventListener("change", onChange, { once: true });
}