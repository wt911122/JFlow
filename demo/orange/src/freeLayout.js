/**
 * data source
 * [
     { id: a, next: ['b'] },
     { id: b }
 ]
 */

class FreeNode {
    constructor(source) {
        this.type = 'FreeNode';
        this.source = source;
        this.id = source.id;
        this.nextNodes = source.next || [];
    }

    makeLink(callback) {
        this.nextNodes.forEach(id => {
            callback({
                from: this.id,
                to: id,
            })
        })
    }
}

class FreeLayout {
    constructor(source) {
        this.static = false;
        this.reOrder(source)
    }

    reOrder(source) {
        this.flowStack = [];
        this.flowLinkStack = [];
        const nodeMap = {};
        const nodes = source.map(s => {
            const node = new FreeNode(s);
            nodeMap[s.id] = node
            return node;
        });
        this.nodes = nodes;
        nodes.forEach(node => {
            this.flowStack.push({
                type: node.type,
                source: node.source,
                layoutNode: node,
            })
            node.makeLink((configs) => {
                console.log(configs);
                const fromNode = nodeMap[configs.from];
                const toNode = nodeMap[configs.to];
                if(!fromNode) return;
                if(!toNode) return;
                this.flowLinkStack.push({
                    ...configs,
                    from: fromNode,
                    to: toNode,
                })
            })
        });
    }

    reflow(jflow) {
            const nodes = this.nodes;
            nodes.forEach((node, idx) => {
                
                // const instance = node.getJflowInstance();
                // 计算 节点位置
                // instance.anchor = [idx * 220, (idx % 2) * 80];
            });
    }
}

export default FreeLayout;