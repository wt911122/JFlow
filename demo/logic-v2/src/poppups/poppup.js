import wrapper from './menu-wrapper.vue';
import addMenu from './add-menu.vue';
import opMenu from './op-menu.vue';
import contentHover from './content-hover.vue';

function getComponent(type) {
    switch (type) {
        case 'addMenu':
            return addMenu;
        case 'operate':
            return opMenu;
        case 'hovercontent':
            return contentHover;
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
        if(meta.type === 'hovercontent') {
            return c(targetComponent, {
                key,
                props: context.props,
                on: context.listeners,
            });
        }
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
