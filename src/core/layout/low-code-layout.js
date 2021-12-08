/**
    lowcode layout
    + link
        root to leafs, level by level
    + no link blocks 
        top to bottom, no overlap
 */
import JFlowEvent from '../events'; 
import JFlowEndpoint from './endpoint';
function insertEndPoint() {
    const instance = new JFlowEndpoint({});
    return instance;
}
function AstNode(source, flowStack, isroot) {
    this.source = source;
    this.isroot = isroot;
    this.id = source.id;
    this.type = source.type;
    this.getJflowInstance = undefined; // 后面绑定了JFlowInstance再定义
    const mapFunc = (type) => (n, idx) => {
        const p = new AstNode(n, flowStack);
        p.parent = this;
        p.idx = idx;
        p.parentIterateType = type;
        return p
    }
    this.body = (source.body || []).map(mapFunc('body'));
    this.consequent = (source.consequent || []).map(mapFunc('consequent'));
    this.alternate = (source.alternate || []).map(mapFunc('alternate'));
    if(source.consequent || source.alternate) {
        const instance = insertEndPoint();
        this.Endpoint = new AstNode({
            type: 'endpoint',
            id: `${this.id}-endpoint`,
            // jflowInstance: insertEndPoint(),
        }, flowStack);
        this.Endpoint.parent = this;
        this.Endpoint.parentIterateType = 'endpoint';
        // this.Endpoint.getJflowInstance = function() {
        //     return instance;
        // }
    }
    if(!isroot) {
        flowStack.push({
            type: this.type,
            configs: source,
            layoutMeta: this,
        })
    }
}

AstNode.prototype.reflowPreCalculate = function(level = 0, sequence = 0, layoutMapping, isroot) {
    let spanX = 1;
    let spanY = 1;
    this.level = level;
    this.sequence = sequence;
    if(!isroot) {
        if(!layoutMapping.vertical[level]){
            layoutMapping.vertical[level] = {};
        }
        layoutMapping.vertical[level][sequence] = this;
        
        if(!layoutMapping.horizontal[sequence]){
            layoutMapping.horizontal[sequence] = {};
        }
        layoutMapping.horizontal[sequence][level] = this;
    }

    if(this.body.length) {
        this.body.forEach((b, idx) => {
            const { spanX: sx, spanY: sy } = b.reflowPreCalculate(level + 1, sequence, layoutMapping);
            spanX = Math.max(sx, spanX);
            spanY += sy;
            level += sy;
        });
    } else {
        let c_spanX = 0;
        let c_spanY = 0;
        let a_spanX = 0;
        let a_spanY = 0;
        this.consequent.forEach((c, idx) => {
            const { spanX: sx, spanY: sy } = c.reflowPreCalculate(level + 1, sequence, layoutMapping);
            c_spanX = Math.max(c_spanX, sx);
            c_spanY += sy;
            level += sy;
        });
        const nextSequeence = sequence + Math.max(c_spanX, 1);
        level = this.level;
        this.alternate.forEach((a, idx) => {
            const { spanX: sx, spanY: sy } = a.reflowPreCalculate(level + 1, nextSequeence, layoutMapping);
            a_spanX = Math.max(a_spanX, sx);
            a_spanY += sy;
            level += sy;
        });
        spanX = Math.max(1, c_spanX + a_spanX);
        spanY += Math.max(c_spanY, a_spanY);
        level = this.level + spanY - 1;
        if(this.Endpoint) {
            const { spanY: sy } = this.Endpoint.reflowPreCalculate(level + 1, sequence, layoutMapping);
            spanY += sy;
        }
    }

    this.spanX = spanX;
    this.spanY = spanY;
    console.log(this.source.id, this.spanX, this.spanY, this.level, this.sequence)

    return {
        spanX, spanY, level, sequence
    }
}

AstNode.prototype.toString = function() {
    console.log(`${this.sequence}, ${this.level}, ${this.id}`);
    if(this.body.length) {
        this.body.forEach(b => {
            b.toString();
        });
    } else {
        this.consequent.forEach(c => {
            c.toString();
        });
        this.alternate.forEach(a => {
            a.toString();
        });
        if(this.Endpoint) {
            this.Endpoint.toString();
        }
    }
}

