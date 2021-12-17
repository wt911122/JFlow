import { Group } from '../../core/flow';
import StackMixin from './StackMixin';
/**
 * JFlow {@link Group} 的 vue 封装 
 * @vue-prop {GroupConfigs} configs - 传给 Group 的配置
 * @vue-event {drop} dropEvent -  {@link Group#event:drop} 事件
 * @vue-event {pressEnd} pressEndEvent - {@link Group#event:pressEnd} 事件
 * @vue-event {click} click - {@link Group#event:click} 事件
 * @vue-event {pressStart} pressStartEvent - {@link Group#event:pressStart} 事件
 */
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
        this._jflowInstance =  new Group(this.configs);
        Object.keys(this.$listeners).map(event => {
            const func = this.$listeners[event].bind(this);
            this._jflowInstance.addEventListener(event, func);
        })
        // console.log(this.name, this.)
        this.addToBelongStack(this._jflowInstance, this.name);
        this.addNameToRootStack(this._jflowInstance, this.name);
    },
    mounted(){
        this._jflowInstance.recalculate();
    },
    destroyed() {
        this.removeFromBelongStack(this._jflowInstance);
    },
}