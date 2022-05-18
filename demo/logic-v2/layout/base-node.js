import { DIRECTION } from '../src/custom/utils';
function getType(concept) {
    switch (concept) {
        case "Assignment":
        case "ForEach":
        case "Switch":
        case "While":
        case "callInterface":
        case "callLogic":
        case "datasearch":
        case "SwitchCase":
        case "if":
            return "LogicBasic"
        
        default:
            return concept
    }
}

function toNode(node) {
    if(node.concept === 'Switch') {
        return node.cases[0];
    }
    return node
}

class BaseNode {
    constructor(source) {
        this.source = source;
        this.id = source.id;
        this.concept = source.concept;
        this.type = getType(source.concept);
        this.parent = undefined;
        this.parentIterateType = undefined;
        this.idx = undefined;

        this.row = undefined;
        this.column = undefined;
        this.spanX = undefined;
        this.spanY = undefined;
    }

    reflowPreCalculate(row, column, callback) {
        this.row = row;
        this.column = column;
        this.spanX = 1;
        this.spanY = 1;
        if(callback) {
            callback(row, column, this);
        }
        return {
            spanX: this.spanX,
            spanY: this.spanY,
            row,
            column,
        };
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
                to: toNode(b),
                fromDir: DIRECTION.BOTTOM,
                toDir: DIRECTION.TOP,
            });

            b = b.makeLink((configs) => {
                callback(configs);
            });
            last = b;
        });

        // this.playground.forEach((n) => {
        //     n.makeLink((configs) => {
        //         configs.rootNode = n;
        //         callback(configs);
        //     });
        // });
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

    reflowBodyPreCalculate(row = 0, column = 0, callback) {
        let spanX = 1;
        let spanY = 1;
        this.row = row;
        this.column = column;
        // if (callback) {
        //     callback(row, column, this);
        // }
        this.body.forEach((b) => {
            const { spanY: sy } = b.reflowPreCalculate(row, column, callback);
            // spanX = Math.max(sx, spanX);
            spanY += sy;
            row += sy;
        });

        this.spanX = spanX;
        this.spanY = spanY;
        return {
            spanX, spanY, row, column,
        };
    }
}

class SwitchStatement extends BaseNode {
    constructor(source) {
        super(source);
        this.hasEndPoint = true;
        this.Endpoint = null;
        this.cases = (source.cases || []).map(mapFunc('cases').bind(this));
        this.preCases = this.cases.slice(0, this.cases.length - 1);
        this.defaultCase = this.cases[this.cases.length - 1];
        this.defaultCase.isDefault = true;
    }

    makeLink(callback) {
        let last;
        let lastCase;
        this.cases.forEach((b, idx) => {
            const lastInCase = b.makeLink(callback);
            const isDefault = b.isDefault;
            const remainCases = this.cases.slice(idx + 1);
            let remainSpanX = 0;
            remainCases.forEach(c => {
                remainSpanX = Math.max(remainSpanX, c.spanX);
            })
            // const columnEnd = remainSpanX + b.column - 1;
            // const columnBegin = b.column + 1;
            // const rowBegin = b.row + b.spanY;
            // const rowEnd = this.Endpoint.row;
            let roundCorner
            if(remainSpanX > 1) {
                roundCorner = [remainSpanX + b.column - 1, b.row + b.spanY]
            }
            // 回来的线
            callback({
                from: lastInCase || b,
                to: this.Endpoint,
                fromDir: (lastInCase || isDefault) ? DIRECTION.BOTTOM : DIRECTION.RIGHT,
                toDir: DIRECTION.RIGHT,
                roundCorner
            });
            if(lastCase) {
                // case 间的线
                callback({
                    type: 'switchcaselink',
                    from: lastCase,
                    to: b,
                    fromDir: DIRECTION.BOTTOM,
                    toDir: DIRECTION.TOP,
                    lineDash: [5, 5],
                     
                });
            }

            lastCase = b
        })
        return this.Endpoint;
    }
    traverse(callback) {
        callback(this);
        this.cases.forEach(b => {
            b.traverse(callback);
        });
        this.Endpoint.traverse(callback);
    }

    reflowPreCalculate(row = 0, column = 0, callback) {
        let spanX = 1;
        let spanY = 0;
        this.row = row;
        this.column = column;
        
        this.preCases.forEach((c, idx) => {
            const { spanY: sy, spanX: sx } = c.reflowPreCalculate(row + spanY, column, callback);
            spanY += sy;
            spanX = Math.max(spanX, sx);
        });
        const { spanY: sy, spanX: sx } = this.defaultCase.reflowPreCalculate(row + spanY, column, callback, true);
        spanY += sy;
        spanX = Math.max(spanX, sx);
        const { spanY: syend, spanX: sxend } = this.Endpoint.reflowPreCalculate(row + spanY, column, callback);
        spanY += syend;
        spanX = Math.max(spanX, sxend);
        this.spanX = spanX;
        this.spanY = spanY;
        
        return {
            spanX, spanY, row, column,
        };
    }