AstNode.prototype.makeLink = function(flowLinkStack, isroot) {
    if(this.body.length) {
        let last;
        if(!isroot) {
            last = this;
        }
        this.body.forEach(b => {
            if(!last) {
                last = b;
                return;
            }
            flowLinkStack.push({
                from: last.id,
                to: b.id,
                part: 'body',
                meta: {
                    from: last,
                    to: b
                }
            });
            
            b = b.makeLink(flowLinkStack);
            last = b;
        });
    } else {
        let lastc = this;
        this.consequent.forEach(c => {
            flowLinkStack.push({
                from: lastc.id,
                to: c.id,
                part: 'consequent',
                meta: {
                    from: lastc,
                    to: c
                }
            });
            c = c.makeLink(flowLinkStack)
            lastc = c;
        });
        if(this.Endpoint) {
            // 顺序不可调整！！！会影响连线
            flowLinkStack.push({
                from: lastc.id,
                to: this.Endpoint.id,
                part: 'consequent',
                meta: {
                    from: lastc,
                    to: this.Endpoint
                }
            })
        }

        let lasta = this;
        this.alternate.forEach(a => {
            flowLinkStack.push({
                from: lasta.id,
                to: a.id,
                part: 'alternate',
                meta: {
                    from: lasta,
                    to: a
                }
            })
            a = a.makeLink(flowLinkStack)
            lasta = a;
        });
        if(this.Endpoint) {
            flowLinkStack.push({
                from: lasta.id,
                to: this.Endpoint.id,
                part: 'alternate',
                meta: {
                    from: lasta,
                    to: this.Endpoint
                }
            });
            return this.Endpoint;
        }
    }
    return this;
}
function sqr(x) {
    return x * x;
}
function dist2(v, w) {
    return sqr(v[0] - w[0]) + sqr(v[1] - w[1]);
}
class LowcodeLayout {
    constructor(configs) {
        this.linkLength = configs.linkLength || 18;
        this.gap = configs.gap || 30;
        this.reOrder(configs.ast);
        this.static = true;
    }

    reOrder(ast) {
        this.ast = ast;
        this.flowStack = [];
        this.flowLinkStack = [];
        this.root = new AstNode(this.ast, this.flowStack, true);
        this.layoutMapping = {
            vertical: {},
            horizontal: {},
        };
        this.root.reflowPreCalculate(0,0, this.layoutMapping, true);
        this.root.makeLink(this.flowLinkStack, true);
    }

    alignLinkOrder(linkStack, out) {
        // TODO 可以优化
        this.flowLinkStack.forEach(link => {
            const id = `${link.from}-${link.to}-${link.part}`;
            const instance = linkStack.find(linkInstance => linkInstance.key === id);
            if(instance) {
                out.push(instance);
            }
        });
    }

    staticCheck(instance, jflow) {
        const finded = jflow._linkStack.find(l => l.from === instance || l.to === instance);
        if(!finded) {
            return false;
        }
        debugger
        const nowAnchor = instance.anchor.slice();
        jflow.reflow();
        if(jflow._linkStack.length < 2) return;
        const currentAnchor = instance.anchor;
        const d = dist2(nowAnchor, currentAnchor);
        if(d > 1000) {
            console.log(instance)
            instance.dispatchEvent(new JFlowEvent('outOfFlow', {
                anchor: nowAnchor,
                instance,
                jflow,
                point: nowAnchor,
            }))
            return true;
        }
        return false;
    }

    reflow(jflow){
        const linkStack = jflow._linkStack;
        const instanceStack = jflow._stack;
        const linkLength = this.linkLength;
        const gap = this.gap;

        const verticalMapping = this.layoutMapping.vertical;
        const horizontalMapping = this.layoutMapping.horizontal;

        let reduceWidth = 0;
        Object.keys(horizontalMapping).sort().forEach(columnNumber => {
            const column = horizontalMapping[columnNumber];
            let rowWidth = 0;
            const rows = Object.keys(column).sort()
            rows.forEach(rowNumber => {
                const ast = column[rowNumber];
                const instance = ast.getJflowInstance();
                const { width } = instance.getBoundingDimension();
                rowWidth = Math.max(width, rowWidth);
            });
            reduceWidth += rowWidth/2
            rows.forEach(rowNumber => {
                const ast = column[rowNumber];
                const instance = ast.getJflowInstance();
                instance.anchor[0] = reduceWidth;
            });
            reduceWidth += (rowWidth/2 + gap) ;
        });

        let reduceHeight = 0;
        Object.keys(verticalMapping).sort().forEach(rowNumber => {
            const row = verticalMapping[rowNumber];
            let rowHeight = 0;
            const columns = Object.keys(row).sort()
            columns.forEach(columnNumber => {
                const ast = row[columnNumber];
                const instance = ast.getJflowInstance();
                const { height, width } = instance.getBoundingDimension();
                rowHeight = Math.max(height, rowHeight);
            });
            reduceHeight += rowHeight/2;
            columns.forEach(columnNumber => {
                const ast = row[columnNumber];
                const instance = ast.getJflowInstance();
                instance.anchor[1] = reduceHeight;
            });
            reduceHeight += (rowHeight/2 + linkLength) ;
        });

        

    }
}

export default LowcodeLayout;