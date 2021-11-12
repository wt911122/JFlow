import { Group } from '../../core/flow';
import StackMixin from './StackMixin';
export default {
    mixins: [StackMixin],
    inject: {
        addToBelongStack: {
            from: 'addToStack',
        },
        removeFromBelongStack: {
            from: 'removeFromStack',
        }
    },
    render: function (createElement) {
        return createElement('template', this.$slots.default);
    },
    props: {
        configs: {
            type: Object,
            default: function () {
                return {};
            },
        },
        name: {
            type: String,
        }
    },
     watch: {
        configs(val, oldVal) {
            if(JSON.stringify(val) === JSON.stringify(oldVal)){
                return;
            }
            this._jflowInstance.setConfig(val);
        }
    },
    created() {
        this._jflowInstance =  new Group(this.configs);
        Object.keys(this.$listeners).map(event => {
            const func = this.$listeners[event].bind(this);
            this._jflowInstance.addEventListener(event, func);
        })
        this.addToBelongStack(this._jflowInstance, this.name);
    },
    destroyed() {
        this.removeFromBelongStack(this._jflowInstance);
    },
}