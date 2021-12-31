class ERProperty {
    constructor(source, node) {
        this.type = 'ERProperty';
        this.source = source;
        this.node = node;
        this.ref = source.ref;
        this.id = `${node.name}-${source.name}`
        this.getJflowInstance = undefined;
    }
}

class ERNode { 
    constructor(source) {
        this.type = 'ERNode';
        this.source = source;
        this.name = source.name;
        this.getJflowInstance = undefined;
        this.adjacencyList = []
        this.propertyList = source.propertyList.map(p => new ERProperty(p, this));
    }

    _traverseProperty(nodeMap) {
        this.propertyList.forEach(property => {
            if(property.ref && nodeMap[property.ref]) {
                property.ref = nodeMap[property.ref];
                this.adjacencyList.push(property.ref);
            }
        })
    }

    traverse(callback) {
        callback(this);
        this.propertyList.forEach(property => {
            if(property.ref instanceof ERNode) {
                callback(property);
            }
        })
    }

    makeLink(callback) {
        this.propertyList.forEach(property => {
            if(property.ref instanceof ERNode) {
                const node = property.ref;
                callback({
                    from: property.id,
                    to: node.name,
                    part: 'property',
                    meta: {
                        from: property,
                        to: node,
                    }
                });
            }
        })
    }
}

function makeER(source) {
    const nodeMap = {};
    const nodes = source.map(s => {
        const node = new ERNode(s);
        nodeMap[s.name] = node
        return node;
    });
    nodes.forEach(node => {
        node._traverseProperty(nodeMap);
    });
    return nodes;
}
export { 
    makeER,
}