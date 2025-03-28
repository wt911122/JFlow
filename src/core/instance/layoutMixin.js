/**
 * Layout mixin 配置
 * @typedef {Object} LayoutMixin~LayoutConfigs
 * @property {Layout} layout             - 布局对象 
 */
/**
 * 布局 mixin 用于注册和方便控制布局
 *
 * @mixin
 */
const LayoutMixin = {
    /** @property {Layout}      - 布局对象 */
    _layout: null,
    /**
     * 初始化布局
     * @param {LayoutMixin~LayoutConfigs} configs - 配置
     */
    initLayout(configs = {}) {
        this._layout = configs.layout;
    },
    /**
     * 从当前层出发，向上层递归重排
     */
    recalculateUp() {
        // console.log('----recalculateUp----')
        let dirty = true;
        if(this.getBoundingDimension) {
            const { width: wold, height: hold } = this.getBoundingDimension();
            if(this.resetChildrenPosition) {
                this.resetChildrenPosition();
            }
            if(this._getBoundingGroupRect){
                this._getBoundingGroupRect();
            }
            this.reflow();
            if(this._getBoundingGroupRect){
                this._getBoundingGroupRect();
            }
            const { width: wnow, height: hnow } = this.getBoundingDimension();
            dirty = (wold !== wnow || hold !== hnow)
        } else {
            this.reflow();
        }
        if(this._belongs && dirty) {
            this._belongs.recalculateUp();
        }
        if(!dirty || this._belongs?.uniqueName === 'jflow') {
            this.recalculateDown();
        }
    },
    recalculateDown() {
        if(this._layout && this._layout.reflowAfter) {
            this._layout.reflowAfter(this);
        }
        this._stack.forEach(instance => {
            if(instance.recalculateDown) {
                instance.recalculateDown();
            }
        })
    },
    /**
     * 重新计算布局，相当于浏览器里面重排，并重算当前布局下的最小外接矩形
     */
    recalculate() {
        // console.log('----recalculate----')
        this.reflow();
        if(this._getBoundingGroupRect){
            this._getBoundingGroupRect();
        }
    },
    /**
     * 布局静态检查
     * @param {Instance} instance - 检查单元
     * @return {Boolean} - 检查结果 
     */
    staticCheck(instance) {
        if(this._layout) {
            return this._layout.staticCheck(instance, this);
        }
        return false;
    },
    /**
     * 重新计算布局，相当于浏览器里面重排
     */
    reflow() {
        if(this._layout) {
            this._layout.reflow(this);
        }
    },
}

export default LayoutMixin;