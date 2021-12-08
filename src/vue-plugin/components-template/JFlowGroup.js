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
        },
        renderJFlow: {
            from: 'renderJFlow',
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
    },
     watch: {
        configs(val, oldVal) {
            if(JSON.stringify(val) === JSON.stringify(oldVal)){
                return;
            }
            this._jflowInstance.setConfig(val);
        },
        '$listeners' (val, oldVal) {
            let news = [];
            let deletes = [];
            const vnew = Object.keys(val).map(e => ({ event: e, handler: val[e] }));
            const vold = Object.keys(oldVal).map(e => ({ event: e, handler: oldVal[e] }));
            vnew.forEach((v) => {
                const hnew = v.handler;
                if(!vold.find((q) => q.handler === hnew)) {
                    news.push(v);
                }
            });
            vold.forEach((v) => {
                const hold = v.handler;
                if(!vnew.find((q) => q.handler === hold)) {
                    deletes.push(v);
                }
            });

            news.forEach((v) => {
                this._jflowInstance.addEventListener(v.event, v.handler);
            });
            deletes.forEach((v) => {
                this._jflowInstance.removeEventListener(v.event, v.handler);
            });
        }
    },
    created() {
        this._jflowInstance = new Group(this.configs);
        Object.keys(this.$listeners).map(event => {
            const func = this.$listeners[event].bind(this);
            this._jflowInstance.addEventListener(event, func);
        })
        this.addToBelongStack(this._jflowInstance);
    },
    destroyed() {
        this.removeFromBelongStack(this._jflowInstance);
    },
}