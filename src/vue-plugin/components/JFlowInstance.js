import * as JFlowInstance from '../../core/flow';
import diff from 'object-diff';
export default function (nameNode) {
    const bulder =  typeof nameNode === 'string' 
        ? JFlowInstance[nameNode] 
        : nameNode;
    return {
        inject: ['addToStack', 'removeFromStack',],
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
                const diffed = diff(val, oldVal);
                const reflowKeys = Object.keys(diffed).filter(k => {
                    const lk = k.toLowerCase();
                    return !(lk.endsWith('color') || k.endsWith('style'));
                });
                this._jflowInstance.setConfig(val);
                if(reflowKeys.length) {
                    this._jflowInstance.recalculate();
                } 
                this._jflowInstance._jflow._render();
            }
        },
        render: function (createElement) {
            return null;
        },
        created() {    
            this._jflowInstance =  new bulder(this.configs);
            Object.keys(this.$listeners).map(event => {
                const func = this.$listeners[event].bind(this);
                this._jflowInstance.addEventListener(event, func);
            })
            this.addToStack(this._jflowInstance, this.name);
        },
        destroyed() {
            this.removeFromStack(this._jflowInstance);
        }
    }
}