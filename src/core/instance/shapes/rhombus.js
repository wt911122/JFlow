import Node from '../node';
import { DIRECTION } from '../../utils/constance';
/**
 * 菱形单元 配置
 * @typedef {Node~Configs} Rhombus~RhombusConfigs
 * @property {number} diagonalsV  - 内十字高度
 * @property {number} diagonalsH  - 内十字宽度
 */
/**
 * 菱形单元
 * @constructor Rhombus
 * @param {Rhombus~RhombusConfigs} configs - 配置
 * @extends Node
 */
class Rhombus extends Node {
    constructor(configs = {}) {
        super(configs);
        this.type =             'Rhombus';
        /** @member {Number}      - 内十字高度 */
        this.height =           configs.diagonalsV || 10;
        /** @member {Number}      - 内十字宽度 */
        this.width =            configs.diagonalsH || 20;
    }

    render(ctx) {
        ctx.save();
        if(this._isMoving){
            ctx.globalAlpha = 0.6
        }
        const w = this.width / 2;
        const h = this.height / 2;
        const center = this.anchor;
        ctx.translate(center[0], center[1])
        ctx.beginPath();
        ctx.moveTo(0, -h);
        ctx.lineTo(w, 0);
        ctx.lineTo(0, h);
        ctx.lineTo(-w, 0);
        ctx.closePath();
        if(this.borderWidth) {
            ctx.lineWidth = this.borderWidth;
            ctx.strokeStyle = this.borderColor;
        }

        ctx.fillStyle = this.backgroundColor;
        ctx.fill();
        if(this.shadowColor) {
            ctx.shadowColor = this.shadowColor;
            const scale = this._jflow.scale;
            ctx.shadowBlur = this.shadowBlur * scale;
            ctx.shadowOffsetX = this.shadowOffsetX * scale;
            ctx.shadowOffsetY = this.shadowOffsetY * scale;
            let switchPath = new Path2D();
            switchPath.moveTo(0, -h);
            switchPath.lineTo(w, 0);
            switchPath.lineTo(0, h);
            switchPath.lineTo(-w, 0);
            switchPath.closePath();
            switchPath.rect(-w - 10,  -h - 10, this.width + 20, this.height+ 20);
            // switchPath.moveTo(x, y-h);
            // switchPath.lineTo(x + w, y);
            // switchPath.lineTo(x, y + h);
            // switchPath.lineTo(x-w, y);
            // switchPath.closePath();
            // switchPath.rect(x - w - 10, y - h - 10, this.width+ 20, this.height+ 20);
            ctx.clip(switchPath, "evenodd");
            ctx.stroke();
        } else if (this.borderWidth) {
            ctx.stroke();
        }
       
        ctx.translate(-center[0], -center[1])
        ctx.restore();
    }

    isHit(point) {
        const v = this.height / 2;
        const h = this.width / 2;
        const anchor = this.anchor;
        const x = Math.abs(point[0] - anchor[0]);
        const y = Math.abs(point[1] - anchor[1]);
        return (x / h + y / v) <= 1;
    }

    getBoundingRect() {
        const anchor = this.anchor;
        const w = this.width /2;
        const h = this.height /2;
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
            [DIRECTION.SELF]:   [x2+w*0.618, y2+h*0.618]
        }
    }
}

export default Rhombus;
