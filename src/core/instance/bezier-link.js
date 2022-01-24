import BaseLink from './base-link';
import { bezierPoints, distToBezierSegmentSquared, getBezierAngle } from '../utils/functions';
import { APPROXIMATE } from '../utils/constance';
import { dist2, bezierPoint } from '../utils/functions';
/**
 * 贝塞尔曲线
 * @extends BaseLink
 */
const PIINRATIO = Math.PI / 180
class BezierLink extends BaseLink {
     /**
     * 创建贝塞尔曲线.
     * @param {Configs} configs - 配置
     * @param {Boolean} configs.anticlock   - 进出方向反转
     **/
    constructor(configs) {
        super(configs);
        this.anticlock     = configs.anticlock;
        this.approximate   = configs.approximate || APPROXIMATE;
        this.minSpanX      = configs.minSpanX || 0;
        this.minSpanY      = configs.minSpanY || 0;
        this.lineDash      = configs.lineDash;
        this.doubleLink    = configs.doubleLink;
        this.fontFamily    = configs.fontFamily = '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji'
        this.fontSize      = configs.fontSize || '12px';
        this.content       = configs.content || '';

    }
    /**
     * 根据当前状态获取颜色，当前单元是否被选中
     * @return {String} 颜色
     */
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
        if(this.fromDir !== undefined && this.toDir !== undefined) {
            const points = bezierPoints(
                dmsfrom[this.fromDir],
                dmsto[this.toDir],
                this.fromDir,
                this.toDir, this.minSpanX , this.minSpanY);
            this._cachePoints = [...dmsfrom[this.fromDir], ...points] 
            this._cacheAngle = [this.fromDir, this.toDir]
            return;
        }
        const meta = {
            fromDir: null,
            fromP: null,
            toDir: null,
            toP: null,
            distMin: Infinity
        }
        Object.keys(dmsfrom).forEach(df => {
            let pf = dmsfrom[df];
            // if(this.from._belongs && this.from._belongs.calculateToCoordination) {
            //     debugger
            //     pf = this.from._belongs.calculateToCoordination(pf);
            // }
            Object.keys(dmsto).forEach(dt => {
                let pt = dmsto[dt];
                // if(this.to._belongs && this.to._belongs.calculateToCoordination) {
                //     pt = this.to._belongs.calculateToCoordination(pt);
                // }
                const dist = dist2(pf, pt);
                if(dist < meta.distMin) {
                    Object.assign(meta, {
                        distMin: dist,
                        fromDir: +df,
                        fromP: pf,
                        toDir: +dt,
                        toP: pt,
                    })
                }
            })
        });
        const points = bezierPoints(
            meta.fromP,
            meta.toP,
            meta.fromDir,
            meta.toDir);

        this._cachePoints = [...meta.fromP, ...points];
        this._cacheAngle = [meta.fromDir, meta.toDir];
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
            const [x, y] = bezierPoint(0.5, points);
            ctx.font = `${this.fontSize} ${this.fontFamily}`;
            ctx.textAlign = 'center';
            ctx.fillText(this.content, x, y);
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