import Node from '../node';
import { DIRECTION, oppositeDirection } from '../../utils/constance';
import { makeBezierPoints } from '../../utils/functions';
/**
 * 菱形单元
 * @extends Node
 */
class Diamond extends Node {
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
        this.side =             configs.side || 6;
        this._cacheSide();
    }

    setConfig(configs) {
        Object.keys(configs).forEach(k => {
            if(configs[k] !== undefined && configs[k] !== null) {
                this[k] = configs[k];
                this._rawConfigs[k] = configs[k];
            }
        });
        this._cacheSide();
    }

    _cacheSide() {
        this.sinSIDE = Math.sin(Math.PI/3) * this.side;
        this.cosSIDE = Math.cos(Math.PI/3) * this.side;
        // console.log(this.sinSIDE, this.cosSIDE);
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
        const xx = hh / 1.732
        const leftCenter = x - hw + xx;
        const rightCenter = x + hw - xx;
        const right = x + hw;
        const left = x - hw;
        const top = y - hh;
        const bottom = y + hh;
        // const angle = Math.PI / 6;
        // const radius = 6;
        const {
            side, sinSIDE, cosSIDE
        } = this;
        ctx.moveTo(x, top);
        ctx.lineTo(rightCenter - side, top);
        ctx.quadraticCurveTo(rightCenter, top, rightCenter + cosSIDE, top + sinSIDE);
        ctx.lineTo(right - cosSIDE, y - sinSIDE);
        ctx.quadraticCurveTo(right, y, right - cosSIDE, y + sinSIDE);
        ctx.lineTo(rightCenter + cosSIDE, bottom - sinSIDE);
        ctx.quadraticCurveTo(rightCenter, bottom, rightCenter - side, bottom);

        ctx.lineTo(leftCenter + side, bottom);
        ctx.quadraticCurveTo(leftCenter, bottom, leftCenter - cosSIDE, bottom - sinSIDE);
        ctx.lineTo(left + cosSIDE, y + sinSIDE);
        ctx.quadraticCurveTo(left, y, left + cosSIDE, y - sinSIDE);
        ctx.lineTo(leftCenter - cosSIDE, top + sinSIDE);
        ctx.quadraticCurveTo(leftCenter, top, leftCenter + side, top);
        
        ctx.closePath();

        ctx.fillStyle = this.backgroundColor;
        ctx.fill();     
        if(this.borderWidth) {
            ctx.lineWidth = this.borderWidth;
            ctx.strokeStyle = this.borderColor;
            ctx.stroke();
        }
       
        // if(this._isTargeting) {
        //     this.renderFocus(ctx);
        // }
        // ctx.fillStyle = 'rgba(0,0,0,0.3)';
        // ctx.fillRect(x-hw, y-hh, this.width, this.height)

        ctx.restore();

        this._cachePoints = [
            [rightCenter, top],
            [right, y],
            [rightCenter, bottom],
            [leftCenter, bottom],
            [left, y],
            [leftCenter, top]
        ];
    }

    isHit(point) {
        const points = this._cachePoints;
        const [x, y] = point;
        let inside = false;
        var len = points.length/2;
        for (var i = 0, j = len - 1; i < len; j = i++) {
            var xi = points[i*2+0], yi = points[i*2+1];
            var xj = points[j*2+0], yj = points[j*2+1];
            var intersect = ((yi > y) !== (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
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

export default Diamond;