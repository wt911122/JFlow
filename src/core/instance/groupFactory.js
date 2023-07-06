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
        const mx = (margin.left - margin.right)/2;
        const my = (margin.top - margin.bottom)/2;
        const centerX = (padding.left - padding.right)/2 + mx;
        const centerY = (padding.top - padding.bottom)/2 + my;
        this._shape.anchor = [anchor[0] + mx, anchor[1] + my];
        return [anchor[0] + centerX, anchor[1] + centerY];
    },
    setAnchorX(x) {
        this.anchor[0] = x;
        this._getCenter(); 
    },
    setAnchorY(y) {
        this.anchor[1] = y;
        this._getCenter(); 
    },
    setAnchor(x, y) {
        this.anchor[0] = x;
        this.anchor[1] = y;
        this._getCenter(); 
    },
    _calculatePointBack(point) {
        const [gx, gy] = point;
        const [cx, cy] = this._getCenter(); 
        const p = [gx - cx, gy - cy]
        return p
    },
    _calculatePointBackWithPoint(a, b, arr, idx1, idx2) {
        const anchor = this.anchor;
        const padding = this.padding;
        const margin = this.margin;
        arr[idx1] = a - ( anchor[0] + (padding.left - padding.right)/2 + (margin.left - margin.right)/2 );
        arr[idx2] = b - ( anchor[1] + (padding.top - padding.bottom)/2 + (margin.top - margin.bottom)/2 );
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
        const p = [gx + cx, gy + cy]
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
        t.visible = this.visible;
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
        const br = this._boundingrect;
        br[0] = ltx;
        br[1] = lty;
        br[2] = rbx;
        br[3] = rby;
        return br
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
    },
    calculateIntersection(point) {
        const [x1, y1] = point;
        const [x2, y2] = this.anchor;
        const w = this.width/2;
        const h = this.height/2;
        const vecx = x2 - x1;
        const vecy = y2 - y1;
        const theta1 = h/w;
        const theta2 = Math.abs(vecy/vecx);
        const dirx = x1 > x2;
        const diry = y1 > y2;
        let x, y;
        if(theta2 < theta1) {
            x = x2 + (dirx?w:-w);
            y = w * (diry?theta2:-theta2) + y2;
        } else {
            y = y2 + (diry?h:-h);
            x = h / (dirx?theta2:-theta2) + x2;
        }
        return [x, y];
    },
    onEnterViewbox() {
        this.interateNodeStack((instance) => {
            instance.onEnterViewbox();
        })
    },
    onLeaveViewbox() {
        this.interateNodeStack((instance) => {
            instance.onLeaveViewbox();
        })
    },
    destroy() {
        this._shape.destroy();
        this.interateNodeStack((instance) => {
            instance.destroy();
        })
    }, 
}

function defaultShift(width, height) {
    return [width, height];
}

/**
 * 根据paddingbox宽高来计算shapeshiftbox的宽高
 * @function shapeShift
 * @param {number} width            - paddingBox宽
 * @param {number} height           - paddingBox高
 * @return {number[]}
 */

/**
 * 组工厂函数，用于通过JFlow 绘图节点来创建不同的组
 * @global 
 * @function GroupFactory
 * @param {Node} jflowNodeConstructor - 绘图节点构造器
 * @param {object} options            - 配置项
 * @param {shapeShift} options.shapeShift - shift层适配方法
 * @return {Group} - 绘图节点构造器
 */
