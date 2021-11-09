import JFlow from '../../core/flow';
import StackMixin from './StackMixin';
export default {
    mixins: [StackMixin],
    props: {
        configs: {
            type: Object,
            default: function () {
                return {};
            },
        },
    },
    render: function (createElement) {
        return createElement('div', this.$slots.default);
    },
    created() {
        this._jflowInstance = new JFlow(this.configs);
    },
    mounted() {
        this._jflowInstance.$mount(this.$el);
    },
    methods: {
        getInstance() {
            return this._jflowInstance;
        }
    }
}