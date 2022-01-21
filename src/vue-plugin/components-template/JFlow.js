import JFlow from '../../core/flow';
import StackMixin from '../components/StackMixin';
/**
 * JFlow {@link JFlow} 的 vue 封装 
 * @vue-prop {JflowConfigs} configs - 传给 JFlow 的配置
 * @vue-event {drop} dropEvent - 同 JFlow 上的 {@link JFlow#event:drop} 事件
 * @vue-event {pressEnd} pressEndEvent- 同 JFlow 上的 {@link JFlow#event:pressEnd} 事件
 */
export default {
    mixins: [StackMixin],
    provide(){
        return {
            renderJFlow: this.renderJFlow,
            addNameToRootStack: this.addNameToRootStack
        }
    },
    props: {
        configs: {
            type: Object,
            default: function () {
                return {};
            },
        },
    },
    data() {
        return {
            nodes: [],
            links: [],
        }
    },
    render: function (createElement) {
        if(!this.nodes.length) {
            return createElement('div', this.$slots.default);
        } else {
            const vnodes = this.nodes.map(({ type, configs, meta }) => {
                if(!this.$scopedSlots[type]) {
                    if(this.$scopedSlots['jflowcommon']){
                        type = 'jflowcommon';
                    } else {
                        return
                    }
                }
                const [vnode] = this.$scopedSlots[type]({ configs, meta });
                meta.getJflowInstance = function() {
                    // 只支持一个元素
                    let instance = vnode.componentInstance;
                    while(instance && !instance._jflowInstance)  {
                        instance = instance.$children[0];
                    }
                    // TODO 优化下这里的逻辑
                    instance._jflowInstance._layoutNode = meta;
                    return instance._jflowInstance;
                }
                vnode.key = configs.id;
                return vnode;
            });
            const vlinks = this.links.map(meta => {
                let type = meta.type || 'plainlink'
                if(!this.$scopedSlots[type]) {
                    return null;
                }
                const [vnode] = this.$scopedSlots[type]({ configs: meta });
                vnode.key = `${meta.from}-${meta.to}-${meta.part}`
                return vnode
            })

            return createElement('div', [...vnodes, ...vlinks]);
        }
        
    },
    created() {
        this._jflowInstance = new JFlow(this.configs);
    },
    mounted() {
        console.log(this);
        // this._jflowInstance = new JFlow(this.configs);
        this.nodes = this._jflowInstance._layout.flowStack.map(meta => {
            return {
                type: meta.type,
                configs: meta.configs,
                meta: meta.layoutMeta,
            }
        });
        
        this.links = this._jflowInstance._layout.flowLinkStack.slice();
        this.$nextTick(() => {
            this._jflowInstance.$mount(this.$el);
            // this._jflowInstance.addEventListener('drop', (e) => {
            //     const astblock = e.detail.instance;
            //     const node = {
            //         type: astblock.type,
            //         configs: astblock,
            //         meta: {},
            //     };
            //     this.nodes.push(node);
            //     this.$nextTick(() => {
            //         node.meta.getJflowInstance().anchor = e.detail.point
            //         this.renderJFlow();
            //     })
            // })
        });
        Object.keys(this.$listeners).map(event => {
            console.log(event)
            const func = this.$listeners[event].bind(this);
            this._jflowInstance.addEventListener(event, func);
        })
    },
    
    methods: {
        /**
         * 绘制之前，vnode渲染之后
         * @name preCallback
         * @function
         */
        /**
         * 重排
         * @param {preCallback} preCallback - JFlow 绘制之前，vnode渲染之后
         */
        reflow(preCallback) {
            const layoutNodes = this._jflowInstance._layout.flowStack.map(meta => {
                return {
                    type: meta.type,
                    configs: meta.configs,
                    meta: meta.layoutMeta,
                }
            });
            /* no free Nodes
            const freeNodes = []
            this.nodes.forEach(n => {
                if(!layoutNodes.find(ln => ln.configs.id === n.configs.id)){
                    freeNodes.push(n)
                }
            })
            this.nodes = layoutNodes.concat(freeNodes);
            */
            this.nodes = layoutNodes;
            this.links = this._jflowInstance._layout.flowLinkStack.slice();
            this.$nextTick(() => {
                if(preCallback) {
                    preCallback();
                }
                this._jflowInstance.recalculate();
                this._jflowInstance._render();
                console.log(this.nodes);
                console.log(this._jflowInstance.bounding_box)
            })
        },
        /**
         * 获取单签 JFlow 实例
         * @return {Jflow} - JFlow对象
         */
        getInstance() {
            return this._jflowInstance;
        },
        /**
         * 手动触发绘制
         */
        renderJFlow() {
            this._jflowInstance._render();
        },
        addNameToRootStack(instance, jflowId) {
             this.stack.push({
                jflowId,
                instance,
            });
        }
    }
}