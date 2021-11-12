import assignment from './assignment.vue';
import numberAtom from './atom/number.vue';
import textAtom from './atom/text.vue';
import variableAtom from './atom/variable.vue';

export default {
    functional: true,
    render(c, context) {
        const {
            type,
        } = context.props;

        if(type === 'assignment') {
            return c(assignment, {
                props: context.props,
            });
        }
        if(type === 'number') {
            return c(numberAtom, {
                props: context.props,
            });
        }
        if(type === 'text') {
            return c(textAtom, {
                props: context.props,
            });
        }
        if(type === 'variable') {
            console.log(context.props)
            return c(variableAtom, {
                props: context.props,
            });
        }
        return null;
    }
}