import Diamond from './diamond';
import GroupMixin from '../groupMixin';
import { bounding_box } from '../../utils/functions';
const backsqrt3 = 1/Math.sqrt(3)

/**
 * 垂直钻石形组单元
 * @description 组单元包含绘图栈，能够包裹内部单元，具有独立的坐标系，目前为中心对齐的坐标系
 * @constructor DiamondVerticalGroup
 * @param {DiamondGroup~DiamondGroupConfigs} configs - 配置
 * @extends Diamond
 * @mixes GroupMixin
 */
class DiamondVerticalGroup extends Diamond {
    constructor(configs) {
        super(configs)
        this.initGroup(configs);
    }


    render(ctx) {
        this.renderGroup(ctx, () => {
            ctx.save();
            if(this._isMoving){
                ctx.globalAlpha = 0.6
            }
            ctx.beginPath();
            const [x, y] = this.anchor;
            const hw = this.width/2;
            const hh = this.height/2;
            const yy = hw / 1.732

            const top = y - hh;
            const bottom = y + hh;
            const topmiddle = y - hh + yy;
            const bottommiddle = y + hh - yy;
            const xleft = x - hw;
            const xright = x + hw;

            ctx.moveTo(x, top);
            ctx.lineTo(xright, topmiddle);
            ctx.lineTo(xright, bottommiddle);
            ctx.lineTo(x, bottom);
            ctx.lineTo(xleft, bottommiddle);
            ctx.lineTo(xleft, topmiddle);
            ctx.closePath();
            ctx.fillStyle = this.backgroundColor;
            ctx.fill();
            if(this.borderWidth) {
                ctx.lineWidth = this.borderWidth;
                ctx.strokeStyle = this.borderColor;
                ctx.stroke();
            }

            ctx.restore();
            this._cachePoints = [
                [x, top],
                [xright, topmiddle],
                [xright, bottommiddle],
                [x, bottom],
                [xleft, bottommiddle],
                [xleft, topmiddle]
            ];
            console.log(this._cachePoints)
        })
    }

    isHit(point, condition) {
        const result = this.isHitGroup(point, condition);
        if(result) {
            return result;
        }
        return Diamond.prototype.isHit.call(this, point);
    }
}
Object.assign(DiamondVerticalGroup.prototype, GroupMixin);
Object.assign(DiamondVerticalGroup.prototype, {
    _getBoundingGroupRect() {
        const points = this._stack.getBoundingRectPoints();
        const bbox = bounding_box(points);
        const anchors = this._stack.getAnchorRectPoints();
        const anchorsbbox = bounding_box(anchors);
        const padding = this.padding;
        const minWidth = this.minWidth - padding.left - padding.right;
        const definedWidth = this.definedWidth - padding.left - padding.right;
        const w = bbox.width + padding.left + padding.right;
        const h = anchorsbbox.height + w / 1.732 + padding.top + padding.bottom;

        this.width = minWidth ? Math.max(minWidth, w) : definedWidth || w;
        this.height = this.definedHeight || h;
    },
})
export default DiamondVerticalGroup;