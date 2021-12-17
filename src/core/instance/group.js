import Rectangle from './rectangle';
import StackMixin from './stackMixin';
import LayoutMixin from './layoutMixin';
import { bounding_box } from '../utils/functions';
import { DIRECTION } from '../utils/constance';
/**
 * @typedef GroupConfigs
 * @type {object}
 * @property {number} borderWidth      - 边的宽度 默认是 2
 * @property {string} borderColor      - 边的颜色 默认 black
 * @property {string} hoverStyle       - 悬停颜色 默认 transparent
 * @property {string} content          - 内容
 * @property {string} color            - 填充颜色 默认 white
 * @property {string} font             - 字体 默认 28px serif
 * @property {string} textColor        - 字体颜色 默认 white
 * @property {string} textAlign        - 字体左右对齐 默认 center
 * @property {string} textBaseline     - 字体垂直对齐 默认 center
 * @property {number} width            - 设定宽度，则宽度不随内部元素变宽而变宽
 * @property {number} height           - 设定高度，则宽度不随内部元素变高而变高
 * @property {number} padding          - padding
 * @property {number} lock              - lock 后，内部元素不能被拖动
 */
/**
 * 组单元
 * @description 组单元包含绘图栈，能够包裹内部单元，具有独立的坐标系，目前为中心对齐的坐标系
 * @extends Rectangle
 * @mixes LayoutMixin
 * @mixes StackMixin
 */
class Group extends Rectangle {
    /**
     * 创建一个组
     * @param {GroupConfigs} configs - 配置

     **/
    constructor(configs) {
        super(configs)
        this.initStack(configs);
        this.initLayout(configs);
         /**
         * @property {number} definedWidth     - 设定宽度 
         * @property {number} definedHeight    - 设定高度 
         * @property {number} padding          - 内边距
         * @property {boolean} lock            - 布局锁定状态
         */
        this.definedWidth =     configs.width;
        this.definedHeight =    configs.height;
        this.type =             'Group';
        this.padding =          configs.padding || 2;
        this.hoverStyle =       configs.hoverStyle || 'cornflowerblue';
        this.hasShrink =        configs.hasShrink;
        this.lock =             configs.lock;
        this.status.shrink =    false;
        this.offsetY = 0;
        this.offsetX = 0;
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
        this.offsetX = bbox.x;
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
        const spanH = width / 2 + this.offsetX - padding
        ctx.translate(anchor[0] - spanH, anchor[1] - spanV);
        this._stack.render(ctx);
        this._linkStack.render(ctx);
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
        const spanH = width / 2 + this.offsetX - padding
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
    /**
     * 反算回 canvas 顶层坐标
     * @param {Number[]} point
     * @return {Number[]} 世界坐标
     */
    calculateToCoordination(point) {
        const [cx, cy] = point;
        const height = this.height;
        const width = this.width;
        const padding = this.padding;
        const spanV = height / 2 + this.offsetY - padding
        const spanH = width / 2 + this.offsetX - padding
        const anchor = this.anchor;
        const p = [cx + anchor[0] - spanH, cy + anchor[1] - spanV];
        if(this._belongs && this._belongs.calculateToCoordination) {
            return this._belongs.calculateToCoordination(p);
        } else {
            return p;
        }
    }

    calculateToRealWorld(point) {
        const [cx, cy] = point;
        const height = this.height;
        const width = this.width;
        const padding = this.padding;
        const spanV = height / 2 + this.offsetY - padding
        const spanH = width / 2 + this.offsetX - padding
        const anchor = this.anchor;
        const p = [cx + anchor[0] - spanH, cy + anchor[1] - spanV];
        if(this._belongs && this._belongs.calculateToRealWorld) {
            return this._belongs.calculateToRealWorld(p);
        }

    }
}
Object.assign(Group.prototype, StackMixin);
Object.assign(Group.prototype, LayoutMixin);
export default Group;