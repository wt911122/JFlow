import BaseLink from './base-link';
import { polylinePoints, distToSegmentSquared, makeRadiusFromVector, minIntersectionBetweenNodes } from '../utils/functions';
import { APPROXIMATE, DIRECTION } from '../utils/constance';
// import { dist2, bezierPoint } from '../utils/functions';
const PIINRATIO = Math.PI / 180
/**
 * @typedef {BaseLink~Configs} PolyLink~Configs
 * @property {Number} approximate   - 点击响应范围
 * @property {Number} radius        - 拐角弧度
 * @property {Number} minSpanX      - 起点终点在 x 方向最小的跨度
 * @property {Number} minSpanY      - 起点终点在 y 方向最小的跨度
 * @property {number[]} lineDash    - 虚线数组
 * @property {Boolean} doubleLink   - 双向箭头
 * @property {String} fontFamily    - 连线上的文字字体
 * @property {Number} fontSize      - 连线上的文字大小
 * @property {String} content       - 连线上的文字
 * @property {String} isSelf        - 是否为自连接
 */
/**
 * 方形折线
 * @constructor PolyLink
 * @extends BaseLink
 * @param {PolyLink~Configs} configs - 配置
 */
class PolyLink extends BaseLink {
     /**
     * 创建方形折线
     * @param {PolyLink~Configs} configs - 配置
     **/
    constructor(configs) {
        super(configs);
        this.approximate   = configs.approximate || APPROXIMATE;
        this.radius        = configs.radius || 0;
        this.minSpanX      = configs.minSpanX || 10;
        this.minSpanY      = configs.minSpanY || 10;
        this.lineDash      = configs.lineDash;
        this.doubleLink    = configs.doubleLink;
        this.fontFamily    = configs.fontFamily = '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji'
        this.fontSize      = configs.fontSize || '12px';
        this.content       = configs.content || '';
        this.isSelf        = !!configs.isSelf
    }

    _calculateAnchorPoints() {
        const dmsfrom = this.from.getIntersectionsInFourDimension();
        const dmsto = this.to.getIntersectionsInFourDimension();
        if(this.isSelf){
            const points = polylinePoints(
                dmsfrom[this.fromDir],
                dmsto[DIRECTION.SELF],
                this.fromDir,
                DIRECTION.BOTTOM, 
                this.minSpanX, 
                this.minSpanY,
                true);

            this._cachePoints = points
            this._cacheAngle = [this.fromDir, DIRECTION.BOTTOM]
            // const points = polylinePoints(
            //     dmsfrom[this.fromDir],
            //     dmsto[this.toDir],
            //     this.fromDir,
            //     this.toDir, this.minSpanX , this.minSpanY);
            // this._cachePoints = points
            // this._cacheAngle = [this.fromDir, this.toDir]
        } else if(this.fromDir !== undefined && this.toDir !== undefined) {
            const points = polylinePoints(
                dmsfrom[this.fromDir],
                dmsto[this.toDir],
                this.fromDir,
                this.toDir, this.minSpanX , this.minSpanY);
            this._cachePoints = points
            this._cacheAngle = [this.fromDir, this.toDir]
        } else {
            const meta = minIntersectionBetweenNodes(dmsfrom, dmsto);
            console.log(meta)
            const points = polylinePoints(
                meta.fromP,
                meta.toP,
                meta.fromDir,
                meta.toDir,
                this.minSpanX , this.minSpanY);
            this._cachePoints = points
            this._cacheAngle = [meta.fromDir, meta.toDir]
        }
    }
    render(ctx) {
        this._calculateAnchorPoints();
        const radius = this.radius;
        const points = this._cachePoints;
        const p = points[0];
        const pEnd = points[points.length - 1];
        const angleEnd = ((this._cacheAngle[1] + 2) % 4) * 90 * PIINRATIO;
        ctx.fillStyle = ctx.strokeStyle = this.backgroundColor;
        if(this.doubleLink) {
            const beginAngle = ((this._cacheAngle[0] + 2) % 4) * 90 * PIINRATIO;
            ctx.beginPath();
            ctx.translate(p[0], p[1]);
            ctx.rotate(beginAngle);
            ctx.moveTo(5, 0);
            ctx.lineTo(0, -4);
            ctx.lineTo(0, 4);
            ctx.lineTo(5, 0);
            ctx.fill();
            ctx.rotate(-beginAngle);
            ctx.translate(-p[0], -p[1]);
        }
        ctx.beginPath();
        ctx.moveTo(p[0], p[1]);
        points.slice(1, points.length - 1).forEach((p, idx) => {
            if(this.radius) {
                const pLast = points[idx];
                const pNext = points[idx+2];
                const { p1, p2 } = makeRadiusFromVector(pLast, p, pNext, radius);
                if(p1 && p2){
                    ctx.lineTo(p1[0], p1[1]);
                    ctx.quadraticCurveTo(p[0], p[1], p2[0], p2[1]);
                } else {
                    ctx.lineTo(p[0], p[1]);
                }  
            } else {
                ctx.lineTo(p[0], p[1]);
            }
        });
        ctx.lineTo(pEnd[0], pEnd[1]);

        if(this.lineDash) {
            ctx.save();
            ctx.setLineDash(this.lineDash);
        }
        ctx.stroke();
        if(this.lineDash) {
            ctx.restore();
        }

        ctx.beginPath();
        ctx.translate(pEnd[0], pEnd[1]);
        ctx.rotate(angleEnd);
        ctx.moveTo(0, 0);
        ctx.lineTo(-5, -4);
        ctx.lineTo(-5, 4);
        ctx.lineTo(0, 0);
        ctx.fill();
        ctx.rotate(-angleEnd);
        ctx.translate(-pEnd[0], -pEnd[1]);

    }

    isHit(point) {
        const points = this._cachePoints;
        let lastP = points[0];
        const remainPoints = points.slice(1)
        do {
            const currentP = remainPoints.shift();
            if(currentP) {
                const dist = distToSegmentSquared(point, lastP, currentP);
                if(dist < this.approximate){
                    return true;
                }
            }
            lastP = currentP;
        } while(lastP)

        return false
    }
}

export default PolyLink;