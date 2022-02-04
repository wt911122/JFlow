import erLayout from './erlayout';
import JFlow, { Group, Text, BezierLink } from '../src/core/flow';
function renderNode(erNode) {
    const textContent = new Text({
        content: erNode.id,
        textColor: '#EB6864'
    });
    const wrapper = new Group({
        padding: 15,
        borderRadius: 8,
        borderColor: '#EB6864',
        borderWidth: 2,
    });
    erNode.getJflowInstance = () => wrapper;
    wrapper.addToStack(textContent);
    wrapper.recalculate();
    wrapper.addEventListener('click', () => {

    })
    return wrapper;
}

function renderLink(linkmeta) {
    const meta = linkmeta.meta;
    const link = new BezierLink({
        content: linkmeta.part,
        from: meta.from.getJflowInstance(),
        to: meta.to.getJflowInstance(),
        backgroundColor: '#EB6864',
    });
    return link;
}

function render (data, elemId) {
    const layout = new erLayout(data);
    const jflowStage = new JFlow({
        allowDrop: false,
        layout,
    });

    layout.flowStack.forEach(erNode => {
        const Node = renderNode(erNode);
        jflowStage.addToStack(Node);
    });

    layout.flowLinkStack.forEach(linkMeta => {
        const link = renderLink(linkMeta);
        jflowStage.addToLinkStack(link);
    });

    const div = document.getElementById(elemId);
    div.style.width = '100%';
    jflowStage.$mount(div);
}

window.renderErGraph = render;
export default render;