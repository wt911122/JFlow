import BaseLink from './base-link';
import { distToSegmentSquared,
    isPolyLineIntersectionRectange,
    compareBoundingbox,
    copyBoundingbox
} from '../utils/functions';
import { APPROXIMATE } from '../utils/constance';
/**
 * @typedef {BaseLink~Configs} Link~Configs
 * @property {Number} approximate   - 点击响应范围
 * @property {Number[]} lineDash    - 虚线数组
 * @property {Boolean} doubleLink   - 双向箭头
 * @property {String} fontFamily    - 连线上的文字字体
 * @property {Number} fontSize      - 连线上的文字大小
 * @property {String} content       - 连线上的文字
 */
/**
 * 直线
 * @constructor Link
 * @extends BaseLink
 * @param {Link~Configs} configs - 配置
 */
class Link extends BaseLink {
    constructor(configs) {
        super(configs);
        this.fontFamily    = configs.fontFamily = '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji'
        this.fontSize      = configs.fontSize || '12px';
        this.content       = configs.content || '';
        this.lineDash      = configs.lineDash;
        this.approximate  = configs.approximate || APPROXIMATE;

        this._cacheAngle = undefined;
        this._cachePoints = [];
        this._cacheBoundingbox = {
            from: [],
            to: []
        };
    }

    _calculateAnchorPoints() {
        const p0 = this.from.calculateIntersection(this.to.getCenter());
        const p1 = this.to.calculateIntersection(this.from.getCenter());
        this._cachePoints[0] = p0;
        this._cachePoints[1] = p1;
        const dx = p1[0] - p0[0];
        const dy = p1[1] - p0[1];
        const angle = Math.atan2(dy, dx);
        this._cacheAngle = angle;
    }
    
    isInViewBox(br) {
        const frombox = this.from.getBoundingRect();
        const tobox = this.to.getBoundingRect();
        const _box = this._cacheBoundingbox;
        if(!compareBoundingbox(_box.from, frombox) || compareBoundingbox(_box.to, tobox)) {
            copyBoundingbox(_box.from, frombox);
            copyBoundingbox(_box.to, tobox);
            this._calculateAnchorPoints();
        }
        return true;
    }

    render(ctx) {
        const [ p0, p1 ] = this._cachePoints;
        const angle = this._cacheAngle;
        const dx = p1[0] - p0[0];
        const dy = p1[1] - p0[1];
        ctx.fillStyle = ctx.strokeStyle = this.backgroundColor;
        ctx.beginPath();
        if(this.content){ 

            ctx.textAlign = 'center';
            ctx.font = `${this.fontSize} ${this.fontFamily}`;
            ctx.textBaseline = 'middle';
            const {
                actualBoundingBoxLeft,
                actualBoundingBoxRight,
                fontBoundingBoxAscent,
                fontBoundingBoxDescent
            } = ctx.measureText(this.content);
            const x = dx /2 + p0[0];
            const y = dy /2 + p0[1];
            ctx.fillText(this.content, x, y);
            const width = Math.abs(actualBoundingBoxLeft) + Math.abs(actualBoundingBoxRight) + 20;
            const height = (Math.abs(fontBoundingBoxAscent) + Math.abs(fontBoundingBoxDescent)) * 1.5;
            ctx.beginPath();
            let region = new Path2D();
            region.rect(x - width/2 , y - height/2, width, height);
            const rx = Math.min(p1[0], p0[0]) - 10;
            const ry = Math.min(p1[1], p0[1]) - 10;
            const rw = Math.abs(dx) + 20;
            const rh = Math.abs(dy) + 20;
            region.rect(rx , ry, rw, rh);
            ctx.clip(region, "evenodd");
        }


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
    }

    isHit(point) {
        if(!this._cachePoints) return false;
        const [ start, end ] = this._cachePoints;
        const dist = distToSegmentSquared(point, start, end)
        return dist < this.approximate;
    }
}

export default Link;