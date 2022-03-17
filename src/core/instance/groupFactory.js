import Node from './node';
import StackMixin from './stackMixin';
import LayoutMixin from './layoutMixin';
import { bounding_box } from '../utils/functions';
import { DIRECTION } from '../utils/constance';
const GroupMixin = {
    ...StackMixin,
    ...LayoutMixin,
    _setPadding(configs) {
        this.padding = {
            top: configs.paddingTop || configs.padding || 0,
            right: configs.paddingRight || configs.padding || 0,
            bottom: configs.paddingBottom || configs.padding || 0,
            left: configs.paddingLeft || configs.padding || 0,
        };
    },
    _setMargin(configs)  {
        this.margin = {
            top: configs.marginTop || configs.margin || 0,
            right: configs.marginRight || configs.margin || 0,
            bottom: configs.marginBottom || configs.margin || 0,
            left: configs.marginLeft || configs.margin || 0,
        };
    },
    _getCenter() {
        const anchor = this.anchor;
        const padding = this.padding;
        const margin = this.margin;
        const centerX = (padding.left - padding.right)/2 + (margin.left - margin.right)/2;
        const centerY = (padding.top - padding.bottom)/2 + (margin.top - margin.bottom)/2;
        return [anchor[0] + centerX, anchor[1] + centerY];
    },

    _calculatePointBack(point) {
        const [gx, gy] = point;
        const [cx, cy] = this._getCenter(); 
        const p = [gx - cx, gy - cy]
        return p
    },
    /**
     * 反算回 canvas 顶层坐标
     * @param {Number[]} point
     * @return {Number[]} 世界坐标
     */
    calculateToCoordination(point) {
        const [gx, gy] = point;
        const [cx, cy] = this._getCenter(); 
        // const p = [cx + anchor[0] - spanH, cy + anchor[1] - spanV];
        const p = [gx + cx, gy + cy]
        if(this._belongs && this._belongs.calculateToCoordination) {
            return this._belongs.calculateToCoordination(p);
        } else {
            return p;
        }
    },
    /**
     * 反算回页面的像素坐标，重载 {@link Instance#calculateToRealWorld}
     * @param {Number[]} point
     * @return {Number[]} 世界坐标
     */
    calculateToRealWorld(point) {
        const [gx, gy] = point;
        const [cx, cy] = this._getCenter(); 
        const p = [gx + cx, cy]
        if(this._belongs && this._belongs.calculateToRealWorld) {
            return this._belongs.calculateToRealWorld(p);
        }
    },
    clone() {
        const C = this.constructor;
        const configs = Object.assign({}, this._rawConfigs, {
            layout: this._layout && this._layout.clone(),
        })
        const t = new C(configs);
        this.interateNodeStack((instance) => {
            t.addToStack(instance.clone());
        })
        t.recalculate();
        return t;
    },
    getBoundingDimension() {
        return {
            width: this.width,
            height: this.height,
        }
    },
    getBoundingRect() {
        const anchor = this.anchor;
        const w = this.width /2;
        const h = this.height/2;
        const ltx = anchor[0] - w;
        const lty = anchor[1] - h;
        const rbx = anchor[0] + w;
        const rby = anchor[1] + h;
        return [
            [ltx, lty],
            [rbx, rby],
        ]
    },
    getIntersectionsInFourDimension() {
        let p2 = this.anchor;
        if(this._belongs && this._belongs.calculateToCoordination) {
            p2 = this._belongs.calculateToCoordination(p2);
        }

        const [x2, y2] = p2;
        const w = this.width/2;
        const h = this.height/2;
        return {
            [DIRECTION.RIGHT]:  [x2+w, y2],
            [DIRECTION.LEFT]:   [x2-w, y2],
            [DIRECTION.BOTTOM]: [x2, y2+h],
            [DIRECTION.TOP]:    [x2, y2-h],
            [DIRECTION.SELF]:   [x2+w*0.618, y2+h*0.618]
        }
    }
}

function GroupFactory(jflowNodeConstructor) {
    class t extends Node {
        constructor(configs) {
            super(configs);
                this.initStack(configs);
                this.initLayout(configs);
                this._shape = new jflowNodeConstructor(configs);
                this._shape.anchor = [0, 0];
                this._shape._belongs = this;
                this._setPadding(configs);
                this._setMargin(configs);  
                this.definedWidth =     configs.width;
                this.minWidth =         configs.minWidth;
                this.definedHeight =    configs.height;
                this.lock =             configs.lock ?? true ;
                this._getBoundingGroupRect();
                this.reflow();
                this._getBoundingGroupRect();  
        }
    }
    Object.assign(t.prototype, GroupMixin);
    Object.assign(t.prototype, { 
        setConfig(configs) {
            this._shape.setConfig(configs);
            this._setPadding(configs);
            this._setMargin(configs);  
        },
        _getBoundingGroupRect() {
            const points = this._stack.getBoundingRectPoints();
            // const shapePoints = this._shape.getBoundingRect();
            const bbox = bounding_box(points);
            const padding = this.padding;
            const minWidth = this.minWidth - padding.left - padding.right;
            const definedWidth = this.definedWidth - padding.left - padding.right;
            const w = bbox.width + padding.left + padding.right;
            const h = bbox.height + padding.top + padding.bottom;
            
            const shapeWidth = minWidth ? Math.max(minWidth, w) : definedWidth || w;
            const shapeHeight = this.definedHeight || h;
            this._shape.width = shapeWidth;
            this._shape.height = shapeHeight;

            const margin = this.margin;
            this.width = shapeWidth + margin.left + margin.right;
            this.height = shapeHeight + margin.top + margin.bottom;
        },
        render(ctx) {
            ctx.save();
            if(this._isMoving){
                ctx.globalAlpha = 0.6
            }
            const [cx, cy] = this._getCenter(); 
            ctx.translate(cx, cy);
            // ctx.fillRect(-this.width/2,-this.height/2,this.width, this.height)
            this._shape.render(ctx);
            this._stack.render(ctx);
            this._linkStack.render(ctx);    
            ctx.translate(-cx, -cy);
            ctx.restore();
        },
        isHit(point, condition) {
            const p = this._calculatePointBack(point);
            this._currentp = p; // 暂存，为了后续计算别的位置
            const target = this._stack.checkHit(p, condition);
            if(target) return target;
            return this._shape.isHit(p);
        },
        
    });
    return t
}

export default GroupFactory;

