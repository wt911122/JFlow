export default {
    provide(){
        return {
            addToStack: this.addToStack,
            // addToLinkStack: this.addToLinkStack,
            removeFromStack: this.removeFromStack,
            // removeFromLinkStack: this.removeFromLinkStack,
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
        // addToLinkStack(link, sourceFrom, sourceTo) {
        //     this._jflowInstance.addToLinkStack(link);
        //     if(sourceFrom && sourceTo) {
        //         link._jflow.addLinkNodeBySource(sourceFrom, sourceTo, link);
        //     }
        // },
        removeFromStack(instance) {
            this._jflowInstance.removeFromStack(instance);
        },
        // removeFromLinkStack(link, sourceFrom, sourceTo) {
        //     this._jflowInstance.removeFromLinkStack(link);
        //     if(sourceFrom && sourceTo) {
        //         link._jflow.removeLinkNodeBySource(sourceFrom, sourceTo, link);
        //     }
        // },
        onStackChangeHandler() {
            this._jflowInstance.recalculate();
            this._jflowInstance.reflow();
        }
    }
}