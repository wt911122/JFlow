import { setUniqueId, getUniqueId } from '../utils/functions';
import { nextDirection } from '../utils/constance';
const margin = 5;
const ishitKey = Symbol('ishit');
/**
 * @typedef Configs
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
 */

/** 图中的最小单元 */
class Instance extends EventTarget{
    /**
     * 创建一个最小单元.
     * @param {Configs} configs - 最小单元的一些通用属性配置
     */
    constructor(configs = {}) {
        super();
        Object.assign(this, configs);
        // this.anchor = configs.anchor || [0, 0];
        // this.belongs = undefined;
        this.visible = true;
        this.status = {
            hover: false,
            focus: false,
            moving: false,
        }
        // this._jflow = undefined;
        this._belongs = undefined;
        this[ishitKey] = false; 

        /** layout 抽象节点关联属性 */
        this._layoutNode = undefined;

        /**
         * 通用样式属性
         * @property {number} borderWidth      - 边的宽度 默认是 2
         * @property {string} borderColor      - 边的颜色 默认 black
         * @property {string} hoverStyle       - 悬停颜色 默认 transparent
         * @property {string} content          - 内容
         * @property {string} color            - 填充颜色 默认 white
         * @property {string} fontFamily       - 字体 默认 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji
         * @property {string} fontSize         - 字体大小 默认 28px
         * @property {string} textColor        - 字体颜色 默认 white
         * @property {string} textAlign        - 字体左右对齐 默认 center
         * @property {string} textBaseline     - 字体垂直对齐 默认 center
         */
        this.borderWidth =      configs.borderWidth !== undefined ? configs.borderWidth : 2;
        this.borderColor =      configs.borderColor;
        this.hoverStyle =       configs.hoverStyle || 'transparent';
        this.content =          configs.content || '';
        this.color =            configs.color || 'white';
        this.strokeColor =      configs.strokeColor || 'white';
        this.fontFamily =       configs.fontFamily = '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji'
        this.fontSize =         configs.fontSize || '28px';
        this.textColor =        configs.textColor || 'white';
        this.textAlign =        configs.textAlign || 'center';
        this.textBaseline =     configs.textBaseline || 'middle';
    }
    /**
     * @property {boolean} _isTargeting - 当前单元选中状态
     */
    get _isTargeting() {
        return this === (this._jflow._target.instance || this._jflow._target.link);
    }
    /**
     * @property {boolean} _isMoving - 当前单元移动状态
     */
    get _isMoving() {
        return this === this._jflow._getMovingTarget();
    }
    /**
     * @property {boolean} _isHit  - 当前单元碰撞检测状态
     */
    get _isHit() {
        return this[ishitKey];
    }
    /**
     * @property {JFlow} _jflow -     * canvas上 jflow 实体
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
                }
            }));
        }
        this[ishitKey] = ishit; // validation could be checked here such as only allowing non numerical values
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
     * @return {number[][]} [lefttop: [number,number], rightbottom: [number, number]]
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
     * 事件冒泡
     * @param {JFlowEvent} customEvent 自定义事件
     */
    bubbleEvent(customEvent){
        this.dispatchEvent(customEvent);
        console.log(customEvent)
        if(customEvent.detail.bubbles && this._belongs.bubbleEvent){
            console.log(customEvent.type)
            this._belongs.bubbleEvent(customEvent);
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
    removeFromLayoutSource() {
        if(this._layoutNode) {
            this._layoutNode.remove();
        }
    }
}

export default Instance;