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
 * 文字对象
 * @description 可以绘制文字
 * @extends Rectangle
 */
class Text extends Rectangle {
    /**
     * 创建一个文本对象
     * @param {Configs} configs - 配置
     * @param {number} configs.lineHeight   - 行高
     * @param {number} configs.indent   - 缩进
     * @param {number} configs.editable   - 是否可编辑
     **/
    constructor(configs) {
        super(configs);
        this.type =             'Text';
        this.content =          configs.content || '';
        this.fontFamily =       configs.fontFamily = '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji'
        this.fontSize =         configs.fontSize || '28px';
        this.textColor =        configs.textColor || 'white';
        this.textAlign =        configs.textAlign || 'center';
        this.textBaseline =     configs.textBaseline || 'middle';
        this.lineHeight =       configs.lineHeight ;
        this.indent =           configs.indent || 0;
        this.backgroundColor =  configs.backgroundColor;
        this.editable =         configs.editable;
        this.acceptPatten =     configs.acceptPatten;
        this.minWidth =         configs.minWidth || 0;
        this.editStatus = {
            editting: false,
        }
        requestCacheCanvas((ctx) => {
            this.renderShadowText(ctx);
        });
        this._makeEditable();
    }


    _makeEditable() {
        if(this.editable) {
            this.addEventListener('click', (event) => {
                let x;
                const hw = this.width / 2;
                if(this.textAlign === 'left'){
                    x = this.anchor[0] - hw + this.indent / 2;
                } else if(this.textAlign === 'right') {
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
                        this.dispatchEvent(new JFlowEvent('change', {
                            target: this,
                            oldVal,
                            val,
                        }))
                        this.content = oldVal;
                        inputElement.removeEventListener('blur', blurHandler)
                        wrapper.removeChild(inputElement);
                        inputElement = null;
                        blurHandler = null;
                    }
                };
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
            ctx.globalAlpha = 0.5;
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
        if(this.textAlign === 'left'){
            const hw = this.width / 2;
            ctx.fillText(this.content, this.anchor[0] - hw + this.indent / 2, this.anchor[1]);
        } else if(this.textAlign === 'right') {
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