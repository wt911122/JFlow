import { Rectangle } from '@joskii/jflow';

class Variable extends Rectangle{
    constructor(configs) {
        super(configs);
        this.padding = 8;
        this.width = 200;
        this.height = 36;
        this.borderRadius = 4;
        this.borderColor = 'rgb(0, 85, 204)';
        this.color = '#c2dbff';
        this.textColor = '#212123';
        this.textAlign = 'left';
        this.font = '12px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji';
    }

    render(ctx) {
        ctx.beginPath();
        const {
            borderRadius: radius, anchor, width, height
        } = this;
        const x = this.anchor[0] - this.width / 2;
        const y = this.anchor[1] - this.height / 2;
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
       
        ctx.fillStyle = this.color;
        ctx.fill();      
        ctx.strokeStyle = this.borderColor;
        ctx.stroke();
        ctx.translate(x, y + height /2);
        ctx.font = this.font;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;
        ctx.fillStyle = this.textColor;
        const left = this.padding
        ctx.fillText(this.content, left, 0);
        ctx.translate(-x, -y - height/2);
        if(this._isTargeting) {
            this.renderFocus(ctx);
        }
        
    }
}

export default Variable;