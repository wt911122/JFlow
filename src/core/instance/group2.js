import Rectangle from './rectangle';
import StackMixin from './stackMixin';
import LayoutMixin from './layoutMixin';
import { bounding_box } from '../utils/functions';
import { DIRECTION } from '../utils/constance';

class Group extends Rectangle {
    constructor(configs) {
        super(configs)
        this.initStack(configs);
        this.initLayout(configs);
        this.definedWidth =     configs.width;
        this.definedHeight =    configs.height;
        this.type =             'Group';
        this.padding =          configs.padding || 2;
        this.hoverStyle =       configs.hoverStyle || 'cornflowerblue';
        this.hasShrink =        configs.hasShrink;
        this.lock =             configs.lock;
        this.status.shrink =    false;
        this.offsetY = 0;
        this._getBoundingGroupRect();
        this.reflow();
        this._getBoundingGroupRect();
        // this.addEventListener('click', (event) => {
        //     console.log(this.status.focusOnControlPoint)
        //     if(this.status.focusOnControlPoint) {
        //         this.shrink = !this.shrink;
        //         event.detail.jflow._render();
        //     }
        // });
        // this._currentCenter = this.getCenter();
    }

    _getBoundingGroupRect() {
        const points = this._stack.getBoundingRectPoints();
        const bbox = bounding_box(points);
        const padding = this.padding;
        const w = bbox.width + padding * 2;
        const h = bbox.height + padding * 2;
        this.width = this.definedWidth || w;
        this.height = this.definedHeight || h;

        // this.height = h;
        this.offsetY = bbox.y;
        this.offesetX = bbox.x;
        // 收起的重算
        // if(this.bounding_box && !this.bounding_box.shrink) {
        //     const vecx = bx - this.bounding_box.x;
        //     const vecy = by - this.bounding_box.y;
        //     this.anchor[0] += vecx;
        //     this.anchor[1] += vecy;
        // }
    }

    render(ctx) {
        ctx.save();
        if(this._isMoving){
            ctx.globalAlpha = 0.5;
        }
        // this._getBoundingGroupRect();
        const anchor = this.anchor;
        ctx.save();
        Rectangle.prototype.render.call(this, ctx);
        ctx.restore();
        const height = this.height;
        const width = this.width;
        const padding = this.padding;
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

    _calculatePointBack(point) {
        const [gx, gy] = point;
        const height = this.height;
        const width = this.width;
        const padding = this.padding;
        const spanV = height / 2 + this.offsetY - padding
        const spanH = width / 2 + this.offesetX - padding
        const anchor = this.anchor;
        const p = [gx - anchor[0] + spanH, gy - anchor[1] +spanV ];
        return p
    }

    isHit(point, condition) {
        const p = this._calculatePointBack(point);
        this._currentp = p; // 暂存，为了后续计算别的位置
        // if(!this.lock) {
            const target = this._stack.checkHit(p, condition);
            if(target) return target;
        // }

        return Rectangle.prototype.isHit.call(this, point);
    }
}
Object.assign(Group.prototype, StackMixin);
Object.assign(Group.prototype, LayoutMixin);
export default Group;