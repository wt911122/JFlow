import JFlow from '../../core/flow';
import StackMixin from './StackMixin';
/**
 * typs#slot 中的属性 
 * @typedef {Object} j-jflow-Node
 * @property {string}       type   - 布局节点类型
 * @property {Object}       configs  - 源数据
 * @property {LayoutNode}   meta   - 布局节点
 */
/**
 * JFlow {@link JFlow} 的 vue 封装 
 * @module j-jflow
 * @property {JFlow~JFlowConfigs} configs - 传给 JFlow 的配置
 * @property {Boolean} loading            - 初始渲染状态，支持 sync
 */
export default {
    mixins: [StackMixin],
    provide(){
        return {
            renderJFlow: this.renderJFlow,
            getJFlow: this.getInstance,
        }
    },
    props: {
        configs: {
            type: Object,
            default: function () {
                return {};
            },
        },
        loading: Boolean,
        genVueComponentKey: {
            type: Function,
        }
    },
    data() {
        return {
            // nodes: [],
            // links: [],
            renderNodes: [],
            renderLinks: [],
        }
    },
    render: function (createElement) {
        if(!this.renderNodes.length) {
            return createElement('div', this.$slots.default);
        } else {
            const vnodes = this.renderNodes.map(({ type, source, layoutNode }) => {
                if(!this.$scopedSlots[type]) {
                    if(this.$scopedSlots['jflowcommon']){
                        type = 'jflowcommon';
                    } else {
                        return
                    }
                }
                if(layoutNode.__vnode__) {
                    return layoutNode.__vnode__;
                }
                const [vnode] = this.$scopedSlots[type]({ source, layoutNode });
                if(this.genVueComponentKey) {
                    vnode.key = this.genVueComponentKey(source);
                }
                
                layoutNode.__vnode__ = vnode;
                return vnode;
            });
            const vlinks = this.renderLinks.map(meta => {
                let type = meta.type || 'plainlink'
                if(!this.$scopedSlots[type]) {
                    return null;
                }
                if(meta.__vnode__) {
                    return meta.__vnode__;
                }
                const [vnode] = this.$scopedSlots[type]({ configs: meta });
                if(this.genVueComponentKey) {
                    const k1 = this.genVueComponentKey(meta.from.source);
                    const k2 = this.genVueComponentKey(meta.to.source);
                    const k3 = meta.part;
                    vnode.key = `${k1}-${k2}-${k3}`
                }
                meta.__vnode__ = vnode;
                return vnode
            })

            return createElement('div', [...vnodes, ...vlinks]);
        }
        
    },
    created() {
        this._jflowInstance = new JFlow(this.configs);
        this.genNodeLinkMeta();
        this.loadingNodes();
    },
    beforeDestroy() {
        this._jflowInstance.destroy();
    },
    methods: {
        loadingNodes() {
            this.$emit('update:loading', true)
            let i = 0;
            const tl = () => {
                const end = i + 100;
                const linkPart = this.links.slice(i, end);
                if(linkPart.length) {
                    // this.renderLinks.splice(this.renderLinks.length,  0, ...linkPart);
                    this.renderLinks = this.renderLinks.concat(linkPart); // faster
                    i = end;
                    requestAnimationFrame(tl);
                } else {
                    requestAnimationFrame(this.mountJFlow.bind(this));
                }
            }
            const tn = () => {
                const end = i + 100;
                const part = this.nodes.slice(i, end);
                if(part.length) {
                    // this.renderNodes.splice(this.renderNodes.length,  0, ...part);
                    this.renderNodes = this.renderNodes.concat(part);
                    i = end;
                    requestAnimationFrame(tn);
                } else {
                    i = 0;
                    requestAnimationFrame(tl)
                }
            }
            requestAnimationFrame(tn)
        },
        mountJFlow() {
            this._jflowInstance.$mount(this.$el);
            Object.keys(this.$listeners).map(event => {
                const func = this.$listeners[event].bind(this);
                this._jflowInstance.addEventListener(event, func);
            })
            this.$emit('update:loading', false)
        },
        genNodeLinkMeta() {
            /** 
            * @member {j-jflow-Node[]} nodes
            */
            this.nodes = this._jflowInstance._layout.flowStack.map(meta => {
                const { type, layoutNode, source } = meta;
                const map = this._jflowInstance.source_Layout_Render_NodeMap;
                let obj;
                if(map.has(source)) {
                    obj = map.get(source);
                } else {
                    obj = map.set(source);
                }
                obj.layoutNode = layoutNode;
                return meta;
            });
            /** 
            * @member {Layout~LinkMeta[]} links
            */
            this.links = this._jflowInstance._layout.flowLinkStack.slice();
        },
        syncNodeLink() {
            this.renderNodes = this.nodes.slice();
            this.renderLinks = this.links.slice();
        },
        /**
         * 绘制之前，vnode渲染之后
         * @name j-jflow~preCallback
         * @function
         */
        /**
         * 重排
         * @param {j-jflow~preCallback} preCallback - JFlow 绘制之前，vnode渲染之后
         */
        reflow(preCallback) {
            this.genNodeLinkMeta();
            this.syncNodeLink();
            this.$nextTick(() => {
                if(preCallback) {
                    preCallback();
                }
                this._jflowInstance.recalculate();
                this._jflowInstance._render();
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
            if(this.__renderInSchedule__) {
                return;
            }
            this.__renderInSchedule__ = true;
            this.$nextTick(() => {
                this._jflowInstance._render();
                this.__renderInSchedule__ = false;
            });
        },
    }
}