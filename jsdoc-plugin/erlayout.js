class ERNode {
    constructor(source) {
        this.type = 'ERNode';
        this.source = source;
        this.id = source.name;
        this.getJflowInstance = undefined;
        this.linkIn = 0;
        this.linkOut = 0;
        this.level = 0;
        this.linkOutArr = []
    }

    makeLink(callback) {
        const {
            extends: ext, mixins, implements: impl
        } = this.source;
        if(ext) {
            callback({
                from: ext,
                to: this.id,
                part: 'extends',
            })
        }

        if(mixins) {
            mixins.forEach(t => {
                callback({
                    from: t,
                    to: this.id,
                    part: 'mixins',
                })
            })
        }
        if(impl) {
            callback({
                from: impl,
                to: this.id,
                part: 'implements',
            })
        }
    }
}

function makeER(source) {
    const nodeMap = {};
    const nodes = source.map(s => {
        const node = new ERNode(s);
        nodeMap[s.name] = node
        return node;
    });
    return nodeMap;
}

class ERLayout {
    constructor(source) {
        this.static = false;
        this.flowStack = [];
        this.flowLinkStack = [];
        this.roots = [];
        this.reOrder(source);
    }

    reOrder(source) {
        this.flowStack = [];
        this.flowLinkStack = [];
        const nodeMap = makeER(source);
        const nodes = Object.values(nodeMap);
        nodes.forEach(node => {
            this.flowStack.push(node)
            node.makeLink((configs) => {
                const fromNode = nodeMap[configs.from];
                const toNode = nodeMap[configs.to];
                if(!fromNode) return;
                if(!toNode) return;
                fromNode.linkOutArr.push(toNode);
                fromNode.linkOut += 1;
                toNode.linkIn += 1;
                
                this.flowLinkStack.push({
                    ...configs,
                    meta: {
                        from: fromNode,
                        to: toNode,
                    }
                })
            })
        });
        const roots = nodes.filter(n => n.linkIn === 0);
        function iterateNodes(ns, level = 0) {
            const nextLevel = level + 1;
            ns.forEach(n => {
                n.level = Math.max(level, n.level);
                iterateNodes(n.linkOutArr, nextLevel);
            });
        }
        iterateNodes(roots);

        const levelMapping = {};
        nodes.forEach(node => {
            if(!levelMapping[node.level]) {
                levelMapping[node.level] = [];
            }
            levelMapping[node.level].push(node);
        });
        this.levelMapping = levelMapping;
    }

    reflow(jflow) {
        const links = this.flowLinkStack;
        const nodes = this.flowStack;
        let reduceWidth = 0;
        Object.keys(this.levelMapping)
            .sort((a, b) => (+a) - (+b))
            .forEach(key => {
                const levelNodes = this.levelMapping[key];
                let columnWidth = 0;
                let columnHeight = 0;
                levelNodes.forEach(erNode => {
                    const instance = erNode.getJflowInstance();
                    const { width, height } = instance.getBoundingDimension();
                    columnWidth = Math.max(width, columnWidth);
                    instance.anchor[1] = columnHeight;
                    columnHeight += height + 20;
                });
                columnHeight -= 20;
                const h = columnHeight/2;
                levelNodes.forEach(erNode => {
                    const instance = erNode.getJflowInstance();
                    instance.anchor[0] = reduceWidth;
                    instance.anchor[1] -= h;
                });

                reduceWidth += columnWidth + 150;
            })
    }
}

export default ERLayout;