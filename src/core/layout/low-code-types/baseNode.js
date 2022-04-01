
// import EventEmitter from '../../utils/EventEmitter';
import { DIRECTION } from '../../utils/constance';
class BaseNode {
    constructor(source) {
        this.source = source;
        this.id = source.id;
        this.type = source.type;
        // this.isDraggable = true;
        // this.getJflowInstance = undefined;
        this.level = undefined;
        this.sequence = undefined;
        // this.isLocked = false;
        this.isFree = false;
        this.parent = undefined;
        this.idx = undefined;
        this.parentIterateType = undefined;
        
        this.hasEndPoint = false;
        // source._getAstNode = () => this;
    }

    reflowPreCalculate(level = 0, sequence = 0, callback) {
        this.level = level;
        this.sequence = sequence;
        this.spanX = 1;
        this.spanY = 1;
        if(callback) {
            callback(level, sequence, this);
        }
        return {
            spanX: this.spanX, 
            spanY: this.spanY, 
            level, sequence,
        }
    }

    makeLink(callback) {
        return this;
    }

    makeEndpoint() { }

    traverse(callback) {
        callback(this);
    }

    getNodes(jflow) {
        const nodes = [];
        this.traverse(n => {
            const renderNode = jflow.getRenderNodeBySource(n.source);
            if(renderNode)
                nodes.push(renderNode);
        })
        return nodes;
    }

    linkSource(source) {
        this.parent.source[this.parentIterateType].splice(this.idx + 1, 0, source);
    }

    remove() {
        this.parent.source[this.parentIterateType].splice(this.idx, 1);
    }
}

class Root extends BaseNode {
    constructor(source) {
        super(source);
        this.isroot = true;
        this.body = (source.body || []).map(mapFunc('body').bind(this));
        const playgrounditerator = mapFunc('playground').bind(this)
        this.playground = (source.playground || []).map((s, idx) => {
            const n = playgrounditerator(s, idx);
            n.isFree = true;
            return n;
        });
    }

    reflowBodyPreCalculate(level = 0, sequence = 0, callback) {
        let spanX = 1;
        let spanY = 1;
        this.level = level;
        this.sequence = sequence;
        if(callback) {
            callback(level, sequence, this);
        }
        this.body.forEach((b) => {
            const { spanX: sx, spanY: sy } = b.reflowPreCalculate(level + 1, sequence, callback);
            spanX = Math.max(sx, spanX);
            spanY += sy;
            level += sy;
        });

        this.spanX = spanX;
        this.spanY = spanY;
        return {
            spanX, spanY, level, sequence
        }
    }

    reflowPlaygroundPreCalculate(preCallback, callback) {
        this.playground.forEach(node => {
            preCallback(node)
            node.reflowPreCalculate(0, 0, callback)
        })
    }


    makeLink(callback) {
        let last;
        this.body.forEach(b => {
            if(!last) {
                last = b;
                return;
            }
            callback({
                from: last,
                to: b,
                part: 'body',
                fromDir: DIRECTION.BOTTOM,
                toDir: DIRECTION.TOP,
            })
            
            b = b.makeLink(callback);
            last = b;
        });

        this.playground.forEach(n => {
            n.makeLink(callback);
        });
        return this;
    }

    traverse(callback) {
        this.body.forEach(n => {
            n.traverse(callback);
        });

        this.playground.forEach(n => {
            n.traverse(callback);
        })
    }
}

class IfStatement extends BaseNode {
    constructor(source) {
        super(source);
        this.consequent = (source.consequent || []).map(mapFunc('consequent').bind(this));
        this.alternate = (source.alternate || []).map(mapFunc('alternate').bind(this));
        this.isLocked = true;
        this.hasEndPoint = true;
    }
    
