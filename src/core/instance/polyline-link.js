import Instance from './instance';
import { DIRECTION, APPROXIMATE } from '../utils/constance';
class LinkPolyline extends Instance {
    constructor(configs) {
        super(configs);
        this.from   = configs.from; // Instance
        this.to     = configs.to;   // Instance
        this.conrolNodes = [];
        this.controlPoint = [];
        this.defaultStyle = 'black';
        this.hoverStyle = 'cornflowerblue';
    }


    _calculateAnchorPoints() {
        const start = this.from.calculateIntersectionInFourDimension(this.to.getCenter());
        const end = this.to.calculateIntersectionInFourDimension(this.from.getCenter());
        return {
            start,
            end
        }
    }

    getColor() {
        if(this.status.hover) {
            return this.hoverStyle;
        }
        return this.defaultStyle;
    }

    render(ctx) {
        const { start, end } = this._calculateAnchorPoints();
        const diffDIR = Math.abs(start.dir - end.dir);
        let controlPoint = [start.p];
        if(diffDIR === 1 || diffDIR === 3) {
            // 证明只需要一个控制点
            if(start.dir % 2 === 1) {
                controlPoint.push([end.p[0], start.p[1]]);
            } else {
                controlPoint.push([start.p[0], end.p[1]]);
            }

        } else {
            if(start.dir % 2 === 1) {
                if(start.p[1] !== end.p[1] ) {
                    const mid = (start.p[0] - end.p[0]) /2 + end.p[0]
                    controlPoint.push([ mid, start.p[1] ]);
                    controlPoint.push([ mid, end.p[1] ]);
                }
            } else {
                if(start.p[0] !== end.p[0] ) {
                    const mid = (start.p[1] - end.p[1]) /2 + end.p[1]
                    controlPoint.push([ start.p[0], mid ]);
                    controlPoint.push([ end.p[0], mid ]);
                }
            }
        }
        controlPoint.push(end.p);
        this.controlPoint = controlPoint;
        ctx.fillStyle = ctx.strokeStyle = this.getColor();
        ctx.beginPath();
        for (let i = 0; i < controlPoint.length; i ++) {
            const [x, y] = controlPoint[i];
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.beginPath();
        const endP = end.p;
        ctx.moveTo(endP[0], endP[1]);

        switch (end.dir) {
            case DIRECTION.TOP:
                ctx.lineTo(endP[0] - 5, endP[1] - 10)
                ctx.lineTo(endP[0] + 5, endP[1] - 10)
                break;
            case DIRECTION.BOTTOM:
                ctx.lineTo(endP[0] + 5, endP[1] + 10)
                ctx.lineTo(endP[0] - 5, endP[1] + 10)
                break;
            case DIRECTION.RIGHT:
                ctx.lineTo(endP[0] + 10, endP[1] + 5)
                ctx.lineTo(endP[0] + 10, endP[1] - 5)
                break;
            case DIRECTION.LEFT:
                ctx.lineTo(endP[0] - 10, endP[1] - 5)
                ctx.lineTo(endP[0] - 10, endP[1] + 5)
                break;
            default:
                break;
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    isHit(point) {
        const controlPoint = this.controlPoint;
        let [sx, sy] = controlPoint[0];
        for (let i = 1; i < controlPoint.length; i ++) {

            const [ex, ey] = controlPoint[i];
            let lx, rx, by, ty;
            if(sx === ex) {
                lx = sx - APPROXIMATE;
                rx = sx + APPROXIMATE;
                by = Math.max(sy, ey);
                ty = Math.min(sy, ey);
            }
            if(sy === ey) {
                ty = sy - APPROXIMATE;
                by = sy + APPROXIMATE;
                rx = Math.max(sx, ex);
                lx = Math.min(sx, ex);
            }
            if(point[0] > lx 
                && point[0] < rx 
                && point[1] > ty 
                && point[1] < by) {
                    return true;
                }
            sx = ex;
            sy = ey;
        } 
        return false;
    }

    getBoundingRect() {
        const { start, end } = this._calculateAnchorPoints(); 
        return [start.p, end.p]
    }
}

export default LinkPolyline;