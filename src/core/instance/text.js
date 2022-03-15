import Rectangle from './shapes/rectangle';
import { DIRECTION } from '../utils/constance';
import { requestCacheCanvas } from '../utils/canvas';
import JFlowEvent from '../events';
function createInputElement() {
    const input = document.createElement('input');
    input.setAttribute('style',`
        position: absolute;
        left: 0;
        top: 0;
        border:none;
        background-image:none;
        background-color:transparent;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;`);
    return input;
}
/**
 * 文字对齐方式
 * @readonly
 * @enum {string}
 */
const TEXT_ALIGN = {
    CENTER: 'center',
    LEFT: 'left',
    RIGHT: 'right',
};
/**
 * 文字单元 配置
 * @typedef {Rectangle~RectangleConfigs} Text~TextConfigs
 * @property {String} fontFamily    - 字体
 * @property {Number} fontSize      - 字号
 * @property {String} content       - 内容
 * @property {String} textColor     - 字体颜色
 * @property {TEXT_ALIGN} textAlign     - 文字对齐方式
 * @property {String} backgroundColor     - 背景颜色
 * @property {number} lineHeight    - 行高
 * @property {number} indent        - 缩进
 * @property {Boolean} editable      - 是否可编辑
 * @property {number} minWidth      - 最小宽度
 */
/**
 * 文字对象
 * @description 可以绘制文字
 * @constructor Text
 * @extends Rectangle
 * @param {Text~TextConfigs} configs - 配置
 */
class Text extends Rectangle {
    constructor(configs) {
        super(configs);
        this.type =             'Text';
        /** @member {String}      - 内容 */
        this.content =          configs.content || '';
        /** @member {String}      - 字体 */
        this.fontFamily =       configs.fontFamily || '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji'
        /** @member {String}      - 字号 */
        this.fontSize =         configs.fontSize || '28px';
        /** @member {String}      - 字体颜色 */
        this.textColor =        configs.textColor || 'white';
        /** @member {String}      - 文字对齐方式 */
        this.textAlign =        configs.textAlign || TEXT_ALIGN.CENTER;
        /** @member {String}      - 文字基线方式 */
        this.textBaseline =     configs.textBaseline || 'middle';
        /** @member {Number}      - 行高 */
        this.lineHeight =       configs.lineHeight ;
        /** @member {Number}      - 缩进 */
        this.indent =           configs.indent || 0;
        this.backgroundColor =  configs.backgroundColor;
        /** @member {Boolean}      - 是否可编辑 */
        this.editable =         configs.editable;
        this.acceptPatten =     configs.acceptPatten;
        /** @member {number}      - 最小宽度 */
        this.minWidth =         configs.minWidth || 0;
        // this.editStatus = {
        //     editting: false,
        // }
        requestCacheCanvas((ctx) => {
            this.renderShadowText(ctx);
        });
        this._makeEditable();
    }

    /**
     * 编辑态
     */
    _makeEditable() {
        if(this.editable) {
            this.addEventListener('click', (event) => {
                let x;
                const hw = this.width / 2;
                if(this.textAlign === TEXT_ALIGN.LEFT){
                    x = this.anchor[0] - hw + this.indent / 2;
                } else if(this.textAlign === TEXT_ALIGN.RIGHT) {
                    x = this.anchor[0] + hw;
                } else {
                    x = this.anchor[0] + this.indent / 2;
                }
                const p = [ x, -this.height/2 ];
                const fontSize = +/(\d+)/.exec(this.fontSize)[1];
                const [offsetX, offsetY] = this.calculateToRealWorld(p);
                let inputElement = createInputElement();
                const wrapper = this._jflow.DOMwrapper;
                const oldVal = this.content;
                inputElement.style.transform =`translate(${offsetX}px, ${offsetY}px)`;
                inputElement.style.width = this.calculateToRealWorldWithScalar(this.width) + 'px';
                inputElement.style.height = this.calculateToRealWorldWithScalar(this.height) + 'px';
                inputElement.style.fontFamily = this.fontFamily;
                wrapper.style.fontSize = `${fontSize * this._jflow.scale}px`;
                inputElement.style.fontSize = `${fontSize * this._jflow.scale}px`;
                inputElement.style.lineHeight = `${this.lineHeight * this._jflow.scale}px`;
                inputElement.style.textIndent = `${this.indent * this._jflow.scale}px`;
                inputElement.value = this.content;
                inputElement.style.color = this.textColor;
                inputElement.addEventListener("focus",  () => {
                    this.content = '';
                    this._jflow._render();
                    inputElement.style.outline = "none";
                });
                let blurHandler = () => {
                    if(this.acceptPatten){

                    } else {
                        const val = inputElement.value;
                        /**
                         * 文字改变事件
                         * @event Text#change
                         * @type {object}
                         * @property {Text} target           - 当前文字对象
                         * @property {String} oldVal         - 原始文字
                         * @property {String} val            - 当前文字
                         */
                        this.dispatchEvent(new JFlowEvent('change', {
                            target: this,
                            oldVal,
                            val,
                        }))
                        this.content = oldVal;
                        this._jflow._render();
                        this._jflow.removeEventListener('zoompan', blurHandler)
                        inputElement.removeEventListener('blur', blurHandler)
                        wrapper.removeChild(inputElement);
                        inputElement = null;
                        blurHandler = null;
                    }
                };
                this._jflow.addEventListener('zoompan', blurHandler);
                inputElement.addEventListener('blur', blurHandler);
                const keyUpHandler = (e) => {
                    if (e.key === 'Enter' || e.keyCode === 13) {
                        e.preventDefault();
                        inputElement.removeEventListener('keypress', keyUpHandler)
                        blurHandler();
                    }
                };
                inputElement.addEventListener('keypress', keyUpHandler)
                wrapper.append(inputElement);
                inputElement.focus();
            })
        }
    }

