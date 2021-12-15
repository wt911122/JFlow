// import { JFlowInstance } from '@joskii/jflow';
export default {
    props: {
        instance: Object,
    },
    render(c) {
        const component = this.instance.component;
        return c(component, {
            props: {
                configs: this.instance
            }
        }, )
    }
}