import StackMixin from './stackMixin';
import LayoutMixin from './layoutMixin';
import { bounding_box } from '../utils/functions';
import { DIRECTION } from '../utils/constance';
/**
 * @property {number} definedWidth     - 设定宽度 
 * @property {number} definedHeight    - 设定高度 
 * @property {number} padding          - 内边距
 * @property {boolean} lock            - 布局锁定状态
 */
/**
 * Group mixin 用于在形状上加上 Group 特性
 *
 * @mixin
 * @mixes LayoutMixin
 * @mixes StackMixin
 */
const GroupMixin = {
    ...StackMixin,
    ...LayoutMixin,
    initGroup(configs) {
        this.initStack(configs);
        this.initLayout(configs);
        // this.padding =          configs.padding || 2;
        this.padding = {
            top: configs.paddingTop || configs.padding || 0,
            right: configs.paddingRight || configs.padding || 0,
            bottom: configs.paddingBottom || configs.padding || 0,
            left: configs.paddingLeft || configs.padding || 0,
        }
        console.log(this.padding)
        this.definedWidth =     configs.width;
        this.definedHeight =    configs.height;
        this.lock =             configs.lock;
        this.offsetY = 0;
        this.offsetX = 0;
        this._getBoundingGroupRect();
        this.reflow();
        this._getBoundingGroupRect();
    },
    _getBoundingGroupRect() {
        const points = this._stack.getBoundingRectPoints();
        const bbox = bounding_box(points);
        const padding = this.padding;
        const w = bbox.width + padding.left + padding.right;
        const h = bbox.height + padding.top + padding.bottom;
        this.width = this.definedWidth || w;
        this.height = this.definedHeight || h;

        this.offsetY = bbox.y;
        this.offsetX = bbox.x;
    },
    renderGroup(ctx, callback) {
        ctx.save();
        if(this._isMoving){
            ctx.globalAlpha = 0.5;
        }
        // this._getBoundingGroupRect();
        const anchor = this.anchor;
        ctx.save();
        callback(ctx);
        ctx.restore();
        const height = this.height;
        const width = this.width;
        const padding = this.padding;
        const spanV = height / 2 + this.offsetY - padding.top
        const spanH = width / 2 + this.offsetX - padding.left
        ctx.translate(anchor[0] - spanH, anchor[1] - spanV);
        this._stack.render(ctx);
        this._linkStack.render(ctx);
        ctx.translate(-anchor[0] + spanH, -anchor[1] + spanV);
        
        if(this._isTargeting) {
            this.renderFocus(ctx);
        }
        ctx.restore();
    },
    _calculatePointBack(point) {
        const [gx, gy] = point;
        const height = this.height;
        const width = this.width;
        const padding = this.padding;
        const spanV = height / 2 + this.offsetY - padding.top
        const spanH = width / 2 + this.offsetX -  padding.left
        const anchor = this.anchor;
        const p = [gx - anchor[0] + spanH, gy - anchor[1] +spanV ];
        return p
    },
    isHitGroup(point, condition) {
        const p = this._calculatePointBack(point);
        this._currentp = p; // 暂存，为了后续计算别的位置
        const target = this._stack.checkHit(p, condition);
        if(target) return target;
        return false;
    },
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
        const spanV = height / 2 + this.offsetY - padding.top
        const spanH = width / 2 + this.offsetX - padding.left
        const anchor = this.anchor;
        const p = [cx + anchor[0] - spanH, cy + anchor[1] - spanV];
        if(this._belongs && this._belongs.calculateToCoordination) {
            return this._belongs.calculateToCoordination(p);
        } else {
            return p;
        }
    },
    calculateToRealWorld(point) {
        const [cx, cy] = point;
        const height = this.height;
        const width = this.width;
        const padding = this.padding;
        const spanV = height / 2 + this.offsetY - padding.top
        const spanH = width / 2 + this.offsetX - padding.left
        const anchor = this.anchor;
        const p = [cx + anchor[0] - spanH, cy + anchor[1] - spanV];
        if(this._belongs && this._belongs.calculateToRealWorld) {
            return this._belongs.calculateToRealWorld(p);
        }
    }
}

export default GroupMixin;