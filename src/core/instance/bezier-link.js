import BaseLink from './base-link';
import { bezierPoints, distToBezierSegmentSquared, getBezierAngle, minIntersectionBetweenNodes } from '../utils/functions';
import { APPROXIMATE, DIRECTION } from '../utils/constance';
import { dist2, bezierPoint } from '../utils/functions';
const PIINRATIO = Math.PI / 180
/**
 * @typedef {BaseLink~Configs} BezierLink~Configs
 * @property {Number} approximate   - 点击响应范围
 * @property {Number} minSpanX      - 起点终点在 x 方向最小的跨度
 * @property {Number} minSpanY      - 起点终点在 y 方向最小的跨度
 * @property {Number[]} lineDash    - 虚线数组
 * @property {Boolean} doubleLink   - 双向箭头
 * @property {String} fontFamily    - 连线上的文字字体
 * @property {Number} fontSize      - 连线上的文字大小
 * @property {String} content       - 连线上的文字
 * @property {Boolean} isSelf        - 是否为自连接
 */
/**
 * 贝塞尔曲线
 * @constructor BezierLink
 * @extends BaseLink
 * @param {BezierLink~Configs} configs - 配置
 */
class BezierLink extends BaseLink {
     /**
     * 创建贝塞尔曲线.
     * @param {BezierLink~Configs} configs - 配置
     **/
    constructor(configs) {
        super(configs);
        /** @member {Number}      - 点击响应范围 */
        this.approximate   = configs.approximate || APPROXIMATE;
        /** @member {Number}      - 起点终点在 x 方向最小的跨度 */
        this.minSpanX      = configs.minSpanX || 0;
        /** @member {Number}      - 起点终点在 y 方向最小的跨度 */
        this.minSpanY      = configs.minSpanY || 0;
        /** @member {Number[]}      - 虚线数组 */
        this.lineDash      = configs.lineDash;
        /** @member {Boolean}      - 双向箭头 */
        this.doubleLink    = configs.doubleLink;
        /** @member {String}      - 连线上的文字字体 */
        this.fontFamily    = configs.fontFamily = '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji'
        /** @member {Number}      - 连线上的文字大小 */
        this.fontSize      = configs.fontSize || '12px';
        /** @member {String}      - 连线上的文字 */
        this.content       = configs.content || '';
        /** @member {Boolean}      - 是否为自连接 */
        this.isSelf        = !!configs.isSelf
    }
    
    // getColor() {
    //     if(this._isTargeting) {
    //         return this.hoverStyle;
    //     }
    //     return this.defaultStyle;
    // }
    
    // _calculateAnchorPoints() {
    //     let start;
    //     let end;
    //     if(this.fromDir !== undefined) {
    //         start = {
    //             dir: this.fromDir,
    //             p: this.from.getIntersectionsInFourDimension()[this.fromDir],
    //         }
    //     } else {
    //         start = this.from.calculateIntersectionInFourDimension(this.to.getCenter(), 'from');
    //     }
    //     if(this.toDir !== undefined) {
    //         end = {
    //             dir: this.toDir,
    //             p: this.to.getIntersectionsInFourDimension()[this.toDir],
    //         }
    //     } else {
    //         end = this.to.calculateIntersectionInFourDimension(this.from.getCenter(), 'to');
    //     }
        
        
    //     // const start = this.from.calculateIntersectionInFourDimension(this.to.getCenter(), 'from');
    //     // const end = this.to.calculateIntersectionInFourDimension(this.from.getCenter(), 'to');
    //     const p1 = start.p;
    //     const p2 = end.p;
    //     const points = bezierPoints(p1, p2, start.dir, end.dir, this.anticlock);

    //     this._cachePoints = [...p1, ...points]
    // }

    _calculateAnchorPoints() {

        const dmsfrom = this.from.getIntersectionsInFourDimension();
        const dmsto = this.to.getIntersectionsInFourDimension();
        if(this.isSelf) {
            const points = bezierPoints(
                dmsfrom[this.fromDir],
                dmsto[DIRECTION.SELF],
                this.fromDir,
                DIRECTION.BOTTOM, 
                this.minSpanX, 
                this.minSpanY);

            this._cachePoints = [...dmsfrom[this.fromDir], ...points] 
            console.log(points)
            this._cacheAngle = [this.fromDir, DIRECTION.BOTTOM]
        } else if(this.fromDir !== undefined && this.toDir !== undefined) {
            const points = bezierPoints(
                dmsfrom[this.fromDir],
                dmsto[this.toDir],
                this.fromDir,
                this.toDir, this.minSpanX , this.minSpanY);
            this._cachePoints = [...dmsfrom[this.fromDir], ...points] 
            this._cacheAngle = [this.fromDir, this.toDir]
        } else {
            const meta = minIntersectionBetweenNodes(dmsfrom, dmsto);
            const points = bezierPoints(
                meta.fromP,
                meta.toP,
                meta.fromDir,
                meta.toDir);

            this._cachePoints = [...meta.fromP, ...points];
            this._cacheAngle = [meta.fromDir, meta.toDir];
        }
    }

    render(ctx) {
        this._calculateAnchorPoints();
        const points = this._cachePoints;
        const angle = getBezierAngle.apply(null, [1, ...points])
        ctx.fillStyle = ctx.strokeStyle = this.backgroundColor;
        if(this.doubleLink) {
            const beginAngle = ((this._cacheAngle[0] + 2) % 4) * 90 * PIINRATIO;
            ctx.beginPath();
            ctx.translate(points[0], points[1]);
            ctx.rotate(beginAngle);
            ctx.moveTo(5, 0);
            ctx.lineTo(0, -4);
            ctx.lineTo(0, 4);
            ctx.lineTo(5, 0);
            ctx.fill();
            ctx.rotate(-beginAngle);
            ctx.translate(-points[0], -points[1]);
        }
        ctx.beginPath();
        ctx.moveTo(points[0], points[1])
        ctx.bezierCurveTo(...points.slice(2));
        if(this.lineDash) {
            ctx.save();
            ctx.setLineDash(this.lineDash);
        }
        ctx.stroke();
        if(this.lineDash) {
            ctx.restore();
        }
        ctx.beginPath();
        ctx.translate(points[6], points[7]);
        ctx.rotate(angle);
        ctx.moveTo(5, 0);
        ctx.lineTo(0, -4);
        ctx.lineTo(0, 4);
        ctx.lineTo(5, 0);
        ctx.fill();
        ctx.rotate(-angle);
        ctx.translate(-points[6], -points[7]);
        if(this.content) {
            ctx.beginPath();
            const [x, y, angle] = bezierPoint(0.5, points);
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.font = `${this.fontSize} ${this.fontFamily}`;
            ctx.textAlign = 'center';
            ctx.fillText(this.content, 0, 10);
            ctx.rotate(-angle);
            ctx.translate(-x, -y);
        }
    }

    isHit(point) {
        if(!this._cachePoints) return false;
        const points = this._cachePoints;
        const dist = distToBezierSegmentSquared(point, points)
        return dist < this.approximate;
    }

    getBoundingRect() {
        const { startX, startY, endX, endY } = this._calculateAnchorPoints(); 
        return [[startX, startY], [endX, endY]]
    }
}

export default BezierLink;