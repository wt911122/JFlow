import Node from '../node';
import { DIRECTION, oppositeDirection } from '../../utils/constance';
// import { makeBezierPoints } from '../../utils/functions';
/**
 * 钻石形单元 配置
 * @typedef {Node~Configs} Diamond~DiamondConfigs
 * @property {number} width  - 内部矩形宽
 * @property {number} height - 内部矩形高
 * @property {number} side   - 两侧三角形的宽
 */
/**
 * 钻石形单元
 * @constructor Diamond
 * @param {Diamond~DiamondConfigs} configs - 配置
 * @extends Node
 */

class Diamond extends Node {

    constructor(configs = {}) {
        super(configs);
        this.type =             'Diamond';
        /** @member {Number}      - 内部矩形宽 */
        this.width =            configs.width || 20;
        /** @member {Number}      - 内部矩形高 */
        this.height =           configs.height || 10;
        /** @member {Number}      - 两侧三角形的宽 */
        this.side =             configs.side || 6;
        this._doCache();
    }

    setConfig(configs) {
        Object.keys(configs).forEach(k => {
            if(configs[k] !== undefined && configs[k] !== null) {
                this[k] = configs[k];
                this._rawConfigs[k] = configs[k];
            }
        });
        this._doCache();
    }

    _doCache() {
        this.sinSIDE = Math.sin(Math.PI/3) * this.side;
        this.cosSIDE = Math.cos(Math.PI/3) * this.side;
    }

    render(ctx) {
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

        this._cachePoints = [
            [rightCenter, top],
            [right, y],
            [rightCenter, bottom],
            [leftCenter, bottom],
            [left, y],
            [leftCenter, top]
        ];

        ctx.save();
        if(this._isMoving){
            ctx.globalAlpha = 0.6
        }
        ctx.beginPath();
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

        // if(this._isTargeting) {
        //     this.renderFocus(ctx);
        // }
        // ctx.fillStyle = 'rgba(0,0,0,0.3)';
        // ctx.fillRect(x-hw, y-hh, this.width, this.height)

        ctx.restore();


    }

    isHit(point) {
        if(!this._cachePoints) return false;
        const polygon = this._cachePoints;
        let odd = false;
        // For each edge (In this case for each point of the polygon and the previous one)
        for (let i = 0, j = polygon.length - 1; i < polygon.length; i++) {
            // If a line from the point into infinity crosses this edge
            if (((polygon[i][1] > point[1]) !== (polygon[j][1] > point[1])) // One point needs to be above, one below our y coordinate
                // ...and the edge doesn't cross our Y corrdinate before our x coordinate (but between our x coordinate and infinity)
                && (point[0] < ((polygon[j][0] - polygon[i][0]) * (point[1] - polygon[i][1]) / (polygon[j][1] - polygon[i][1]) + polygon[i][0]))) {
                // Invert odd
                odd = !odd;
            }
            j = i;

        }
        return odd;
    }

    getBoundingRect() {
        const anchor = this.anchor;
        const w = this.width /2;
        const h = this.height/2;
        const ltx = anchor[0] - w;
        const lty = anchor[1] - h;
        const rbx = anchor[0] + w;
        const rby = anchor[1] + h;
        const br = this._boundingrect;
        br[0] = ltx;
        br[1] = lty;
        br[2] = rbx;
        br[3] = rby;
        return br
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