import * as JFlowInstance from '../../core/flow';

export default function (nameNode, isLink) {
    return {
        inject: [ 'addToLinkStack', 'removeFromLinkStack', 'getInstanceByJFlowId' ],
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
            },
            configs(val, oldVal) {
                if(val.backgroundColor !== oldVal.backgroundColor) {
                    this._jflowInstance.backgroundColor = val.backgroundColor;
                }
            },
        },
        render: function (createElement) {
            return null;
        },
        created() {
            const fromInstance = this.getInstanceByJFlowId(this.from);
            const toInstance = this.getInstanceByJFlowId(this.to);
            const key = this.$vnode.key;
            if(fromInstance && toInstance) {
                this._jflowInstance =  new JFlowInstance[nameNode]({
                    ...this.configs,
                    key,
                    from: fromInstance,
                    to: toInstance,
                });
                this.bindListeners();
                this.addToLinkStack(this._jflowInstance);
               
            }
        },
        methods: {
            resetLink() {
                const fromInstance = this.getInstanceByJFlowId(this.from);
                const toInstance = this.getInstanceByJFlowId(this.to);
                this._jflowInstance.from = fromInstance;
                this._jflowInstance.to = toInstance;
            },
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