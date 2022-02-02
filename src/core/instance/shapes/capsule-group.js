import Capsule from './capsule';
import GroupMixin from '../groupMixin';
/**
 * 钻石形组单元配置
 * @typedef {GroupMixin~LayoutGroupConfigs | Capsule~CapsuleConfigs } CapsuleGroup~CapsuleGroupConfigs
 */
/**
 * 胶囊组单元
 * @description 组单元包含绘图栈，能够包裹内部单元，具有独立的坐标系，目前为中心对齐的坐标系
 * @constructor CapsuleGroup
 * @extends Capsule
 * @param {CapsuleGroup~CapsuleGroupConfigs} configs - 配置
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