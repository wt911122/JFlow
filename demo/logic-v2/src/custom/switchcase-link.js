import { BaseLink } from '@joskii/jflow';
import {
    isPolyLineIntersectionRectange
} from './utils';

class SwitchCaseLink extends BaseLink {
    constructor(configs) {
        super(configs);
        // this.fontFamily    = configs.fontFamily = '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji'
        // this.fontSize      = configs.fontSize || '12px';
        // this.content       = configs.content || '';
        // this.lineDash      = configs.lineDash;
        // this.approximate  = configs.approximate || APPROXIMATE;
    }

    _calculateAnchorPoints() {
        console.log(this.bendPoint)
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
        ctx.restore();
    }

    isHit(point) {
        return false
    }
}

export default SwitchCaseLink;