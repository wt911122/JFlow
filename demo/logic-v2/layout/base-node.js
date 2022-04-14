function getType(concept) {
    switch (concept) {
        case "Assignment":
        case "ForEach":
        case "Switch":
        case "While":
        case "callInterface":
        case "callLogic":
        case "datasearch":
        case "if":
            return "LogicBasic"
        
        default:
            return concept
    }
}

class BaseNode {
    constructor(source) {
        this.source = source;
        this.id = source.id;
        this.type = getType(source.concept);
        this.parent = undefined;
        this.parentIterateType = undefined;
        this.idx = undefined;
    }

    reflowPreCalculate(row, column, callback) {
        callback({
            row,
            column,
            layoutNode: this,
        });
    }

    makeLink(callback) {
        return this;
    }

    traverse(callback) {
        callback(this);
    }
}
class Logic extends BaseNode {
    constructor(source) {
        super(source);
        this.body = (source.body || []).map(mapFunc('body').bind(this));
        const playgrounditerator = mapFunc('playground').bind(this);
        this.playground = (source.playground || []).map((s, idx) => {
            const n = playgrounditerator(s, idx);
            n.isFree = true;
            return n;
        });
    }

    makeLink(callback) {
        let last;
        this.body.forEach((b) => {
            if (!last) {
                last = b;
                return;
            }
            callback({
                from: last,
                to: b,
                part: 'body',
                rootNode: 'bodyroot',
            });

            b = b.makeLink((configs) => {
                configs.rootNode = 'bodyroot';
                callback(configs);
            });
            last = b;
        });

        this.playground.forEach((n) => {
            n.makeLink((configs) => {
                configs.rootNode = n;
                callback(configs);
            });
        });
        return this;
    }

    traverse(callback) {
        callback(this);
        this.body.forEach(b => {
            b.traverse(callback);
        });
        this.playground.forEach(b => {
            b.traverse(callback);
        })
    }

    reflowPreCalculate(row = 0, column = 0, callback) {
        this.body.forEach((b, idx) => {
            b.reflowPreCalculate(row + idx, column, callback);
        });

        // this.playground.forEach((proot) => {
        //     const newCallback = (meta) => {
        //         callback({
        //             ...meta,
        //             root: proot
        //         });
        //     }
        //     proot.reflowPreCalculate(0, 0, newCallback);
        // })
    }
}

class SwitchStatement extends BaseNode {
    constructor(source) {
        super(source);
        this.hasEndPoint = true;
        this.Endpoint = null;
        this.cases = (source.cases || []).map(mapFunc('cases').bind(this));
    }

    makeLink(callback) {
        let lastc
        this.cases.forEach((c) => {
            if(c.consequent.length) {
                const firstConsquent = c.consequent[0];
                callback({
                    from: this,
                    to: firstConsquent,
                    content: c.source.content,
                    part: 'consequent',
                });
                console.log(c)
                lastc = c.makeLink(callback);
            }
            callback({
                from: lastc || this,
                to: this.Endpoint,
                part: 'consequent',
            });
        });
        return this.Endpoint
        
    }
    traverse(callback) {
        callback(this);
        this.cases.forEach(b => {
            b.traverse(callback);
        });
        this.Endpoint.traverse(callback);
    }

    reflowPreCalculate(row, column, callback) {
        super.reflowPreCalculate(row, column, callback);
        // const nextColumn = column + 1;
        this.cases.forEach((c, idx) => {
            c.reflowPreCalculate(row + 1, column + idx, callback);
        });

        this.Endpoint.reflowPreCalculate(row + 2, column, callback)
    }
}

class SwitchCase extends BaseNode {
    constructor(source) {
        super(source);
        this.consequent = (source.consequent || []).map(mapFunc('consequent').bind(this));
    }

    makeLink(callback) {
        if(this.consequent.length) {
            let last = this.consequent[0].makeLink(callback);
            this.consequent.slice(1).forEach(c => {
                callback({
                    from: last,
                    to: c,
                    part: 'body',
                    rootNode: 'bodyroot',
                });
                last = c.makeLink(callback);
            });
            return last;
        }
        
        return null;
    }
    traverse(callback) {
        callback(this);
        this.consequent.forEach(b => {
            b.traverse(callback);
        });
    }
    reflowPreCalculate(row, column, callback) {
        this.consequent.forEach((c, idx) => {
            c.reflowPreCalculate(row + idx, column, callback);
        });
    }
}

class ForEachStatement extends BaseNode {
    constructor(source) {
        super(source);
        this.body = (source.body || []).map(mapFunc('body').bind(this));
    }

    makeLink(callback) {
        let last;
        if(this.body.length) {
            this.body.forEach((b, idx) => {
                callback({
                    from: last || this,
                    to: b,
                    part: 'foreachbody',
                });

                b = b.makeLink(callback);
                last = b;
            });
        }
        callback({
            from: last,
            to: this,
        })
        return this;
    }
    traverse(callback) {
        callback(this);
        this.body.forEach(b => {
            b.traverse(callback);
        });
    }
    reflowPreCalculate(row, column, callback) {
        super.reflowPreCalculate(row, column, callback);
        const nextColumn = column + 1;
        this.body.forEach((c, idx) => {
            c.reflowPreCalculate(row + idx, nextColumn, callback);
        });
    }
}

class WhileStatement extends BaseNode {
    constructor(source) {
        super(source);
        console.log('WhileStatement', source.body)
        this.body = (source.body || []).map(mapFunc('body').bind(this));
        console.log('WhileStatement', this.body)
    }

    makeLink(callback) {
        let last;
        if(this.body.length) {
            console.log('while makeLink')
            this.body.forEach((b, idx) => {
                callback({
                    from: last || this,
                    to: b,
                    part: 'whilebody',
                });

                b = b.makeLink(callback);
                last = b;
            });
        }
        callback({
            from: last,
            to: this,
        })
        return this;
    }

    traverse(callback) {
        callback(this);
        this.body.forEach(b => {
            b.traverse(callback);
        });
    }
    reflowPreCalculate(row, column, callback) {
        super.reflowPreCalculate(row, column, callback);
        const nextColumn = column + 1;
        this.body.forEach((c, idx) => {
            c.reflowPreCalculate(row + idx + 1, nextColumn, callback);
        });
    }
}


class IFstatement extends BaseNode {
    constructor(source) {
        super(source);
        this.consequent = (source.consequent || []).map(mapFunc('consequent').bind(this));
        this.alternate = (source.alternate || []).map(mapFunc('alternate').bind(this));
    }
}

const TYPE_MAPPING = {
    'if': IFstatement,
    "Switch": SwitchStatement,
    "SwitchCase": SwitchCase,
    "ForEach": ForEachStatement,
    "While": WhileStatement,
    Logic,
    other: BaseNode,
};

function mapFunc(type) {
    return function (n, idx) {
        const p = makeAST(n);
        p.parent = this;
        p.idx = idx;
        p.parentIterateType = type;

        if (p.hasEndPoint) {
            if (!n.__endpoint__) {
                n.__endpoint__ = {
                    concept: 'endpoint',
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
    };
}
function makeAST(source) {
    const type = source.concept;
    const Constructor = TYPE_MAPPING[type] || TYPE_MAPPING.other;
    const node = new Constructor(source);
    return node;
}
export {
    makeAST,
};