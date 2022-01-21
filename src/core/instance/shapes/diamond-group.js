import Diamond from './diamond';
import GroupMixin from '../groupMixin';
import { bounding_box } from '../../utils/functions';
const backsqrt3 = 1/Math.sqrt(3)
/**
 * 钻石形组单元
 * @description 组单元包含绘图栈，能够包裹内部单元，具有独立的坐标系，目前为中心对齐的坐标系
 * @extends Diamond
 * @mixes GroupMixin
 */
class DiamondGroup extends Diamond {
    constructor(configs) {
        super(configs)
        this.initGroup(configs);
    }


    render(ctx) {
        this.renderGroup(ctx, () => {

            Diamond.prototype.render.call(this, ctx);
        // ctx.save();
        // ctx.fillStyle = 'rgba(255,0,0,0.3)';
        // ctx.fillRect(this.anchor[0] - this.width/2, this.anchor[1] - this.height/2, this.width, this.height)
        // ctx.restore();
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
Object.assign(DiamondGroup.prototype, GroupMixin);
Object.assign(DiamondGroup.prototype, {
    _getBoundingGroupRect() {
        const points = this._stack.getBoundingRectPoints();
        const bbox = bounding_box(points);
        const padding = this.padding;
        const minWidth = this.minWidth - padding.left - padding.right;
        const definedWidth = this.definedWidth - padding.left - padding.right;
        const w = bbox.width + padding.left + padding.right + bbox.height * backsqrt3 / 2;
        const h = bbox.height + padding.top + padding.bottom;
        this.width = minWidth ? Math.max(minWidth, w) : definedWidth || w;
        this.height = this.definedHeight || h;
        // this.offsetY = bbox.y;
        // this.offsetX = bbox.x;
    },
    setConfig(configs) {
        Object.keys(configs).forEach(k => {
            if(configs[k] !== undefined && configs[k] !== null) {
                this[k] = configs[k];
                this._rawConfigs[k] = configs[k];
            }
        });
        this.padding = {
            top: configs.paddingTop || configs.padding || 0,
            right: configs.paddingRight || configs.padding || 0,
            bottom: configs.paddingBottom || configs.padding || 0,
            left: configs.paddingLeft || configs.padding || 0,
        };
        this._cacheSide();
    }
})
export default DiamondGroup;