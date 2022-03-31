import Node from '../node';

class BezierDeck extends Node {
    constructor(configs) {
        super(configs);
        /** @member {Number}      - 半径 */
        this.dir = configs.dir === 'in' ? -1 : 1;
        this.width = configs.width;
        this.height = configs.height;
        this.thick = configs.thick;
    }

    renderBezierCurve(ctx) {
        const [x, y] = this.anchor;
        const dir = this.dir;
        const h = this.height/2;
        const w = this.width/2;
        const s = dir * w;
        const points = [
            x + s, -h,
            x - s, 0,
            x + s, h
        ];
        this._cachePoints = _cachePoints;
        ctx.beginPath();
        ctx.moveTo(points[0], points[1]);
        ctx.bezierCurveTo(points[2], points[3], points[4], points[5]);
        ctx.strokeStyle = this.backgroundColor;
        ctx.lineWidth = this.thick;
        ctx.stroke();
    }

    render(ctx) {
        ctx.save();
        this.renderBezierCurve(ctx);
        ctx.restore();
    }

    isHit(point) {
        if(!this._cachePoints) return false;
        const dist = distToBezierSegmentSquared(point, this._cachePoints) * 2;
        return dist < this.thick;
    }

    getBoundingRect() {
        const anchor = this.anchor;
        const w = this.width/2;
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

    calculateIntersectionInFourDimension(point, end) {
       
    }

    getBoundingDimension() {
        return {
            height: this.height,
            width: this.width,
        }
    }
}

export default Point;