    // reflowPreCalculate(row, column, callback) {
    //     super.reflowPreCalculate(row, column, callback);
    //     // const nextColumn = column + 1;
    //     this.cases.forEach((c, idx) => {
    //         c.reflowPreCalculate(row, column, callback);
    //     });

    //     this.Endpoint.reflowPreCalculate(row + 2, column, callback)
    // }
}

class SwitchCase extends BaseNode {
    constructor(source) {
        super(source);
        this.isDefault = false;
        this.consequent = (source.consequent || []).map(mapFunc('consequent').bind(this));
    }

    makeLink(callback) {
        let last;
        if(this.consequent.length) {
            this.consequent.forEach((b, idx) => {
                callback({
                    from: last || this,
                    to: toNode(b),
                    fromDir: (last || this.isDefault) ? DIRECTION.BOTTOM : DIRECTION.RIGHT,
                    toDir: DIRECTION.TOP,
                });

                b = b.makeLink(callback);
                last = b;
            });
        }
        return last;
    }
    traverse(callback) {
        callback(this);
        this.consequent.forEach(b => {
            b.traverse(callback);
        });
    }

    reflowPreCalculate(row, column, callback, isDefault) {
        console.log(isDefault)
        let spanX = 0;
        let spanY = 1;
        this.row = row;
        this.column = column;
        if (callback) {
            callback(row, column, this);
        }
        this.consequent.forEach((b, idx) => {
            const { spanY: sy, spanX: sx } = b.reflowPreCalculate(
                row + idx + 1,
                column + (isDefault ? 0 : 1),
                callback);
            spanX = Math.max(sx, spanX);
            spanY += sy;
        });
        this.spanX = spanX + (isDefault ? 0 : 1);
        this.spanY = spanY;
        return {
            spanX: this.spanX, spanY, row, column,
        };
    }
}
//     reflowPreCalculate(row, column, callback) {
//         this.consequent.forEach((c, idx) => {
//             c.reflowPreCalculate(row + idx, column, callback);
//         });
//     }
// }

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
                    to: toNode(b),
                    fromDir: last ? DIRECTION.BOTTOM : DIRECTION.STARTLOOP,
                    toDir: DIRECTION.TOP,
                });

                b = b.makeLink(callback);
                last = b;
            });
        }
        callback({
            from: last || this,
            to: this,
            fromDir: last ? DIRECTION.BOTTOM : DIRECTION.STARTLOOP,
            toDir: DIRECTION.ENDLOOP,
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
        let spanX = 0;
        let spanY = 1;
        this.row = row;
        this.column = column;
        if (callback) {
            callback(row, column, this);
        }
        row += 1
        this.body.forEach((b) => {
            const { spanY: sy, spanX: sx } = b.reflowPreCalculate(row, column + 1, callback);
            spanX = Math.max(sx, spanX);
            row += sy;
        });
        this.spanX = spanX + 1;
        this.spanY = spanY;
        return {
            spanX: this.spanX, spanY, row, column,
        };
    }
    // reflowPreCalculate(row, column, callback) {
    //     super.reflowPreCalculate(row, column, callback);
    //     const nextColumn = column + 1;
    //     this.body.forEach((c, idx) => {
    //         c.reflowPreCalculate(row + idx, nextColumn, callback);
    //     });
    // }
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
            this.body.forEach((b, idx) => {
                callback({
                    from: last || this,
                    to: toNode(b),
                    fromDir: last ? DIRECTION.BOTTOM : DIRECTION.STARTLOOP,
                    toDir: DIRECTION.TOP,
                });

                b = b.makeLink(callback);
                last = b;
            });
        }
        callback({
            from: last || this,
            to: this,
            fromDir: last ? DIRECTION.BOTTOM : DIRECTION.STARTLOOP,
            toDir: DIRECTION.ENDLOOP,
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
        let spanX = 0;
        let spanY = 1;
        this.row = row;
        this.column = column;
        if (callback) {
            callback(row, column, this);
        }
        row += 1
        this.body.forEach((b) => {
            const { spanY: sy, spanX: sx } = b.reflowPreCalculate(row, column + 1, callback);
            spanX = Math.max(sx, spanX);
            row += sy;
        });

        this.spanX = spanX + 1;
        this.spanY = spanY;
        return {
            spanX: this.spanX, spanY, row, column,
        };
    }
    // reflowPreCalculate(row, column, callback) {
    //     super.reflowPreCalculate(row, column, callback);
    //     const nextColumn = column + 1;
    //     this.body.forEach((c, idx) => {
    //         c.reflowPreCalculate(row + idx + 1, nextColumn, callback);
    //     });
    // }
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