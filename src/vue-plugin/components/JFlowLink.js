import * as JFlowInstance from '../../core/flow';
/**
 * JFlow {@link BaseLink} 的 vue 封装 
 * @module jflow-link
 * @property {BaseLink~Configs} configs - 传给 BseLink 的配置, from, to属性会被替换为jflowid对应的 Instance
 * @property {String} from - source
 * @property {String} to - source
 */
export default function (nameNode, isLink) {
    return {
        inject: [ 'addToLinkStack', 'removeFromLinkStack', 'getJFlow' ],
        props: {
            configs: {
                type: Object,
                default: function () {
                    return {};
                },
            },
            from: Object,
            to: Object,
        },
        // watch: {
        //     from() {
        //         this.resetLink();
        //     },
        //     to() {
        //         this.resetLink();
        //     },
        //     configs(val, oldVal) {
        //         this.setConfig(val);
        //     },
        // },
        render: function (createElement) {
            return null;
        },
        created() {
            const jflow = this.getJFlow();
            const fromInstance = jflow.getRenderNodeBySource(this.from);
            const toInstance = jflow.getRenderNodeBySource(this.to);
            // const key = this.$vnode.key;
            if(fromInstance && toInstance) {
                this._jflowInstance = new JFlowInstance[nameNode]({
                    ...this.configs,
                    from: fromInstance,
                    to: toInstance,
                });
                this.bindListeners();
                this.addToLinkStack(this._jflowInstance);   
            }
        },
        mounted() {
            this.$watch(() => [this.from, this.to, this.configs], () => {
                this.refreshConfig();
            })
        },
        methods: {
            refreshConfig() {
                const jflow = this.getJFlow();
                const fromInstance = jflow.getRenderNodeBySource(this.from);
                const toInstance = jflow.getRenderNodeBySource(this.to);
                this._jflowInstance.setConfig({
                    ...this.configs,
                    from: fromInstance,
                    to: toInstance,
                });
            },
            // setConfig(val) {
            //     const conf = {};
            //     Object.keys(val).forEach(k => {
            //         if(k !=='from' && k !== 'to'){
            //             conf[k] = val[k];
            //         }
            //     })
            //     this._jflowInstance.setConfig(conf);
            // },
            // resetLink() {
            //     const jflow = this.getJFlow();
            //     const fromInstance = jflow.getRenderNodeBySource(this.from);
            //     const toInstance = jflow.getRenderNodeBySource(this.to);
            //     this._jflowInstance.from = fromInstance;
            //     this._jflowInstance.to = toInstance;
            // },
            bindListeners() {
                Object.keys(this.$listeners).map(event => {
                    const func = this.$listeners[event];
                    this._jflowInstance.addEventListener(event, func);
                })
            }
        },
        destroyed() {
            if(this._jflowInstance) {
                this.removeFromLinkStack(this._jflowInstance);
            }
        }
    }
}