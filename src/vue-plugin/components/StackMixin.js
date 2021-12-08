export default {
    provide(){
        return {
            addToStack: this.addToStack,
            addToLinkStack: this.addToLinkStack,
            removeFromStack: this.removeFromStack,
            removeFromLinkStack: this.removeFromLinkStack,
            getInstanceByName: this.getInstanceByName,
        }
    },
    data() {
        return {
            stack: [],
        }
    },
    // mounted() {
    //     this._jflowInstance.recalculate();
    //     this._jflowInstance.reflow();
    // },
    methods: {
        getInstanceByName(name) {
            const obj = this.stack.find(i => i.name === name);
            if(obj) {
                return obj.instance;
            }
            return null;
        },
        addToStack(instance, name) {
            this._jflowInstance.addToStack(instance);
            this.stack.push({
                name,
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