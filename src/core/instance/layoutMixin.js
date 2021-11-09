
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
        if(this._belongs) {
            this._belongs.recalculate();
        }
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