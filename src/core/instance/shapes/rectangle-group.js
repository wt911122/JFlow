import Rectangle from './rectangle';
import GroupMixin from '../groupMixin';

/**
 * 矩形组单元
 * @description 组单元包含绘图栈，能够包裹内部单元，具有独立的坐标系，目前为中心对齐的坐标系
 * @extends Rectangle
 * @mixes GroupMixin
 */
class RectangleGroup extends Rectangle {
    constructor(configs) {
        super(configs)
        this.initGroup(configs);
    }


    render(ctx) {
        this.renderGroup(ctx, () => {
            Rectangle.prototype.render.call(this, ctx);
            // this.backgroundColor = 'rgba(0,0,0,0.2)';
            // Rectangle.prototype.render.call(this, ctx);
        })
    }

    isHit(point, condition) {
        const result = this.isHitGroup(point, condition);
        if(result) {
            return result;
        }
        return Rectangle.prototype.isHit.call(this, point);
    }
}
Object.assign(RectangleGroup.prototype, GroupMixin);
Object.assign(RectangleGroup.prototype, {
    setConfig(configs) {
        Object.keys(configs).forEach(k => {
            if(configs[k] !== undefined && configs[k] !== null) {
                this[k] = configs[k]
            }
        });
        this.padding = {
            top: configs.paddingTop || configs.padding || 0,
            right: configs.paddingRight || configs.padding || 0,
            bottom: configs.paddingBottom || configs.padding || 0,
            left: configs.paddingLeft || configs.padding || 0,
        };
        this._setBorder(configs);
    }
});

export default RectangleGroup;