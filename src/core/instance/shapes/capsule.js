import Node from '../node';
import { DIRECTION, oppositeDirection } from '../../utils/constance';
/**
 * 胶囊单元
 * @extends Node
 */
class Capsule extends Node {
    /**
     * 创建胶囊节点.
     * @param {Configs} configs - 配置
     * @param {number} configs.width - 宽
     * @param {number} configs.height - 高
     */
    constructor(configs = {}) {
        super(configs);
        this.type =             'Capsule';
        this.width =            configs.width || 20;
        this.height =           configs.height || 10;
    }

    render(ctx) {
        ctx.save();
        if(this._isMoving){
            ctx.globalAlpha = 0.5;
        }
        ctx.beginPath();
        const [x, y] = this.anchor;
        const hw = this.width/2;
        const hh = this.height/2;
        const leftCenter = x - hw + hh;
        const rightCenter = x + hw - hh;
        const top = y - hh;
        const bottom = y + hh;

        ctx.moveTo(leftCenter, top);
        ctx.lineTo(rightCenter, top);
        ctx.arc(rightCenter, y, hh, -Math.PI/2, Math.PI/2);
        ctx.lineTo(leftCenter, bottom);
        ctx.arc(leftCenter, y, hh, Math.PI/2, Math.PI/2*3);

        ctx.fillStyle = this.color;
        ctx.fill();     
        if(this.borderWidth && this.borderColor){
            ctx.lineWidth = this.borderWidth;
            ctx.strokeStyle = this.borderColor;
            ctx.stroke();
        }
       
        // if(this._isTargeting) {
        //     this.renderFocus(ctx);
        // }

        ctx.restore();
    }

    isHit(point) {
        const anchor = this.anchor;
        const hw = this.width/2;
        const hh = this.height/2;
        const ww =  Math.abs(hw - hh);
        const leftCenter = anchor[0] - hw + hh;
        const rightCenter = anchor[0] + hw - hh;
        const rr = hh * hh;
        return (point[0] > anchor[0] - ww 
            && point[0] < anchor[0] + ww 
            && point[1] > anchor[1] - hh 
            && point[1] < anchor[1] + hh) 
            || ( Math.pow(point[0] - leftCenter, 2) + Math.pow(point[1] - anchor[1], 2) < rr)
            || ( Math.pow(point[0] - rightCenter, 2) + Math.pow(point[1] - anchor[1], 2) < rr)
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

    getIntersectionsInFourDimension() {
        let p2 = this.anchor;
        if(this._belongs && this._belongs.calculateToCoordination) {
            p2 = this._belongs.calculateToCoordination(p2);
        }
        
        const [x2, y2] = p2;
        const w = this.width/2;
        const h = this.height/2;
        return {
            [DIRECTION.RIGHT]:  [x2+w, y2],
            [DIRECTION.LEFT]:   [x2-w, y2],
            [DIRECTION.BOTTOM]: [x2, y2+h],
            [DIRECTION.TOP]:    [x2, y2-h],
        }
    }
}

export default Capsule;