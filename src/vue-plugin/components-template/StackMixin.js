export default {
    provide(){
        return {
            addToStack: this.addToStack,
            removeFromStack: this.removeFromStack,
        }
    },
    methods: {
        addToStack(instance) {
            this._jflowInstance.addToStack(instance);
            // this.$nextTick(this.onStackChangeHandler)
        },
        removeFromStack(instance) {
            this._jflowInstance.removeFromStack(instance);
            // this.$nextTick(this.onStackChangeHandler)
        },
        onStackChangeHandler() {
            this._jflowInstance.recalculate();
            this._jflowInstance.reflow();
            this.$nextTick(this.renderJFlow)
        }
    }
}