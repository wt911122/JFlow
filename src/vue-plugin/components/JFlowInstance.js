import * as JFlowInstance from '../../core/flow';
import diff from 'object-diff';
export default function (nameNode) {
    const bulder =  typeof nameNode === 'string' 
        ? JFlowInstance[nameNode] 
        : nameNode;
    /**
     * JFlow {@link Node} 的 vue 封装 
     * @module JFlowNode
     *
     * @vue-prop {Configs} configs - 传给 Instance 的配置
     * @vue-event {drop} dropEvent -  {@link Node#event:drop} 事件
     * @vue-event {click} click - {@link Node#event:click} 事件
     * @vue-event {pressStart} pressStartEvent - {@link Node#event:pressStart} 事件
     * @vue-event {pressEnd} pressEndEvent - {@link Node#event:pressEnd} 事件
     */
    return {
        inject: ['addToStack', 'removeFromStack','addNameToRootStack'],
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
                const diffed = diff(val, oldVal);
                const reflowKeys = Object.keys(diffed).filter(k => {
                    const lk = k.toLowerCase();
                    return !(lk.endsWith('color') || k.endsWith('style'));
                });
                this._jflowInstance.setConfig(val);
                console.log(reflowKeys.length, val)
                if(reflowKeys.length) {
                    this._jflowInstance._belongs.recalculateUp();
                } 
                this._jflowInstance._jflow._render();
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
        render: function (createElement) {
            return null;
        },
        created() { 
            this._jflowInstance =  new bulder(this.configs);
            this.bindListeners();
            this.addToStack(this._jflowInstance, this.name);
        },
        destroyed() {
            this.removeFromStack(this._jflowInstance);
        },
        methods: {
            bindListeners() {
                Object.keys(this.$listeners).map(event => {
                    const func = this.$listeners[event];
                    this._jflowInstance.addEventListener(event, func);
                })
            }
        }
    }
}