import { BaseLink } from '@joskii/jflow';
import {
    isPolyLineIntersectionRectange,
    distToSegmentSquared,
} from './utils';

const APPROXIMATE = 6;
class SwitchCaseLink extends BaseLink {
    constructor(configs) {
        super(configs);
        this.approximate   = configs.approximate || APPROXIMATE;
        this.showAdd = false;
        // this.fontFamily    = configs.fontFamily = '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji'
        // this.fontSize      = configs.fontSize || '12px';
        // this.content       = configs.content || '';
        // this.lineDash      = configs.lineDash;
        // this.approximate  = configs.approximate || APPROXIMATE;
    }

    _calculateAnchorPoints() {
        // console.log(this.bendPoint)
        const dmsfrom = this.from.getIntersectionsSeprate();
        const dmsto = this.to.getIntersectionsSeprate();
        const points = [dmsfrom[this.fromDir], dmsto[this.toDir]];
        this._cachePoints = points
        // this._cacheAngle = [this.fromDir, this.toDir]
    }

    isInViewBox(br) {
        this._calculateAnchorPoints();
        return isPolyLineIntersectionRectange(this._cachePoints, br);
    }

    render(ctx) {
        ctx.save();
        const [ p0, p1 ] = this._cachePoints;
        ctx.fillStyle = ctx.strokeStyle = this.backgroundColor;
        ctx.beginPath();

        ctx.moveTo(p0[0], p0[1]);
        ctx.lineTo(p1[0], p1[1]);
        ctx.save();
        ctx.setLineDash([2, 2]);
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(p0[0], p0[1]+4, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(p1[0], p1[1]-4, 4, 0, 2 * Math.PI);

        ctx.fill();
        ctx.stroke();
        if(this.showAdd) {
            ctx.save();

            ctx.lineWidth = 2;
            ctx.fillStyle = '#fff';
            // ctx.strokeStyle = '#4C88FF';
            const x = p0[0];
            const y = (p1[1] - p0[1])/2 + p0[1]
            ctx.translate(x, y);
            ctx.beginPath();
            ctx.moveTo(0, -8);
            ctx.lineTo(6.9, -4);
            ctx.lineTo(6.9, 4);
            ctx.lineTo(0, 8);
            ctx.lineTo(-6.9, 4);
            ctx.lineTo(-6.9, -4);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();

            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(-4, 0);
            ctx.lineTo(4, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, -4);
            ctx.lineTo(0, 4);
            ctx.stroke();
            ctx.translate(-x, -y);

            ctx.restore();
        }


        ctx.restore();
    }

    isHit(point) {
        const points = this._cachePoints;
        const dist = distToSegmentSquared(point, points[0], points[1]);
        if(dist < this.approximate){
            return true;
        }
        // return false
        // const [ p0, p1 ] = this._cachePoints;
        // const x = p0[0];
        // const y = (p1[1] - p0[1])/2 + p0[1]
        // return Math.pow(point[0] - x, 2) + Math.pow(point[1] - y, 2) < 64;
    }
}

export default SwitchCaseLink;