import Instance from './instance';
import { bezierPoints, distToBezierSegmentSquared, getBezierAngle } from '../utils/functions';
import { APPROXIMATE } from '../utils/constance';
class BezierLink extends Instance {
    constructor(configs) {
        super(configs);
        this.from   = configs.from; // Instance
        this.to     = configs.to;   // Instance
        this._cachePoints = null;
        this.defaultStyle = 'black';
        this.hoverStyle = 'cornflowerblue';
    }

    getColor() {
        if(this._isTargeting) {
            return this.hoverStyle;
        }
        return this.defaultStyle;
    }

    _calculateAnchorPoints() {
        const start = this.from.calculateIntersectionInFourDimension(this.to.getCenter());
        const end = this.to.calculateIntersectionInFourDimension(this.from.getCenter());
        const p1 = start.p;
        const p2 = end.p;
        const points = bezierPoints(p1, p2, start.dir, end.dir);

        this._cachePoints = [...p1, ...points]
    }

    render(ctx) {
        this._calculateAnchorPoints();
        const points = this._cachePoints;
        const angle = getBezierAngle.apply(null, [1, ...points])

        ctx.fillStyle = ctx.strokeStyle = this.getColor();
        ctx.beginPath();
        ctx.moveTo(points[0], points[1])
        ctx.bezierCurveTo(...points.slice(2));
        ctx.stroke();
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
    }

    isHit(point) {
        if(!this._cachePoints) return false;
        const points = this._cachePoints;
        const dist = distToBezierSegmentSquared(point, points)
        return dist < APPROXIMATE;
    }

    getBoundingRect() {
        const { startX, startY, endX, endY } = this._calculateAnchorPoints(); 
        return [[startX, startY], [endX, endY]]
    }
}

export default BezierLink;