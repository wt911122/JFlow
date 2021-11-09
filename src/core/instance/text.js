import Rectangle from './rectangle';
import { DIRECTION } from '../utils/constance';
import { requestCacheCanvas } from '../utils/canvas';
class Text extends Rectangle {
    constructor(configs) {
        super(configs);
        this.type =             'Text';
        this.lineHeight =       configs.lineHeight ;
        this.indent =           configs.indent || 0;
        requestCacheCanvas((ctx) => {
            this.renderShadowText(ctx);
        })
    }

    renderShadowText(ctx) {
        ctx.beginPath();
        ctx.font = this.font;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;
        ctx.fillStyle = this.textColor;
        const { 
            actualBoundingBoxLeft,
            actualBoundingBoxRight,
            fontBoundingBoxAscent,
            fontBoundingBoxDescent
        } = ctx.measureText(this.content);
        
        this.width = actualBoundingBoxLeft + actualBoundingBoxRight;
        const height = fontBoundingBoxAscent + fontBoundingBoxDescent;
        if(this.lineHeight) {
            this.height = this.lineHeight;
        } else {
            this.height = height;
        }
    }

    render(ctx) {
        ctx.save();
        if(this._isMoving){
            ctx.globalAlpha = 0.5;
        }
        this.renderShadowText(ctx);
        

        // ctx.rect(this.anchor[0] - this.width / 2, this.anchor[1] - this.height / 2, this.width, this.height);
        // ctx.fillStyle = this.color;
        // ctx.fill();     
        ctx.fillText(this.content, this.anchor[0] + this.indent, this.anchor[1]);
        ctx.restore();
    }
}

export default Text;