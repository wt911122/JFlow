import startAtom from './start.vue';
import endAtom from './end.vue';
import assignment from './assignment.vue';
import numberAtom from './atom/number.vue';
import textAtom from './atom/text.vue';
import variableAtom from './atom/variable.vue';

function getComponent(type) {
    switch (type) {
        case 'start':
            return startAtom;
        case 'end':
            return endAtom;
        case 'assignment':
            return assignment;
        case 'number':
            return numberAtom;
        case 'variable':
            return variableAtom;
        default:
            return null;
    }
}

export default {
    functional: true,
    props: {
        node: Object,
        initialAnchor: Array,
    },
    render(c, context) {
        const {
            node,
        } = context.props;
        const key = context.data.key;
        const targetComponent = getComponent(node.type);
        if(!targetComponent) {
            return null;
        }
        return c(targetComponent, {
            key,
            props: context.props,
            on: context.listeners
        });
        return null;
    }
}