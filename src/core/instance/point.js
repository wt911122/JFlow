import Instance from './instance';
import { DIRECTION } from '../utils/constance';

class Point extends Instance {
    constructor(configs) {
        super(configs);
        this.type =             'Point';
        this.radius =           configs.radius || 10;
        this.radiusExpo2 =      this.radius * this.radius;
    }

    render(ctx) {
        ctx.save();
        if(this._isMoving){
            ctx.globalAlpha = 0.5;
        }
        ctx.beginPath();
        ctx.arc(this.anchor[0], this.anchor[1], this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();   
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
        return Math.pow(point[0] - anchor[0], 2) + Math.pow(point[1] - anchor[1], 2) < this.radiusExpo2
    }

    getBoundingRect() {
        const anchor = this.anchor;
        const r = this.radius;
        const ltx = anchor[0] - r;
        const lty = anchor[1] - r;
        const rbx = anchor[0] + r;
        const rby = anchor[1] + r;
        return [
            [ltx, lty],
            [rbx, lty],
            [rbx, rby],
            [ltx, rby],
        ]
    }

    calculateIntersection(point) {
        const [x1, y1] = point;
        const [x2, y2] = this.anchor;
        const vecx = x2 - x1;
        const vecy = y2 - y1;
        const dist = Math.sqrt(vecx * vecx + vecy * vecy);

        const ratio = this.radius / dist;
        return [x2 - ratio * vecx, y2 - ratio * vecy];
    }

    calculateIntersectionInFourDimension(point) {
        const [x1, y1] = point;
        const [x2, y2] = this.anchor;
        const r = this.radius;
        const vecx = x2 - x1;
        const vecy = y2 - y1;
        // console.log(Math.abs(vecx) > Math.abs(vecy), vecx, r)
        if(Math.abs(vecx) > Math.abs(vecy)) {
            return {
                p: [x2 + (vecx<0?r:-r), y2],
                dir: vecx<0 ? DIRECTION.RIGHT : DIRECTION.LEFT,
            }
        } else {
            return {
                p: [x2, y2+(vecy<0?r:-r)],
                dir: vecy<0 ? DIRECTION.BOTTOM : DIRECTION.TOP,
            }
        }
    }

    getBoundingDimension() {
        return {
            width: this.radius * 2,
            height: this.radius * 2,
        }
    }
    
}

export default Point;