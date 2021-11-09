import * as JFlowInstance from '../../core/flow';
export default function (nameNode, isLink) {
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
        render: function (createElement) {
            return null;
        },
        created() {
            const fromInstance = this.getInstanceByName(this.from);
            const toInstance = this.getInstanceByName(this.to);
            if(fromInstance && toInstance) {
                this._jflowInstance =  new JFlowInstance[nameNode]({
                    ...this.configs,
                    from: fromInstance,
                    to: toInstance,
                });
                this.addToLinkStack(this._jflowInstance);                
            }
        },
        destroyed() {
            if(!this._jflowInstance) {
                this.removeFromLinkStack(this._jflowInstance);
            }
        }
    }
}