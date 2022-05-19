import wrapper from './menu-wrapper.vue';
import addMenu from './add-menu.vue';
import opMenu from './op-menu.vue';

function getComponent(type) {
    switch (type) {
        case 'addMenu':
            return addMenu;
        case 'operate':
            return opMenu;
        default:
            return null;
    }
}
export default {
    functional: true,
    props: {
        meta: Object,
    },
    render(c, context) {
        const {
            meta,
        } = context.props;
        const key = context.data.key;
        const targetComponent = getComponent(meta.type);
        return c(wrapper, {
            props: {
                meta,
            },
        }, [
            c(targetComponent, {
                key,
                props: context.props,
                on: context.listeners,
            })]);
    },
};
