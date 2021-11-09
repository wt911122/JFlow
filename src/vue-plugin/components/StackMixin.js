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
        },
        addToLinkStack(link) {
            this._jflowInstance.addToLinkStack(link);
        },
        removeFromStack(instance) {
            this._jflowInstance.removeFromStack(instance);
        },
        removeFromLinkStack(link) {
            this._jflowInstance.removeFromLinkStack(link);
        }
    }
}