
const LayoutMixin = {
    _layout: null,
    _reflowed: false,
    initLayout(configs) {
        this._layout = configs.layout;
    },
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
    staticCheck(instance) {
        if(this._layout) {
            return this._layout.staticCheck(instance, this);
        }
        return false;
    },
    reflow() {
        if(this._layout) {
            this._layout.reflow(this);
        }
    }
}

export default LayoutMixin;