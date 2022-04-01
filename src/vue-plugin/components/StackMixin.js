export default {
    provide(){
        return {
            addToStack: this.addToStack,
            addToLinkStack: this.addToLinkStack,
            removeFromStack: this.removeFromStack,
            removeFromLinkStack: this.removeFromLinkStack,
        }
    },
    data() {
        return {
            stack: [], // 主要是为了连线
        }
    },
    methods: {
        addToStack(instance, source) {
            this._jflowInstance.addToStack(instance);
            if(source) {
                instance._jflow.setRenderNodeBySource(source, instance)
            }
        },
        addToLinkStack(link) {
            this._jflowInstance.addToLinkStack(link);
        },
        removeFromStack(instance) {
            this._jflowInstance.removeFromStack(instance);
        },
        removeFromLinkStack(link) {
            this._jflowInstance.removeFromLinkStack(link);
        },
        onStackChangeHandler() {
            this._jflowInstance.recalculate();
            this._jflowInstance.reflow();
        }
    }
}