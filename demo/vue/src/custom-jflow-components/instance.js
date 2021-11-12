// import { JFlowInstance } from '@joskii/jflow';
export default {
    props: {
        instance: Object,
    },
    render(c) {
        const component = this.instance.component;
        debugger
        return c(component, {
            props: {
                configs: this.instance
            }
        })
    }
}