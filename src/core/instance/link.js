import BaseLink from './base-link';
import { distToSegmentSquared } from '../utils/functions';
import { APPROXIMATE } from '../utils/constance';
class Link extends BaseLink {
    constructor(configs) {
        super(configs);
        this.from   = configs.from; // Instance
        this.to     = configs.to;   // Instance
        this.controlPoints = [0, 1, -10, 1, -10, 5];
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
        const start = this.from.calculateIntersection(this.to.getCenter());
        const end = this.to.calculateIntersection(this.from.getCenter());
        this._cachePoints = [start, end];
        return {
            startX: start[0], 
            startY: start[1],
            endX  : end[0],
            endY  : end[1],
        }
    }

    render(ctx) {
        const { startX, startY, endX, endY } = this._calculateAnchorPoints();
        console.log(startX, startY, endX, endY)
        const controlPoints = this.controlPoints;
        var dx = endX - startX;
        var dy = endY - startY;
        var len = Math.sqrt(dx * dx + dy * dy);
        var sin = dy / len;
        var cos = dx / len;
        var a = [];
        a.push(0, 0);
        for (var i = 0; i < controlPoints.length; i += 2) {
            var x = controlPoints[i];
            var y = controlPoints[i + 1];
            a.push(x < 0 ? len + x : x, y);
        }
        a.push(len, 0);
        for (var i = controlPoints.length; i > 0; i -= 2) {
            var x = controlPoints[i - 2];
            var y = controlPoints[i - 1];
            a.push(x < 0 ? len + x : x, -y);
        }
        a.push(0, 0);
        ctx.fillStyle = ctx.strokeStyle = this.getColor();
        ctx.beginPath();
        for (var i = 0; i < a.length; i += 2) {
            var x = a[i] * cos - a[i + 1] * sin + startX;
            var y = a[i] * sin + a[i + 1] * cos + startY;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.fill();
    }

    isHit(point) {
        if(!this._cachePoints) return false;
        const [ start, end ] = this._cachePoints;
        const dist = distToSegmentSquared(point, start, end)
        return dist < APPROXIMATE;
    }

    getBoundingRect() {
        const { startX, startY, endX, endY } = this._calculateAnchorPoints(); 
        return [[startX, startY], [endX, endY]]
    }
}

export default Link;