    reflowPreCalculate(level = 0, sequence = 0, callback) {
        let spanX = 1;
        let spanY = 1;
        this.level = level;
        this.sequence = sequence;
        if(callback) {
            callback(level, sequence, this);
        }
        let c_spanX = 1;
        let c_spanY = 0;
        let a_spanX = 0;
        let a_spanY = 0;
        this.consequent.forEach((c, idx) => {   
            const { spanX: sx, spanY: sy } = c.reflowPreCalculate(level + 1, sequence, callback);
            c_spanX = Math.max(c_spanX, sx);
            c_spanY += sy;
            level += sy;
        });
        const nextSequeence = sequence + c_spanX;
        level = this.level;
        this.alternate.forEach((a, idx) => {
            const { spanX: sx, spanY: sy } = a.reflowPreCalculate(level + 1, nextSequeence, callback);
            a_spanX = Math.max(a_spanX, sx);
            a_spanY += sy;
            level += sy;
        });
        spanX = Math.max(1, c_spanX + a_spanX);
        spanY += Math.max(c_spanY, a_spanY);
        level = this.level + spanY - 1;
        const { spanY: sy } = this.Endpoint.reflowPreCalculate(level + 1, sequence, callback);
        spanY += sy;
        this.spanX = spanX;
        this.spanY = spanY;
        return {
            spanX, spanY, level, sequence
        }
    }

    makeLink(callback) {
        let lastc = this;
        this.consequent.forEach(c => {
            callback({
                from: lastc,
                to: c,
                part: 'consequent',
                fromDir: DIRECTION.BOTTOM,
                toDir: DIRECTION.TOP,
            });

            c = c.makeLink(callback)
            lastc = c;
        })

        callback({
            from: lastc,
            to: this.Endpoint,
            fromDir: DIRECTION.BOTTOM,
            toDir: DIRECTION.TOP,
            part: 'consequent',
        });

        let lasta = this;
        this.alternate.forEach(a => {
            callback({
                from: lasta,
                to: a,
                fromDir: lasta === this ? DIRECTION.RIGHT : DIRECTION.BOTTOM,
                toDir: DIRECTION.TOP,
                part: 'alternate',
            })
            a = a.makeLink(callback)
            lasta = a;
        });
        callback({
            from: lasta,
            to: this.Endpoint,
            fromDir: lasta === this ? DIRECTION.RIGHT : DIRECTION.BOTTOM,
            toDir: DIRECTION.RIGHT,
            part: 'alternate',
        });

        return this.Endpoint;
    }

    // makeEndpoint() {
    //     const fakeSource = {
    //         type: 'endpoint',
    //         id: `${this.id}-endpoint`,
    //     };
    //     this.Endpoint = makeAST(fakeSource);
    //     this.Endpoint.parent = this.parent;
    //     this.Endpoint.idx = this.idx;
    //     this.Endpoint.parentIterateType = this.parentIterateType;
    //     return fakeSource;     
    // }

    traverse(callback) {
        callback(this);
        this.consequent.forEach(n => {
            n.traverse(callback);
        });
        this.alternate.forEach(n => {
            n.traverse(callback);
        });
        console.log(this.Endpoint)
        callback(this.Endpoint);
    }

    linkSource(source, linkMeta) {
        this.source[linkMeta.part].unshift(source);
    }
}

class SwitchStatement extends BaseNode {
    constructor(source) {
        super(source);
        this.cases = (source.cases || []).map(mapFunc('case').bind(this))
        if(this.cases.length) {
            this.cases[this.cases.length - 1].lastCase = true;
        }
        this.isLocked = true;
        this.hasEndPoint = true;
    }