function GroupFactory(jflowNodeConstructor, options = {}) {
    const shapeShift = typeof options.shapeShift === 'function' ? options.shapeShift : defaultShift;

    /**
     * Group 配置
     * @typedef {Object} GroupTemplate~GroupConfigs
     * @property {number} width             - 设定宽度
     * @property {number} minWidth          - 最小宽度
     * @property {number} height            - 设定高度
     * @property {number} padding          - 内边距
     * @property {number} paddingTop          - 内上边距
     * @property {number} paddingRight         - 内右边距
     * @property {number} paddingBottom        - 内下边距
     * @property {number} paddingLeft          - 内左边距
     * @property {number} margin            - 外边距
     * @property {number} marginTop          - 外上边距
     * @property {number} marginRight         - 外右边距
     * @property {number} marginBottom        - 外下边距
     * @property {number} marginLeft          - 外左边距
     * @property {boolean} lock            - 布局锁定状态 默认 true
     */
    class t extends Node {
        /**
        * @constructs GroupTemplate
        * @param {GroupTemplate~GroupConfigs} configs - 组配置
        * @mixes LayoutMixin
        * @mixes StackMixin 
        */
        constructor(configs) {
            super(configs);
            this.initStack(configs);
            this.initLayout(configs);
            /** @member {Node}      - 壳绘图单元 */
            this._shape = new jflowNodeConstructor(configs);
            this._shape.anchor = [0, 0];
            this._shape._belongs = this;
            this._setPadding(configs);
            this._setMargin(configs);  
            /** @member {Number}      - 设定宽度 */
            this.definedWidth =     configs.width;
            /** @member {Number}      - 最小宽度 */
            this.minWidth =         configs.minWidth;
            /** @member {Number}      - 设定的高度 */
            this.definedHeight =    configs.height;
            /** @member {Boolean}      - 组内元素是否锁定， 默认true */
            this.lock =             configs.lock ?? true ;
            this.display =          configs.display || 'default';
            /** @member {Boolean}      - 组本身是否进入形状判定范围 */
            this.transparent =      configs.transparent ?? false;
            this._getBoundingGroupRect();
            this.reflow();
            this._getBoundingGroupRect();  
            this._cacheViewBox = [];
        }
    }
    Object.assign(t.prototype, GroupMixin);
    Object.assign(t.prototype, { 
        reflow() {
            GroupMixin.reflow.call(this);
            const margin = this.margin;
            const [shapeWidth, shapeHeight] = shapeShift(
                    this.width - margin.left - margin.right,
                    this.height - margin.top - margin.bottom, this._shape);
            this._shape.width = shapeWidth;
            this._shape.height = shapeHeight;
        },
        setConfig(configs) {
            this._shape.setConfig(configs);
            this._setPadding(configs);
            this._setMargin(configs);  
            if('opacity' in configs) {
                this.opacity = configs.opacity
            }
            
            if(configs.layout && this._layout !== configs.layout) {
                this._layout = configs.layout;
            }
        },
        _getBoundingGroupRect() {
            const points = this._stack.getBoundingRectPoints();
            // content box 
            const bbox = bounding_box(points);

             // padding box 
            const padding = this.padding;
            const minWidth = this.minWidth// - padding.left - padding.right;
            const definedWidth = this.definedWidth// - padding.left - padding.right;
            const w = bbox.width + padding.left + padding.right;
            const h = bbox.height + padding.top + padding.bottom;
            const paddingWidth = minWidth ? Math.max(minWidth, w) : definedWidth || w;
            const paddingHeight = this.definedHeight || h;
            this._paddingWidth = paddingWidth;
            this._paddingHeight = paddingHeight;

            // shapeBox
            const [shapeWidth, shapeHeight] = shapeShift(paddingWidth, paddingHeight, this._shape)
            this._shape.width = shapeWidth;
            this._shape.height = shapeHeight;
            // marginBox
            const margin = this.margin;
            this.width = shapeWidth + margin.left + margin.right;
            this.height = shapeHeight + margin.top + margin.bottom;
        },

        _getViewBox() {
            const belongs_vbox = this._belongs.getCacheViewBox();
            const cacheViewBox = this._cacheViewBox;
            
            this._calculatePointBackWithPoint(belongs_vbox[0], belongs_vbox[1], cacheViewBox, 0, 1);
            this._calculatePointBackWithPoint(belongs_vbox[2], belongs_vbox[3], cacheViewBox, 2, 3);
            return this._cacheViewBox;
        },
        getCacheViewBox() {
            return this._cacheViewBox;
        },

        // beforeRender() {
        //     return doOverlap(this._belongs.getCacheViewBox(), this._boundingrect)
        // },
        
        render(ctx) {
            ctx.save();
            if(this._isMoving){
                ctx.globalAlpha = 0.6
            } else if(this.opacity !== 1) {
                ctx.globalAlpha = this.opacity;
            }
            const [cx, cy] = this._getCenter(); 
            this._shape.render(ctx);
            ctx.translate(cx, cy);
            this._stack.render(ctx);
            // this._linkStack.render(ctx);    
            ctx.translate(-cx, -cy);
            ctx.restore();

            // ctx.save();
            // ctx.beginPath();
            // ctx.arc(cx, cy, 5, 0, Math.PI*2);
            // ctx.fillStyle = 'rgb(0,0,0)'
            // ctx.fill();
            // ctx.restore();
        },
        isHit(point, condition) {
            const p = this._calculatePointBack(point);
            this._currentp = p; // 暂存，为了后续计算别的位置
            const target = this._stack.checkHit(p, condition);
            if(target) return target;
            if(!this.transparent) {
                return this._shape.isHit(point);
            }
            return false;
        },    
        /* renderCache(ctx) {
            const rect = this.getBoundingRect();
            const [a, b] = this._belongs.calculateToRealWorld([rect[0], rect[1]]);
            const [c, d] = this._belongs.calculateToRealWorld([rect[2], rect[3]]);
            ctx.putImageData(this._cached, a, b, 0, 0, c-a, d-b)
        },
        cache(ctx) {
            const rect = this.getBoundingRect();
            const [a, b] = this._belongs.calculateToRealWorld([rect[0], rect[1]]);
            const [c, d] = this._belongs.calculateToRealWorld([rect[2], rect[3]]);
            console.log(a, b, c-a ,d-b);
            this._cached = ctx.getImageData(a, b, c-a, d-b)
        }  */  
    });
    return t
}

export default GroupFactory;