    renderShadowText(ctx) {
        ctx.beginPath();
        ctx.font = `${this.fontSize} ${this.fontFamily}`;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;
        ctx.fillStyle = this.textColor;
        const {
            actualBoundingBoxLeft,
            actualBoundingBoxRight,
            fontBoundingBoxAscent,
            fontBoundingBoxDescent
        } = ctx.measureText(this.content);
        this._textWidth = this.indent + Math.abs(actualBoundingBoxLeft) + Math.abs(actualBoundingBoxRight);

        this.width = Math.max(this.minWidth, this._textWidth);
        const height = Math.abs(fontBoundingBoxAscent) + Math.abs(fontBoundingBoxDescent);
        if(this.lineHeight) {
            this.height = this.lineHeight;
        } else {
            this.height = height;
        }

    }

    setConfig(configs) {
        Object.keys(configs).forEach(k => {
            if(configs[k] !== undefined && configs[k] !== null) {
                this[k] = configs[k];
                this._rawConfigs[k] = configs[k];
            }
        });
        requestCacheCanvas((ctx) => {
            this.renderShadowText(ctx);
        });
    }

    render(ctx) {
        ctx.save();
        if(this._isMoving){
            ctx.globalAlpha = 0.6
        }
        // this.renderShadowText(ctx);


        // const {
        //     borderRadius: radius, anchor, width, height
        // } = this;
        // if(this.backgroundColor || this.borderColor){
        //     ctx.save();
        //     ctx.beginPath();
        //     if(this.borderRadius) {
        //         const x = this.anchor[0] - this.width / 2;
        //         const y = this.anchor[1] - this.height / 2;
        //         ctx.moveTo(x + radius, y);
        //         ctx.lineTo(x + width - radius, y);
        //         ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        //         ctx.lineTo(x + width, y + height - radius);
        //         ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        //         ctx.lineTo(x + radius, y + height);
        //         ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        //         ctx.lineTo(x, y + radius);
        //         ctx.quadraticCurveTo(x, y, x + radius, y);
        //         ctx.closePath();
        //     } else {
        //         ctx.rect(this.anchor[0] - this.width / 2, this.anchor[1] - this.height / 2, this.width, this.height);
        //     }
        //     if (this.backgroundColor){
        //         ctx.fillStyle = this.backgroundColor;
        //         ctx.fill();
        //     }
        //     if(this.borderColor) {
        //         ctx.strokeStyle = this.borderColor;
        //         ctx.stroke();
        //     }
        //     ctx.restore();
        // }

        ctx.beginPath();
        ctx.font = `${this.fontSize} ${this.fontFamily}`;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;
        ctx.fillStyle = this.textColor;
        if(this.textAlign === TEXT_ALIGN.LEFT){
            const hw = this.width / 2;
            ctx.fillText(this.content, this.anchor[0] - hw + this.indent / 2, this.anchor[1]);
        } else if(this.textAlign === TEXT_ALIGN.RIGHT) {
            const hw = this.width / 2;
            ctx.fillText(this.content, this.anchor[0] + hw, this.anchor[1]);
        } else {
            ctx.fillText(this.content, this.anchor[0] + this.indent / 2, this.anchor[1]);
        }
        // ctx.rect(this.anchor[0] - this.width / 2, this.anchor[1] - this.height / 2, this.width, this.height);
        // ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fill();
        ctx.restore();
    }
}

export default Text;