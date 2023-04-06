class SimpleNode {
    constructor(source) {
        this.type = 'SimpleNode';
        this.source = source;
    }
}
export default class SimpleLayout {
    constructor(source) {
        this.static = false;
        // 管理节点和边界 必须
        this.flowLinkStack = [];
        this.flowStack = [];
        const nodes = source.nodes.map(s => new SimpleNode(s));
        nodes.forEach(n => {
            this.flowStack.push({
                type: n.type,
                source: n.source,
                layoutNode: n,
            })
        });
        this.erNodes = nodes;
    }

    reflow(jflow) {
        const nodes = this.erNodes;
        nodes.forEach((node, idx) => {
            // 计算 节点位置
            const renderNode = jflow.getRenderNodeBySource(node.source) 
            renderNode.anchor = [20, -10];
        });
    }

}
