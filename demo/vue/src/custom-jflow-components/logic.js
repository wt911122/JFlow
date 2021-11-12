import { Rectangle, Group, JFlowEvent } from '@joskii/jflow';
const tan30 = Math.tan(Math.PI / 6);
class Logic extends Group{
    constructor(configs) {
        super(configs);
    }

    render(ctx) {
        ctx.save();
        if(this._isMoving){
            ctx.globalAlpha = 0.5;
        }
        // this._getBoundingGroupRect();
        const anchor = this.anchor;
        const height = this.height;
        const width = this.width;
        const padding = this.padding;
        ctx.save();
        // 六边形
        const d = tan30 * height / 2;
        const x1 = anchor[0] - width / 2 + d;
        const x2 = anchor[0] + width / 2 - d;
        const x3 = anchor[0] + width / 2;
        const x4 = anchor[0] - width / 2;
        const y1 = anchor[1] - height / 2;
        const y2 = anchor[1] + height / 2;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y1);
        ctx.lineTo(x3, anchor[1]);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x1, y2);
        ctx.lineTo(x4, anchor[1]);
        ctx.closePath();

        ctx.restore();

        const spanV = height / 2 + this.offsetY - padding
        const spanH = width / 2 + this.offesetX - padding
        ctx.translate(anchor[0] - spanH, anchor[1] - spanV);
        this._stack.render(ctx);
        this._linkStack.render(ctx);
        // if(this.hasShrink && this.shrink) {
        //     // TODO 收起应该抛出事件
        //     ctx.fillText('Group', anchor[0], anchor[1])
        // } else {
           
        // }
        ctx.translate(-anchor[0] + spanH, -anchor[1] + spanV);
        if(this._isTargeting) {
            this.renderFocus(ctx);
        }
        ctx.restore();
    }
}

export default Variable;