/**
 * 布局 mixin 用于注册和方便控制布局
 *
 * @mixin
 */
const LayoutMixin = {
    _layout: null,
    _reflowed: false,
    /**
     * 初始化布局
     * @param {JflowConfigs} configs - 配置
     */
    initLayout(configs) {
        this._layout = configs.layout;
    },
    recalculateUp() {
        this.recalculate();
        if(this._belongs) {
            this._belongs.recalculateUp();
        }
    },
    /**
     * 重新计算布局，相当于浏览器里面重排，并重算当前布局下的最小外接矩形
     */
    recalculate() {
        this._reflowed = true;
        this.reflow();
        if(this._getBoundingGroupRect){
            this._getBoundingGroupRect();
        }
        // 这个地方到底是手动还是自动？自动时机再试试看好了
        // if(this._belongs) {
        //     this._belongs.recalculate();
        // }
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
    }
}

export default LayoutMixin;