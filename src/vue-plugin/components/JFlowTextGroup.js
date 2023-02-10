import { TextGroup } from '../../core/flow';
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
        },
    },
    data() {
        return {
            nodes: [],
        }
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
        source: {
            type: Object,
        },
        genVueComponentKey: {
            type: Function,
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
        source(val) {
            this._jflowInstance._jflow.setRenderNodeBySource(val, this._jflowInstance);
        }
    },
    
    created() {
        this._jflowInstance = new TextGroup(this.configs);
        this._jflowInstance.visible = this.visible;
        Object.keys(this.$listeners).map(event => {
            const func = this.$listeners[event].bind(this);
            this._jflowInstance.addEventListener(event, func);
        })
        this.addToBelongStack(this._jflowInstance, this.source);
        this.genTextElementMeta();
    },
    mounted(){
        this._jflowInstance.recalculate();
    },
    updated() {
        this._jflowInstance.recalculateUp();
    },
    destroyed() {
        this._jflowInstance.destroy();
        this.removeFromBelongStack(this._jflowInstance);
    },
    render: function (createElement) {
        if(!this.nodes.length) { 
            return createElement('jflow-group', this.$slots.default);
        } else {
            const vnodes = this.nodes.map((textElement) => {
                const { type, source } = textElement;
                if(!this.$scopedSlots[type]) {
                    if(this.$scopedSlots['jflowcommon']){
                        type = 'jflowcommon';
                    } else {
                        return
                    }
                }
                if(textElement.__vnode__) {
                    return textElement.__vnode__;
                }
                const [vnode] = this.$scopedSlots[type]({ source, textElement });
                if(this.genVueComponentKey) {
                    vnode.key = this.genVueComponentKey(source);
                }
                
                textElement.__vnode__ = vnode;
                return vnode;
            });
            return createElement('div', vnodes);
        }
    },
    methods: {
        genTextElementMeta() {
            this.nodes = this._jflowInstance._textElements.filter(elem => elem.type !== 'text');
        },
        reflow() {
            this._jflowInstance.refreshTextElements();
            this.genTextElementMeta();
            this.$nextTick(() => {
                this._jflowInstance.refresh();
            })
        },
    },
}