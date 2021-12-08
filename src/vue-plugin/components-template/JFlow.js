import JFlow from '../../core/flow';
import StackMixin from '../components/StackMixin';
export default {
    mixins: [StackMixin],
    provide(){
        return {
            renderJFlow: this.renderJFlow,
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
            return createElement('div');
        } else {
            const vnodes = this.nodes.map(({ type, configs, meta }) => {
                console.log(this.$scopedSlots[type])
                if(!this.$scopedSlots[type]) {
                    return
                }
                const [vnode] = this.$scopedSlots[type]({ configs });
                if(meta) {
                    meta.getJflowInstance = function() {
                        // 只支持一个元素
                        let instance = vnode.componentInstance;
                        while(instance && !instance._jflowInstance)  {
                            instance = instance.$children[0];
                        }
                        return instance._jflowInstance;
                    }
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
                vnode.key = `${meta.from}-${meta.to}`
                return vnode
            })
            return createElement('div', [...vnodes, ...vlinks]);
        }
        
    },
    created() {
        // console.log(this);
        // this._jflowInstance = new JFlow(this.configs);
        // debugger
        // Object.keys(this.$listeners).map(event => {
        //     const func = this.$listeners[event].bind(this);
        //     this._jflowInstance.addEventListener(event, func);
        // })
    },
    mounted() {
        console.log(this);
        this._jflowInstance = new JFlow(this.configs);
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
            this._jflowInstance.addEventListener('drop', (e) => {
                const astblock = e.detail.instance;
                this.nodes.push({
                    type: astblock.type,
                    configs: {
                        ...astblock,  
                        initialAnchor: e.detail.point,
                    },
                    meta: null,
                });
                this.$nextTick(() => {
                    console.log(JSON.stringify(this._jflowInstance.bounding_box));
                    this._jflowInstance._getBoundingGroupRect();
                    console.log(JSON.stringify(this._jflowInstance.bounding_box));
                    this.renderJFlow();
                })
            })
        });
        Object.keys(this.$listeners).map(event => {
            console.log(event)
            const func = this.$listeners[event].bind(this);
            this._jflowInstance.addEventListener(event, func);
        })
    },
    
    methods: {
        reflow() {
            const layoutNodes = this._jflowInstance._layout.flowStack.map(meta => {
                return {
                    type: meta.type,
                    configs: meta.configs,
                    meta: meta.layoutMeta,
                }
            });
            const freeNodes = []
            this.nodes.forEach(n => {
                if(!layoutNodes.find(ln => ln.configs.id === n.configs.id)){
                    debugger
                    freeNodes.push(n)
                }
            })
            this.nodes = layoutNodes.concat(freeNodes);
            
            this.links = this._jflowInstance._layout.flowLinkStack.slice();
            this.$nextTick(() => {
                this._jflowInstance.recalculate();
                this._jflowInstance._render();
            })
        },
        getInstance() {
            return this._jflowInstance;
        },
        renderJFlow() {
            this._jflowInstance._render();
        }
    }
}