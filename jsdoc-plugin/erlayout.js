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
            extends: ext, 
            mixins, 
            implements: impl,
            groupfrom,
        } = this.source;
        if(groupfrom) {
            callback({
                from: groupfrom,
                to: this.id,
                part: 'groupfrom',
            });
            callback({
                from: 'GroupTemplate',
                to: this.id,
                part: 'generate',
            })
        } else {
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
                        lineDash: [5, 2]
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
        const levelMapping = {};
        const roots = nodes.filter(n => n.linkIn === 0);
        function iterateNodes(ns, level = 0) {
            if(!levelMapping[level]) {
                levelMapping[level] = [];
            }
            const nextLevel = level + 1;
            ns.forEach(n => {
                const index = levelMapping[n.level].findIndex(node => node === n);
                ~index && levelMapping[n.level].splice(index, 1);
                n.level = Math.max(level, n.level);
                levelMapping[n.level].push(n);
                iterateNodes(n.linkOutArr, nextLevel);
            });
        }
        iterateNodes(roots);
        // nodes.forEach(node => {
        //     levelMapping[node.level].push(node);
        // });
        this.levelMapping = levelMapping;
    }

    reflow(jflow) {
        const links = this.flowLinkStack;
        const nodes = this.flowStack;
        let reduceWidth = 0;
        let i = 0;
        Object.keys(this.levelMapping)
            // .sort((a, b) => (+b) - (+a))
            .forEach(key => {
                const levelNodes = this.levelMapping[key];
                let columnWidth = 0;
                let columnHeight = 0;
                levelNodes.forEach((erNode, idx) => {
                    const instance = erNode.getJflowInstance();
                    const { width, height } = instance.getBoundingDimension();
                    columnWidth = Math.max(width, columnWidth);
                    if(idx > 0) {
                        columnHeight += height/2
                    }
                    instance.anchor[1] = columnHeight;
                    columnHeight += (height/2 + 40);
                    
                });
                columnHeight -= 20;
                const h = columnHeight/2;
                reduceWidth += i === 0 ? 0 : columnWidth/2;
                levelNodes.forEach(erNode => {
                    const instance = erNode.getJflowInstance();
                    instance.anchor[0] = reduceWidth;
                    instance.anchor[1] -= h;
                });
                reduceWidth += (columnWidth/2 + 150);
                i++;
            })
    }
}

export default ERLayout;