    reflowPreCalculate(level = 0, sequence = 0, callback) {
        let spanX = 1;
        let spanY = 1;
        this.level = level;
        this.sequence = sequence;
        if(callback) {
            callback(level, sequence, this);
        }

        let c_spanX = 1;
        let c_spanY = 0;
        if(this.cases.length) {
            const consequent = this.cases[this.cases.length - 1].consequent;
            level = this.level;
            consequent.forEach(cc => {
                const { spanX: sx, spanY: sy } = cc.reflowPreCalculate(level + 1, sequence, callback);
                c_spanX = Math.max(c_spanX, sx);
                c_spanY += sy;
                level += sy;
            });
        }
        
        
        let s_spanX = c_spanX;
        let s_spanY = 0;
        this.cases.forEach((c, idx) => {
            const nextSequeence = sequence + s_spanX;
            let a_spanX = 0;
            let a_spanY = 0;
            level = this.level;
            c.alternate.forEach(ca => {
                const { spanX: sx, spanY: sy } = ca.reflowPreCalculate(level + 1, nextSequeence, callback);
                a_spanX = Math.max(a_spanX, sx);
                a_spanY += sy;
                level += sy;
            });
            s_spanX += a_spanX;
            s_spanY = Math.max(s_spanY, a_spanY);
        });
       
        
        spanX = Math.max(1, s_spanX);
        spanY = Math.max(c_spanY, s_spanY);
        level = this.level + spanY;
        const { spanY: sy } = this.Endpoint.reflowPreCalculate(level + 1, sequence, callback);
        spanY += sy;
        spanY += 1 // 要算上自己
        this.spanX = spanX;
        this.spanY = spanY;
        return {
            spanX, spanY, level, sequence
        }       
    }

    makeLink(callback) {
        let lastc = this;
        if(this.cases.length) {
            const consequent = this.cases[this.cases.length - 1].consequent;
            consequent.forEach((c, idx) => {
                callback({
                    from: lastc,
                    to: c,
                    fromDir: DIRECTION.BOTTOM,
                    toDir: DIRECTION.TOP,
                    part: 'consequent',
                });
                lastc = c.makeLink(callback)
            });
        }
        console.log(lastc)
        callback({
            from: lastc,
            to: this.Endpoint,
            fromDir: DIRECTION.BOTTOM,
            toDir: DIRECTION.TOP,
            part: 'consequent',
        });

        this.cases.forEach((c, idx) => {
            let lasta = c;
            c.alternate.forEach(a => {
                callback({
                    from: lasta,
                    to: a,
                    fromDir: lasta === c ? DIRECTION.RIGHT : DIRECTION.BOTTOM,
                    toDir: DIRECTION.TOP,
                    part: 'alternate',
                });
                lasta = a.makeLink(callback)
            })
            
            callback({
                from: lasta,
                to: this.Endpoint,
                fromDir: lasta === c ? DIRECTION.RIGHT : DIRECTION.BOTTOM,
                toDir: DIRECTION.RIGHT,
                part: 'alternate',
                minSpanX: 32 * (idx + 1),
            });
        });

        return this.Endpoint;
    }

    // makeEndpoint() {
    //     this.Endpoint = makeAST({
    //         type: 'endpoint',
    //         id: `${this.id}-endpoint`,
    //     });
    //     this.Endpoint.parent = this.parent;
    //     this.Endpoint.parentIterateType = this.parentIterateType;     
    //     this.Endpoint.idx = this.idx;
    // }

    traverse(callback) {
        callback(this);
        this.cases.forEach(n => {
            n.traverse(callback);
        });
        callback(this.Endpoint);
    }

    getNodes(jflow) {
        const nodes = [];
        this.traverse(n => {
            if(n.type === 'SwitchCase') return
            const renderNode = jflow.getRenderNodeBySource(n.source);
            if(renderNode)
                nodes.push(renderNode);
        })
        return nodes;
    }

    linkSource(source, linkMeta) {
        const cases = this.source.cases;
        const consequent = cases[cases.length - 1].consequent;
        consequent.unshift(source);
    }
}

class ForEachStatement extends BaseNode {
    
}

class WhileStatement extends BaseNode {
    constructor(source) {
        super(source);
        this.body = (source.body || []).map(mapFunc('body').bind(this));
        this.isLocked = true
    }

    reflowPreCalculate(level = 0, sequence = 0, callback) {
        let spanX = 1;
        let spanY = 1;
        this.level = level;
        this.sequence = sequence;
        if(callback) {
            callback(level, sequence, this);
        }
        const nextSequeence = sequence + 1;
        // level--;
        this.body.forEach((b) => {
            const { spanX: sx, spanY: sy } = b.reflowPreCalculate(level + 1, nextSequeence, callback);
            spanX = Math.max(sx, spanX);
            spanY += sy;
            level += sy;
        });

        this.spanX = spanX + 1;
        this.spanY = spanY;
        return {
            spanX, spanY, level, sequence
        }
    }

