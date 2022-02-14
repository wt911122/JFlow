import Rhombus from './rhombus';
import GroupMixin from '../groupMixin';

 /**
 * 菱形组单元
 * @typedef {GroupMixin~LayoutGroupConfigs | Rhombus~RhombusConfigs } RhombusGroup~RhombusGroupConfigs
 */
/**
 * 菱形组单元
 * @description 组单元包含绘图栈，能够包裹内部单元，具有独立的坐标系，目前为中心对齐的坐标系
 * @constructor RhombusGroup
 * @param {RhombusGroup~RhombusGroupConfigs} configs - 配置
 * @extends Rhombus
 * @mixes GroupMixin
 */
class RhombusGroup extends Rhombus {
    constructor(configs) {
        super(configs)
        this.initGroup(configs);
    }

    render(ctx) {
        this.renderGroup(ctx, () => {
            Rhombus.prototype.render.call(this, ctx);
            // this.backgroundColor = 'rgba(0,0,0,0.2)';
            // Rectangle.prototype.render.call(this, ctx);
        })
    }

    isHit(point, condition) {
        const result = this.isHitGroup(point, condition);
        if(result) {
            return result;
        }
        return Rhombus.prototype.isHit.call(this, point);
    }
}
Object.assign(RhombusGroup.prototype, GroupMixin);

export default RhombusGroup;