import Diamond from './diamond';
import GroupMixin from '../groupMixin';

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
export default DiamondGroup;