    makeLink(callback) {
        let last = this;
        // const lastIdx = this.body.length - 1;
        this.body.forEach((b, idx) => {
            callback({
                from: last,
                to: b,
                part: 'body',
                fromDir: last === this ? DIRECTION.RIGHT: DIRECTION.BOTTOM,
                toDir: DIRECTION.TOP,
            })
            
            b = b.makeLink(callback);
            last = b;
        });
        callback({
            from: last,
            to: this,
            part: 'body',
            fromDir: last === this ? DIRECTION.RIGHT : DIRECTION.BOTTOM,
            anticlock: last === this,
            toDir: DIRECTION.BOTTOM,
            isSelf: true,
            minSpanX: 20,
            minSpanY: 20,
        });
        return this;
    }

    traverse(callback) {
        callback(this);
        this.body.forEach(n => {
            n.traverse(callback);
        });
    }

    linkSource(source, linkMeta) {
        this.source[linkMeta.part].unshift(source);
    }
}

class SwitchCase extends BaseNode {
    constructor(source) {
        super(source);
        this.consequent = (source.consequent || []).map(mapFunc('consequent').bind(this));
        this.alternate = (source.alternate || []).map(mapFunc('alternate').bind(this));
        this.lastCase = false;
    }

    reflowPreCalculate(level = 0, sequence = 0, callback) {
        let spanX = 1;
        let spanY = 1;
        this.level = level;
        this.sequence = sequence;
        if(callback) {
            callback(level, sequence, this);
        }
        
        let c_spanX = 0;
        let c_spanY = 0;
        let a_spanX = 0;
        let a_spanY = 0;
        if(this.lastCase) {
            this.consequent.forEach((c, idx) => {
                const { spanX: sx, spanY: sy } = c.reflowPreCalculate(level + 1, sequence, callback);
                c_spanX = Math.max(c_spanX, sx);
                c_spanY += sy;
                level += sy;
            });
        }
        
        const nextSequeence = sequence + Math.max(c_spanX, 1);
        level = this.level;
        this.alternate.forEach((a, idx) => {
            const { spanX: sx, spanY: sy } = a.reflowPreCalculate(level + 1, nextSequeence, callback);
            a_spanX = Math.max(a_spanX, sx);
            a_spanY += sy;
            level += sy;
        });
        spanX = Math.max(1, c_spanX + a_spanX);
        spanY += Math.max(c_spanY, a_spanY);

        this.spanX = spanX;
        this.spanY = spanY;
        return {
            spanX, spanY, level, sequence
        }       
    }

    traverse(callback) {
        callback(this);
        this.consequent.forEach(n => {
            n.traverse(callback);
        });
        this.alternate.forEach(n => {
            n.traverse(callback);
        });
    }

    linkSource(source, linkMeta) {
        this.source[linkMeta.part].unshift(source);
    }

    // makeLink()
}
 
const TYPE_MAPPING = {
    IfStatement,
    SwitchStatement,
    SwitchCase,
    ForEachStatement,
    WhileStatement,
    Root,
    other: BaseNode,
}

function mapFunc(type)  {
    return function(n, idx) {
        const p = makeAST(n);
        p.parent = this;
        p.idx = idx;
        p.parentIterateType = type;

        // 重要！！！ weakMap 功能需要 endPoint source 保持一致
        if(p.hasEndPoint) {
            if(!n.__endpoint__) {
                n.__endpoint__ = {
                    type: 'endpoint',
                    id: `${p.id}-endpoint`,
                };
            }
            const e = makeAST(n.__endpoint__);
            e.parent = this;
            e.idx = idx;
            e.parentIterateType = type;
            p.Endpoint = e;
        }
        return p;
    }
}
function makeAST(source) {
    const type = source.type;
    const Constructor = TYPE_MAPPING[type] || TYPE_MAPPING.other;
    const node = new Constructor(source);
    return node;
}
export { 
    makeAST,
}

