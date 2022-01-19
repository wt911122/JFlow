export default {
    provide(){
        return {
            addToStack: this.addToStack,
            addToLinkStack: this.addToLinkStack,
            removeFromStack: this.removeFromStack,
            removeFromLinkStack: this.removeFromLinkStack,
            getInstanceByJFlowId: this.getInstanceByJFlowId,
        }
    },
    data() {
        return {
            stack: [], // 主要是为了连线
        }
    },
    methods: {
        getInstanceByJFlowId(jflowId) {
            const obj = this.stack.find(i => i.jflowId === jflowId);
            if(obj) {
                return obj.instance;
            }
            return null;
        },
        addToStack(instance, jflowId) {
            this._jflowInstance.addToStack(instance);
            if(!jflowId) return;
            this.stack.push({
                jflowId,
                instance,
            });
            // this.$nextTick(this.onStackChangeHandler)
        },
        addToLinkStack(link) {
            this._jflowInstance.addToLinkStack(link);
            // this.$nextTick(this.onStackChangeHandler)
        },
        removeFromStack(instance) {
            this._jflowInstance.removeFromStack(instance);
            // this.$nextTick(this.onStackChangeHandler)
        },
        removeFromLinkStack(link) {
            this._jflowInstance.removeFromLinkStack(link);
            // this.$nextTick(this.onStackChangeHandler)
        },
        onStackChangeHandler() {
            this._jflowInstance.recalculate();
            this._jflowInstance.reflow();
            // this.$nextTick(this.renderJFlow)
        }
    }
}