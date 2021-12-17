import * as JFlowInstance from '../../core/flow';

export default function (nameNode, isLink) {
    /**
     * JFlow {@link BaseLink} 的 vue 封装 
     * @module JFlowLink
     *
     * @vue-prop {Configs} configs - 传给 Instance 的配置
     * @vue-event {drop} dropEvent -  {@link BaseLink#event:drop} 事件
     * @vue-event {pressEnd} pressEndEvent - {@link BaseLink#event:pressEnd} 事件
     * @vue-event {pressStart} pressStartEvent - {@link BaseLink#event:pressStart} 事件
     */
    return {
        inject: [ 'addToLinkStack', 'removeFromLinkStack', 'getInstanceByName' ],
        props: {
            configs: {
                type: Object,
                default: function () {
                    return {};
                },
            },
            from: String,
            to: String,
        },
        watch: {
            from(){
                this.resetLink();
            },
            to() {
                this.resetLink();
            }
        },
        render: function (createElement) {
            return null;
        },
        created() {
            const fromInstance = this.getInstanceByName(this.from);
            const toInstance = this.getInstanceByName(this.to);
            const key = this.$vnode.key;
            if(fromInstance && toInstance) {
                this._jflowInstance =  new JFlowInstance[nameNode]({
                    ...this.configs,
                    key,
                    from: fromInstance,
                    to: toInstance,
                });
                this.addToLinkStack(this._jflowInstance); 
                Object.keys(this.$listeners).map(event => {
                    const func = this.$listeners[event].bind(this);
                    this._jflowInstance.addEventListener(event, func);
                })               
            }
        },
        methods: {
            resetLink() {
                const fromInstance = this.getInstanceByName(this.from);
                const toInstance = this.getInstanceByName(this.to);
                this._jflowInstance.from = fromInstance;
                this._jflowInstance.to = toInstance;
            }
        },
        destroyed() {
            if(this._jflowInstance) {
                this.removeFromLinkStack(this._jflowInstance);
            }
        }
    }
}