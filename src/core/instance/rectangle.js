import Instance from './instance';
import { DIRECTION } from '../utils/constance';
class Rectangle extends Instance {
    constructor(configs = {}) {
        super(configs);
        this.type =             'Rectangle';
        this.width =            configs.width || 10;
        this.height =           configs.height || 10;
        this.borderRadius =     configs.borderRadius || 0;
    }

    render(ctx) {
        ctx.save();
        if(this._isMoving){
            ctx.globalAlpha = 0.5;
        }
        ctx.beginPath();
        const {
            borderRadius: radius, anchor, width, height
        } = this;
        if(this.borderRadius) {
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
        } else {
            ctx.rect(this.anchor[0] - this.width / 2, this.anchor[1] - this.height / 2, this.width, this.height);
        }
        ctx.fillStyle = this.color;
        ctx.fill();     
        if(this.borderWidth){
            if(this.status.hover) {
                ctx.strokeStyle = this.hoverStyle;
            } else {
                ctx.strokeStyle = this.borderColor;
            }
            ctx.stroke();
        }
        if(this.content) {
            ctx.font = this.font;
            ctx.textAlign = this.textAlign;
            ctx.textBaseline = this.textBaseline;
            ctx.fillStyle = this.textColor;
            ctx.fillText(this.content, this.anchor[0], this.anchor[1]);
        } 
       
        if(this._isTargeting) {
            this.renderFocus(ctx);
        }

        ctx.restore();
    }

    isHit(point) {
        const anchor = this.anchor;
        const w = this.width /2;
        const h = this.height/2;
        return point[0] > anchor[0] - w 
            && point[0] < anchor[0] + w 
            && point[1] > anchor[1] - h 
            && point[1] < anchor[1] + h;
    }

    getBoundingRect() {
        const anchor = this.anchor;
        const w = this.width /2;
        const h = this.height/2;
        const ltx = anchor[0] - w;
        const lty = anchor[1] - h;
        const rbx = anchor[0] + w;
        const rby = anchor[1] + h;
        return [
            [ltx, lty],
            [rbx, lty],
            [rbx, rby],
            [ltx, rby],
        ]
    }

    getBoundingDimension() {
        return {
            height: this.height,
            width: this.width,
        }
    }

    calculateIntersection(point) {
        const [x1, y1] = point;
        const [x2, y2] = this.anchor;
        const w = this.width/2;
        const h = this.height/2;
        const vecx = x2 - x1;
        const vecy = y2 - y1;
        const theta1 = h/w;
        const theta2 = Math.abs(vecy/vecx);
        const dirx = x1 > x2;
        const diry = y1 > y2;
        let x, y;
        if(theta2 < theta1) {
            x = x2 + (dirx?w:-w);
            y = w * (diry?theta2:-theta2) + y2;
        } else {
            y = y2 + (diry?h:-h);
            x = h / (dirx?theta2:-theta2) + x2;
        }
        return [x, y];
    }


    calculateIntersectionInFourDimension(point) {
        const [x1, y1] = point;
        const [x2, y2] = this.anchor;
        const w = this.width/2;
        const h = this.height/2;
        const vecx = x2 - x1;
        const vecy = y2 - y1;
        const theta1 = h/w;
        const theta2 = Math.abs(vecy/vecx);
        const dirx = x1 > x2;
        const diry = y1 > y2;
        if(theta2 > theta1) {
            return {
                p: [x2, diry?y2+h:y2-h],
                dir: diry ? DIRECTION.BOTTOM : DIRECTION.TOP,
            }
        } else {
            return {
                p: [dirx?x2+w:x2-w, y2],
                dir: dirx ? DIRECTION.RIGHT : DIRECTION.LEFT,
            }
        }
    }
}

export default Rectangle;