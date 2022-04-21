import Node from '../node';
import { DIRECTION, oppositeDirection } from '../../utils/constance';
/**
 * 胶囊单元 配置
 * @typedef {Node~Configs} Capsule~CapsuleConfigs
 * @property {number} width  - 内部矩形宽
 * @property {number} height - 内部矩形高
 */
/**
 * 胶囊单元
 * @constructor Capsule
 * @extends Node
 * @param {Capsule~CapsuleConfigs} configs - 配置
 */
class Capsule extends Node {
    constructor(configs = {}) {
        super(configs);
        this.type =             'Capsule';
        /** @member {Number}      - 内部矩形宽 */
        this.width =            configs.width || 20;
        /** @member {Number}      - 内部矩形高 */
        this.height =           configs.height || 10;
    }

    render(ctx) {
        ctx.save();
        if(this._isMoving){
            ctx.globalAlpha = 0.6
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

        ctx.fillStyle = this.backgroundColor;
        if (this.shadowColor) {
            ctx.shadowColor = this.shadowColor;
            ctx.shadowBlur = this.shadowBlur;
            ctx.shadowOffsetX = this.shadowOffsetX;
            ctx.shadowOffsetY = this.shadowOffsetY;
        }
        ctx.fill();
        if(this.borderWidth) {
            ctx.lineWidth = this.borderWidth;
            ctx.strokeStyle = this.borderColor;
            ctx.stroke();
        }
        // ctx.fillStyle = 'rgba(0,0,0,0.3)';
        // ctx.fillRect(x-hw, y-hh, this.width, this.height)

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
            ltx, lty,
            rbx, rby,
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