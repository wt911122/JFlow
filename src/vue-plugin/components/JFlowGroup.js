import * as JFlowInstance from '../../core/flow';
import StackMixin from './StackMixin';
export default function (nameNode) {
    const builder =  typeof nameNode === 'string'
        ? JFlowInstance[nameNode]
        : nameNode;
    return {
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
            },
            addNameToRootStack: {
                from: 'addNameToRootStack',
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
            visible: {
                type: Boolean,
                default: true,
            },
            jflowId: {
                type: String,
            }
        },
        watch: {
            configs(val, oldVal) {
                if(JSON.stringify(val) === JSON.stringify(oldVal)){
                    return;
                }
                this._jflowInstance.setConfig(val);
                // this._jflowInstance._jflow._render();
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
            },
            visible(val) {
                this._jflowInstance.visible = val;
                // this._jflowInstance._belongs.recalculateUp();
                // this._jflowInstance._jflow._render();
            },
        },
        created() {
            this._jflowInstance =  new builder(this.configs);
            this._jflowInstance.visible = this.visible;
            Object.keys(this.$listeners).map(event => {
                const func = this.$listeners[event].bind(this);
                this._jflowInstance.addEventListener(event, func);
            })
            // console.log(this.name, this.)
            this.addToBelongStack(this._jflowInstance, this.jflowId);
            this.addNameToRootStack(this._jflowInstance, this.jflowId);
        },
        mounted(){
            this._jflowInstance.recalculate();
        },
        updated() {
            this._jflowInstance.recalculateUp();
        },
        destroyed() {
            this.removeFromBelongStack(this._jflowInstance);
        },
    }
}