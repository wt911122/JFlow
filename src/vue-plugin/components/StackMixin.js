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
        addToLinkStack(link, source) {
            this._jflowInstance.addToLinkStack(link);
            if(source) {
                link._jflow.addLinkNodeBySource(source, link);
            }
        },
        removeFromStack(instance) {
            this._jflowInstance.removeFromStack(instance);
        },
        removeFromLinkStack(link, source) {
            this._jflowInstance.removeFromLinkStack(link);
            if(source) {
                link._jflow.addLinkNodeBySource(source, link);
            }
        },
        onStackChangeHandler() {
            this._jflowInstance.recalculate();
            this._jflowInstance.reflow();
        }
    }
}