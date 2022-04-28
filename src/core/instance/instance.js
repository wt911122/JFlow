import { setUniqueId, getUniqueId } from '../utils/functions';
import { nextDirection } from '../utils/constance';
const margin = 5;
const ishitKey = Symbol('ishit');
const isInViewBox = Symbol('isInViewBox');
/**
 * @typedef Instance~Configs
 * @type {object}
 * @property {number} borderWidth      - 边的宽度 默认是 2
 * @property {string} borderColor      - 边框颜色 默认 black
 * @property {string} color            - 填充颜色 默认 white
 * @property {string} shadowColor      - 阴影颜色
 * @property {string} shadowBlur       - 阴影扩散范围
 * @property {string} shadowOffsetX    - 阴影偏移 X
 * @property {string} shadowOffsetX    - 阴影偏移 Y
 */

/** 
 * 图中的最小单元
 * @constructor Instance
 * @extends EventTarget
 * @param {Instance~Configs} configs - 最小单元的一些通用属性配置
 */
class Instance extends EventTarget{
    constructor(configs = {}) {
        super();
        Object.assign(this, configs);
        // this.anchor = configs.anchor || [0, 0];
        // this.belongs = undefined;
        /** @member {boolean}      - 元素可见 默认 true */
        this.visible = true;
        // this._jflow = undefined;
        this._belongs = undefined;
        this[ishitKey] = false; 

        /** @member {number}      - 边的宽度 默认是 0 */
        this.borderWidth =      configs.borderWidth || 0;
        /** @member {string}     - 边框颜色 默认 transparent */
        this.borderColor =      configs.borderColor || 'transparent';
        /** @member {string}     - 填充颜色 默认 transparent */
        this.backgroundColor =  configs.backgroundColor || 'transparent';
        /** @member {string}     - 阴影颜色 空就不显示阴影 */
        this.shadowColor =      configs.shadowColor;
        /** @member {string}     - 阴影扩散范围 默认 5 */
        this.shadowBlur  =      configs.shadowBlur || 5;
        /** @member {string}     - 阴影偏移 X */
        this.shadowOffsetX =    configs.shadowOffsetX || 0;
        /** @member {string}     - 阴影偏移 Y */
        this.shadowOffsetY =    configs.shadowOffsetY || 0;

    }
    /**
     * @member {boolean} - 当前单元选中状态
     */
    get _isTargeting() {
        return this === (this._jflow._target.instance || this._jflow._target.link);
    }
    /**
     * @member {boolean} - 当前单元移动状态
     */
    get _isMoving() {
        return this === this._jflow._getMovingTarget();
    }
    /**
     * @member {boolean}  - 当前单元碰撞检测状态
     */
    get _isHit() {
        return this[ishitKey];
    }
    /**
     * @member {JFlow}  - canvas上 jflow 实体
     */
    get _jflow() {
        return this._belongs.uniqueName === 'jflow' ? this._belongs : this._belongs._jflow;
    }

    set _isHit(ishit) {
        if(this[ishitKey] !== ishit) {
            /**
             * 鼠标移入事件
             *
             * @event Instance#mouseenter
             * @type {object}
             * @property {Instance} instance      - 移入的对象 
             */
            /**
             * 鼠标移出事件
             *
             * @event Instance#mouseleave
             * @type {object}
             * @property {Instance} instance      - 移入的对象 
             */
            this.dispatchEvent(new CustomEvent(ishit ? 'mouseenter': 'mouseleave' , {
                detail: {
                    instance: this,
                    jflow: this._jflow
                }
            }));
        }
        this[ishitKey] = ishit; // validation could be checked here such as only allowing non numerical values
    }

    set _isInViewBox(val) {
        const oldval = this[isInViewBox];
        if(val !== oldval) {
            if(val) {
                this.onEnterViewbox();
            } else {
                this.onLeaveViewbox();
            } 
        }    
        this[isInViewBox] = val;
    }

    /**
     * 当节点离开可视区域的回调
     */
    onEnterViewbox() {
        return;
    }

    /**
     * 当节点离开可视区域的回调
     */
    onLeaveViewbox() {
        return;
    }

    /**
     * 改变当前配置
     * @param {Configs} configs - The string containing two comma-separated numbers.
     */
    setConfig(configs) {
        Object.keys(configs).forEach(k => {
            if(configs[k] !== undefined && configs[k] !== null) {
                this[k] = configs[k]
            }
        })
    }
    /**
     * 绘制单元
     * @param {Context2d} ctx 
     */
    render(ctx) {
        throw 'require render implement'
    }
    /**
     * 判断当前单元是否被命中
     * @param {number[]} point 
     * @return {Boolean}
     */
    isHit(point) {
        throw 'require isHit implement'
    }
    /**
     * 计算当前的最大外接矩形的
     * @return {number[]} [leftx, lefty, rightx, righty]
     */
    getBoundingRect() {
        throw 'require getBoundingRect implement'
    }
    calculateIntersection() {
        throw 'require calculateIntersection implement'
    }
    /**
     * 计算当前连线接入点的位置
     * @return {Object} intersection 交叉点
     * @return {number} intersection[DIRECTION.TOP] 上
     * @return {number} intersection[DIRECTION.BOTTOM] 下
     * @return {number} intersection[DIRECTION.LEFT] 上
     * @return {number} intersection[DIRECTION.RIGHT] 右
     */
    getIntersectionsInFourDimension() {
        throw 'require getIntersectionsInFourDimension implement'
    }


    /**
     * 获取当前所在层级的坐标
     * @return {Number[]} 坐标
     */
    getCenter() {
        return this.anchor;
    }
    /**
     * 获取宽高
     * @return {Object} demension 宽高
     * @return {number} demension.width 宽
     * @return {number} demension.height 高
     */
    getBoundingDimension() {
        const rect = instance.getBoundingRect();
        let min_y = Infinity;
        let max_y = -Infinity;
        let min_x = Infinity;
        let max_x = -Infinity;
        rect.forEach(point => {
            max_y = Math.max(max_y, point[1]);
            min_y = Math.min(min_y, point[1]);
            max_x = Math.max(max_x, point[0]);
            min_x = Math.min(min_x, point[0]);
        });
        return {
            height: max_y - min_y,
            width: max_x - min_x,
        }
    }
    /**
     * 冒泡事件
     * @param {JFlowEvent} customEvent 自定义事件
     */
    bubbleEvent(customEvent){
        customEvent.detail.currentTarget = this;
        this.dispatchEvent(customEvent);
        if(customEvent.detail.bubbles){
            if(this._belongs.bubbleEvent) {
                this._belongs.bubbleEvent(customEvent);
            } else {
                this._belongs.dispatchEvent(customEvent); 
            }
            
        }
    }
    /**
     * 反算回页面的像素坐标
     * @param {Number[]} point
     * @return {Number[]} 世界坐标
     */
    calculateToRealWorld(point) {
        if(this._belongs && this._belongs.calculateToRealWorld) {
            return this._belongs.calculateToRealWorld(point);
        } else {
            return point;
        }
    }

    calculateToRealWorldWithScalar(length){
        return this._jflow.scale * length;
    }

    /**
     * 从当前布局中删除虚拟布局节点
     */
    // removeFromLayoutSource() {
    //     if(this._layoutNode) {
    //         this._layoutNode.remove();
    //     }
    // }

    recalculateUp() {
        if(this.belongs) {
            this.belongs.recalculateUp();
        }
    }

    destroy() {
        this._belongs = undefined;
        // this.removeEventListener();
    }
}

export default Instance;