import Rectangle from './shapes/rectangle';
import { DIRECTION } from '../utils/constance';
import { requestCacheCanvas } from '../utils/canvas';
import JFlowEvent from '../events';
function createInputElement() {
    const input = document.createElement('span');
    input.setAttribute('contenteditable', true);
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
 * @property {string} placeholder   - 占位文字
 * @property {Boolean} emptyWhenInput - 输入状态时是否清空input框
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
        /** @member {String}      - 字体 */
        this.fontWeight =       configs.fontWeight || '';
        /** @member {String}      - 字体颜色 */
        this.textColor =        configs.textColor || 'white';
        this.placeholderColor = configs.placeholderColor ||  configs.textColor || 'white';
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
        // this.acceptPatten =     configs.acceptPatten;
        /** @member {number}      - 最小宽度 */
        this.minWidth =         configs.minWidth || 0;
        this.maxWidth =         configs.maxWidth;
        this.ellipsis =         configs.ellipsis;

        this.placeholder =          configs.placeholder || '';
        this.emptyWhenInput =       configs.emptyWhenInput || false;
        this.editting =  false;
        this.disabled =        configs.disabled;
        this.textBuffer = document.createElement('canvas');
        requestCacheCanvas((ctx) => {
            this.renderShadowText(ctx);
            this.cacheText();
        });
        this._makeEditable();
    }

    get currentContent() {
        return this.content || this.placeholder;
    }

    get isEmpty() {
        return !this.content;
    }

    cacheText() {
        const scale = 4;
        const textBuffer = this.textBuffer;
        const { fontSize:fs, fontFamily, fontWeight } = this;
        let content = this.currentContent;
        if(this.ellipsisContent) {
            content = this.ellipsisContent;
        }
        if(!content) {
            this.cacheTextBounding = null;
            return;
        }
        const fontSize = parseInt(fs);
        const w = this._textWidth * scale;
        const h = fontSize * scale;
        textBuffer.width = w;
        textBuffer.height = h
        const ctx = textBuffer.getContext('2d');
        ctx.clearRect(-1000, -1000, 10000, 10000);
        ctx.fillStyle = this.textColor;
        ctx.font = `${fontWeight} ${h}px ${fontFamily}`;
        ctx.textBaseline = 'middle';
        ctx.fillText(content, 0, h/2);
        this.cacheTextBounding = [0, 0, w, h];
    }
    _renderCache(ctx) {
        if(!this.cacheTextBounding) {
            return;
        }
        const [a, b, c, d] = this.cacheTextBounding;
        const w = this._textWidth;
        const h = parseInt(this.fontSize);
        if(this.textAlign === TEXT_ALIGN.LEFT){
            const hw = this.width / 2;
            ctx.drawImage(this.textBuffer, 
                a, b, c, d,
                this.anchor[0] - hw + this.indent / 2, this.anchor[1] - h/2, w, h);
        } else if(this.textAlign === TEXT_ALIGN.RIGHT) {
            const hw = this.width / 2;
            const tx = this._textWidth;
            ctx.drawImage(this.textBuffer, 
                a, b, c, d,
                this.anchor[0] + hw - tx, this.anchor[1] - h/2, w, h);
        } else {
            const tx = this._textWidth / 2;
            ctx.drawImage(this.textBuffer, 
                a, b, c, d,
                this.anchor[0] - tx + this.indent / 2, this.anchor[1] - h/2, w, h);
        }
        
    }

    /**
     * 编辑态
     */
    _makeEditable() {
        if(this.editable) {
            this.addEventListener('click', (event) => {
                event.detail.bubbles = false;
                this.click();
            })
        }
    }

    click() {
        if(this.disabled || !this.editable) {
            return;
        }
       
        const _height = this.height * 1.15;
        const size = this.calculateToRealWorldWithScalar(_height);
        const fontSize = +/(\d+)/.exec(this.fontSize)[1];

        const calcuPos = () => {
            let x;
            const hw = this.width / 2;
            if(this.textAlign === TEXT_ALIGN.LEFT){
                x = this.anchor[0] - hw + this.indent / 2;
            } else if(this.textAlign === TEXT_ALIGN.RIGHT) {
                x = this.anchor[0] + hw;
            } else {
                x = this.anchor[0] + this.indent / 2;
            }

            const p = [ x, -_height/2 ];

            return this.calculateToRealWorld(p)
        }
        const [offsetX, offsetY] = calcuPos();
        let inputElement = createInputElement();
        const jflow = this._jflow;
        const wrapper = jflow.DOMwrapper;
        let oldVal = this.content;
        let textColor = this.textColor;
        inputElement.style.margin = 0;
        inputElement.style.padding = 0;
        inputElement.style.transform =`translate(${offsetX}px, ${offsetY}px)`;
        
        // inputElement.style.width = this.calculateToRealWorldWithScalar(this.width) + 'px';
        inputElement.style.height =  size+ 'px';
        inputElement.style.fontFamily = this.fontFamily;
        wrapper.style.fontSize = `${fontSize * jflow.scale}px`;
        inputElement.style.letterSpacing = jflow.scale;
        inputElement.style.fontSize = `${fontSize * jflow.scale}px`;
        inputElement.style.lineHeight = `${this.lineHeight * jflow.scale}px`;
        inputElement.style.textIndent = `${this.indent * jflow.scale}px`;
        inputElement.innerText = this.emptyWhenInput ? '' : this.content;
        inputElement.style.color = this.textColor;
        inputElement.style.whiteSpace = 'nowrap';
        inputElement.style.outline = "none";
        inputElement.style.paddingRight = '1em';
        inputElement.style.letterSpacing = `${(1.414 + 0.181) / (1 + Math.pow(jflow.scale / 1.81, -3.56) ) - 0.181}px`;
        inputElement.setAttribute('placeholder', this.placeholder);

        // inputElement.addEventListener("focus",  (e) => {
        //     // e.preventDefault();
        //     // this.content = '';
            
            
        // });
        let blurHandler = () => {
            this.editting = false;
            this.dispatchEvent(new JFlowEvent('blur', {
                target: this,
            }))
            const val = inputElement.innerText;
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
            this.textColor = textColor;
            // this.content = oldVal;
            jflow._render();
            jflow.removeEventListener('zoompan', blurHandler)
            inputElement.removeEventListener('blur', blurHandler)
            inputElement.removeEventListener('keypress', keyUpHandler)
            wrapper.removeChild(inputElement);
            inputElement = null;
            blurHandler = null;
            this.inputElement = null;
        };
        jflow.addEventListener('zoompan', blurHandler);
        // inputElement.addEventListener('blur', blurHandler);
        const keyUpHandler = (e) => {
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault();
                let defaultAct = true;
                this.dispatchEvent(new JFlowEvent('enterkeypressed', {
                    target: this,
                    handler: (val) => {
                        defaultAct = val;
                    },
                }))
                if(defaultAct){
                    inputElement.removeEventListener('keypress', keyUpHandler)
                    blurHandler();
                }
            }
        };
        inputElement.addEventListener('keypress', keyUpHandler)
        inputElement.addEventListener('input', (e) => {
            let changed = false;
            this.dispatchEvent(new JFlowEvent('input', {
                target: this,
                oldVal,
                val: inputElement.innerText,
                handler(val) {
                    oldVal = val;
                    inputElement.innerText = val;
                    changed = true;
                }
            }))
            requestCacheCanvas((ctx) => {
                this.content = inputElement.innerText;
                this.renderShadowText(ctx);
            });
            if(this._belongs.recalculateUp) {
                this._belongs.recalculateUp()
            }
            const [offsetX, offsetY] = calcuPos();
            inputElement.style.transform =`translate(${offsetX}px, ${offsetY}px)`;
            
            this._jflow.scheduleRender();
            // inputElement.style.width = e.target.value.length + "em";
            if(!changed) {
                oldVal = inputElement.innerText;
            }
        })
        this.textColor = 'transparent'
        this.editting = true;
        jflow._render();
        wrapper.append(inputElement);
        inputElement.focus({
            preventScroll: true
        });
        const range = document.createRange()
        const sel = window.getSelection()
        
        range.setStart(inputElement.firstChild, inputElement.innerText.length)
        range.collapse(true)
        
        sel.removeAllRanges()
        sel.addRange(range)
        this.inputElement = inputElement;
    }

    renderShadowText(ctx) {
        ctx.beginPath();
        ctx.font = `${this.fontSize} ${this.fontFamily}`;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;
        ctx.fillStyle = this.textColor;
        const t_h = parseInt(this.fontSize);
        const content = this.currentContent;
        const {
            // actualBoundingBoxLeft,
            // actualBoundingBoxRight,
            fontBoundingBoxAscent,
            fontBoundingBoxDescent,
            width,
        } = ctx.measureText(content);
        this._textWidth = this.indent + width;
        if(this.maxWidth && this.ellipsis) {
            if(this._textWidth > this.maxWidth) {
                const ratio =this.maxWidth / this._textWidth;
                const l = Math.floor(content.length * ratio - 3);
                this.ellipsisContent = content.substring(0, l) + '...'; 
            }  else {
                this.ellipsisContent = content;
            }
            this.width = this.maxWidth;
        } else{ 
            this.width = Math.max(this.minWidth, this._textWidth);
        }
        
        const height = (Math.abs(fontBoundingBoxAscent) + Math.abs(fontBoundingBoxDescent)) || t_h;
        if(this.lineHeight) {
            this.height = this.lineHeight;
        } else {
            this.height = height;
        }

    }

    setConfig(configs) {
        Object.keys(configs).forEach(k => {
            if(configs[k] !== undefined && configs[k] !== null) {
                // if(this.editting && k === 'content') {
                //     return;
                // }
                this[k] = configs[k];
                this._rawConfigs[k] = configs[k];
            }
        });
        requestCacheCanvas((ctx) => {
            this.renderShadowText(ctx);
            this.cacheText();
        });
    }

    render(ctx) {
        if(this._isMoving){
            ctx.globalAlpha = 0.6
        }
        if(this.editting) {
            return;
        }
        if(this._jflow.scale * parseInt(this.fontSize) < 8) {
            this._renderCache(ctx);
            return;
        }
        ctx.beginPath();
        
        ctx.font = `${this.fontWeight} ${this.fontSize} ${this.fontFamily}`;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;
        ctx.fillStyle = this.isEmpty ? this.placeholderColor : this.textColor;
        let content = this.currentContent;
        if(this.ellipsisContent) {
            content = this.ellipsisContent;
        }
        if(content) {
            if(this.textAlign === TEXT_ALIGN.LEFT){
                const hw = this.width / 2;
                ctx.fillText(content, this.anchor[0] - hw + this.indent / 2, this.anchor[1]);
            } else if(this.textAlign === TEXT_ALIGN.RIGHT) {
                const hw = this.width / 2;
                ctx.fillText(content, this.anchor[0] + hw, this.anchor[1]);
            } else {
                ctx.fillText(content, this.anchor[0] + this.indent / 2, this.anchor[1]);
            }
        }
    }
}

export default Text;