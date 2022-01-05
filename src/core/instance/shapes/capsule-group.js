import Capsule from './capsule';
import GroupMixin from '../groupMixin';

/**
 * 胶囊组单元
 * @description 组单元包含绘图栈，能够包裹内部单元，具有独立的坐标系，目前为中心对齐的坐标系
 * @extends Capsule
 * @mixes GroupMixin
 */
class CapsuleGroup extends Capsule {
    constructor(configs) {
        super(configs)
        this.initGroup(configs);
    }

    render(ctx) {
        this.renderGroup(ctx, () => {
            Capsule.prototype.render.call(this, ctx);
        })
    }

    isHit(point, condition) {
        const result = this.isHitGroup(point, condition);
        if(result) {
            return result;
        }
        
        return Capsule.prototype.isHit.call(this, point);
    }
}
Object.assign(CapsuleGroup.prototype, GroupMixin);
export default CapsuleGroup;