import BaseLink from './base-link';
import { distToSegmentSquared, isPolyLineIntersectionRectange } from '../utils/functions';
import { APPROXIMATE } from '../utils/constance';
// const PIINRATIO = Math.PI / 180
class Link extends BaseLink {
    constructor(configs) {
        super(configs);
        // this.controlPoints = [0, 1, -10, 1, -10, 5];
        this.fontFamily    = configs.fontFamily = '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji'
        this.fontSize      = configs.fontSize || '12px';
        this.content       = configs.content || '';
        this.lineDash      = configs.lineDash;
    }

    _calculateAnchorPoints() {
        const p0 = this.from.calculateIntersection(this.to.getCenter());
        const p1 = this.to.calculateIntersection(this.from.getCenter());
        this._cachePoints = [p0, p1];
        const dx = p1[0] - p0[0];
        const dy = p1[1] - p0[1];
        const angle = Math.atan2(dy, dx);
        this._cacheAngle = angle;
        // return {
        //     startX: start[0], 
        //     startY: start[1],
        //     endX  : end[0],
        //     endY  : end[1],
        // }
    }
    
    isInViewBox(br) {
        this._calculateAnchorPoints();
        return isPolyLineIntersectionRectange(this._cachePoints, br);
    }

    render(ctx) {
        const [ p0, p1 ] = this._cachePoints;
        const angle = this._cacheAngle;
        const dx = p1[0] - p0[0];
        const dy = p1[1] - p0[1];
        ctx.fillStyle = ctx.strokeStyle = this.backgroundColor;
        ctx.beginPath();
        ctx.moveTo(p0[0], p0[1]);
        ctx.lineTo(p1[0], p1[1]);
        if(this.lineDash) {
            ctx.save();
            ctx.setLineDash(this.lineDash);
        }
        ctx.stroke();
        if(this.lineDash) {
            ctx.restore();
        }

        ctx.translate(p1[0], p1[1]);
        ctx.rotate(angle);
        ctx.moveTo(0, 0);
        ctx.lineTo(-5, -4);
        ctx.lineTo(-5, 4);
        ctx.lineTo(0, 0);
        ctx.fill();
        ctx.rotate(-angle);
        ctx.translate(-p1[0], -p1[1]);
        // const controlPoints = this.controlPoints;
        // var dx = endX - startX;
        // var dy = endY - startY;
        // var len = Math.sqrt(dx * dx + dy * dy);
        // var sin = dy / len;
        // var cos = dx / len;
        // var a = [];
        // a.push(0, 0);
        // for (var i = 0; i < controlPoints.length; i += 2) {
        //     var x = controlPoints[i];
        //     var y = controlPoints[i + 1];
        //     a.push(x < 0 ? len + x : x, y);
        // }
        // a.push(len, 0);
        // for (var i = controlPoints.length; i > 0; i -= 2) {
        //     var x = controlPoints[i - 2];
        //     var y = controlPoints[i - 1];
        //     a.push(x < 0 ? len + x : x, -y);
        // }
        // a.push(0, 0);
        // ctx.fillStyle = ctx.strokeStyle = this.backgroundColor;
        // ctx.beginPath();
        // for (var i = 0; i < a.length; i += 2) {
        //     var x = a[i] * cos - a[i + 1] * sin + startX;
        //     var y = a[i] * sin + a[i + 1] * cos + startY;
        //     if (i === 0) ctx.moveTo(x, y);
        //     else ctx.lineTo(x, y);
        // }
        // ctx.fill();

        if(this.content){ 
            ctx.beginPath();
            ctx.textAlign = 'center';
            ctx.font = `${this.fontSize} ${this.fontFamily}`;
            ctx.fillText(this.content, dx /2 + p0[0] , dy /2 + p0[1]);
        }
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