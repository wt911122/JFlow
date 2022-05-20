import { DIRECTION } from '../src/custom/utils';
import { layoutConstance, getLayoutConstance } from './utils';
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
        case "If":
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

function verticalFlow(
    node, list,
    spanX = 1,
    spanY = 1,
    row = 0,
    column = 0,
    callback
) {
    let lastNode;

    let reducedStartSpan = spanY;
    let reducedEndSpan = spanY;

    list.forEach((e, idx) => {
        const { spanX: sx, spanY: sy } = e.reflowPreCalculate(row + reducedStartSpan, column, callback);

        if ((!lastNode || lastNode.concept !== 'Switch') && sy === 1 && sx === 1) {
            // 单个块，顺序排列
            reducedStartSpan += 1
            reducedEndSpan = Math.max(reducedStartSpan, reducedEndSpan);
        } else {
            // 存在多行或多列，间隔排列
            
            reducedStartSpan = reducedEndSpan;
            reducedEndSpan += sy;
            e.reflowPreCalculate(row + reducedStartSpan, column, callback);
            reducedStartSpan += 1;
            reducedEndSpan = Math.max(reducedStartSpan, reducedEndSpan);
        }

        spanX = Math.max(sx, spanX);
        lastNode = e;
    });
    spanY = reducedEndSpan;

    return { spanX, spanY };
}

/* 
function verticalFlow(node, list, spanX = 1, spanY = 1, row = 0, column = 0, callback) {
    let lastMaxRow = row;
    let lastNode;
    let spanYPlain = spanY;
    
    list.forEach((b, idx) => {
        const { spanX: sx, spanY: sy } = b.reflowPreCalculate(lastMaxRow, column, callback);

        if ((!lastNode || lastNode.concept !== 'Switch') && sy === 1) {
            const idxRow = row + idx;
            lastMaxRow = Math.max(lastMaxRow, idxRow);
            b.reflowPreCalculate(idxRow, column, callback);
            spanYPlain += 1;
            console.log(spanYPlain);
        } else {
            lastMaxRow = lastMaxRow + sy
            spanY += sy;
        }
        spanX = Math.max(sx, spanX);
        lastNode = b;
    });
    spanY = Math.max(spanYPlain, spanY);
    return {
        spanX, spanY
    };
} */

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

        this.rootNode = null;
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

    linkSource(source) {
        this.parent.source[this.parentIterateType].splice(this.idx + 1, 0, source);
    }

    delete() {
        this.parent.source[this.parentIterateType].splice(this.idx, 1);
    }

    getNodes(jflow) {
        const nodes = [];
        this.traverse((n) => {
            const renderNode = jflow.getRenderNodeBySource(n.source);
            if (renderNode)
                nodes.push(renderNode);
        });
        return nodes;
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

            b = b.makeLink(callback);
            last = b;
        });

        this.playground.forEach((n) => {
            n.makeLink(callback);
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

    reflowBodyPreCalculate(row = 0, column = 0, callback) {
        this.row = row;
        this.column = column;


        // let lastMaxRow = 0;
        // this.body.forEach((b, idx) => {
        //     const { spanY: sy } = b.reflowPreCalculate(row + spanY, column, callback);

        //     // const { spanY: sy } = b.reflowPreCalculate(row, column, callback);
        //     if (sy === 1) {
        //         lastMaxRow = row + idx + 1
        //         b.reflowPreCalculate(lastMaxRow, column, callback);
        //     } else {
        //         lastMaxRow = row + spanY
        //     }
        //     spanY += sy;
        // });
        const { spanX, spanY } = verticalFlow(this, this.body, 0, 0, 0, 0, callback);
        this.spanX = spanX;
        this.spanY = spanY;
        return {
            spanX, spanY, row, column,
        };
    }

    reflowPlaygroundPreCalculate(callback) {
        this.playground.forEach(node => {
            node.reflowPreCalculate(0, 0, (row, column, layoutnode) => {
                layoutnode.rootLayoutNode = node;
            })
        })
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

            console.log('case ' + idx , remainSpanX)
            let roundCorner
            if(remainSpanX > 1) {
                roundCorner = [remainSpanX + b.column - 1, b.row + b.spanY]
            }
            console.log('case ' + idx , remainSpanX, roundCorner)
            if(b.consequent.length === 0 && remainSpanX >= 2) {
                // console.log(remainCases.map(c => c.spanX))
                // console.log('no case', roundCorner, b.column);
                roundCorner.unshift(b.row);
                roundCorner.unshift(b.column + 1)
                // console.log(roundCorner)
            }
            // 回来的线
            callback({
                from: lastInCase || b,
                to: this.Endpoint,
                fromDir: (lastInCase || isDefault) ? DIRECTION.BOTTOM : DIRECTION.RIGHT,
                toDir: DIRECTION.RIGHT,
                roundCorner,
                minSpanX: getLayoutConstance('minSpanX'),
                endRow: (idx + 1 < this.cases.length - 1 ? this.cases[idx + 1].row : this.Endpoint.row),
                part: 'consequent'
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
                    part: 'cases'
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
        const { spanY: sy, spanX: sx } = this.defaultCase.reflowPreCalculate(row + spanY, column, callback);
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
                    part: 'consequent'
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

    reflowPreCalculate(row, column, callback) {
        const isDefault = this.isDefault;
        // let spanX = 0;
        // let spanY = 1;
        this.row = row;
        this.column = column;
        if (callback) {
            callback(row, column, this);
        }

        const { spanX: sx, spanY: sy } = verticalFlow(this, this.consequent, 0, 0, row + 1, column + (isDefault ? 0 : 1), callback);
        // this.spanX = spanX + 1;
        // this.spanY = spanY;
        // return {
        //     spanX: this.spanX, spanY, row, column,
        // };
        
        // this.consequent.forEach((b, idx) => {
        //     const { spanY: sy, spanX: sx } = b.reflowPreCalculate(
        //         row + idx + 1,
        //         column + (isDefault ? 0 : 1),
        //         callback);
        //     spanX = Math.max(sx, spanX);
        //     spanY += sy;
        // });
       
        let spanX = Math.max(sx, 1);
        this.spanX = spanX + (isDefault ? 0 : 1);
        console.log(this.spanX)
        this.spanY = sy + 1;
        return {
            spanX: this.spanX,
            spanY: this.spanY, 
            row, column,
        };
    }

    linkSource(source, linkMeta) {
        if(linkMeta.part === 'cases') {
            super.linkSource(source);
        } else {
            this.source.consequent.unshift(source);
        }   
    }

    getNodes(jflow) {
        // const nodes = [];
        // this.traverse((n) => {
        //     const renderNode = jflow.getRenderNodeBySource(n.source);
        //     if (renderNode)
        //         nodes.push(renderNode);
        // });
        return this.parent.getNodes(jflow);
    }

    delete() {
        if(this.parent.cases.length === 2) {
            this.parent.delete();
        } else {
            super.delete();
        }
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
                    part: 'foreachbody',
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
            minSpanX: getLayoutConstance('minSpanX'),
            minSpanY: getLayoutConstance('minSpanY'),
            minGapY: getLayoutConstance('minGapY'),
            part: 'foreachbody',
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
        // let spanX = 0;
        // let spanY = 1;
        this.row = row;
        this.column = column;
        if (callback) {
            callback(row, column, this);
        }
        // this.body.forEach((b) => {
        //     const { spanY: sy, spanX: sx } = b.reflowPreCalculate(row + spanY + 1, column + 1, callback);
        //     spanX = Math.max(sx, spanX);
        //     spanY += sy;
        // });

        // this.spanX = spanX + 1;
        // this.spanY = spanY;
        const { spanX, spanY } = verticalFlow(this, this.body, 0, 0, row + 1, column + 1, callback);
        this.spanX = Math.max(spanX + 1, 2);
        this.spanY = spanY + 1;
        return {
            spanX: this.spanX, 
            spanY: this.spanY, 
            row, column,
        };
        // return verticalFlow(this, this.body, row, column, callback);
    }
    linkSource(source, linkMeta) {
        if(linkMeta.part !== 'foreachbody') {
            super.linkSource(source, linkMeta)
        } else {
            this.source.body.unshift(source);
        }
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
                    part: 'whilebody',
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
            // minSpanX: layoutConstance.minSpanX,
            // minSpanY: layoutConstance.minSpanY,
            // minGapY: layoutConstance.minGapY,
            minSpanX: getLayoutConstance('minSpanX'),
            minSpanY: getLayoutConstance('minSpanY'),
            minGapY: getLayoutConstance('minGapY'),
            part: 'whilebody',
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
        this.row = row;
        this.column = column;
        if (callback) {
            callback(row, column, this);
        }
        const { spanX, spanY } = verticalFlow(this, this.body, 0, 0, row + 1, column + 1, callback);
        this.spanX = Math.max(spanX + 1, 2);
        this.spanY = spanY + 1;
        return {
            spanX: this.spanX, 
            spanY: this.spanY, 
            row, column,
        };
    }
    linkSource(source, linkMeta) {
        if(linkMeta.part !== 'whilebody') {
            super.linkSource(source, linkMeta)
        } else {
            this.source.body.unshift(source);
        }
    }
}


class IFstatement extends BaseNode {
    constructor(source) {
        super(source);
        this.hasEndPoint = true;
        this.Endpoint = null;
        this.consequent = (source.consequent || []).map(mapFunc('consequent').bind(this));
        this.alternate = (source.alternate || []).map(mapFunc('alternate').bind(this));
    }

    makeLink(callback) {
        let last;
        // Alternate
        if(this.alternate.length) {
            this.alternate.forEach((b, idx) => {
                callback({
                    from: last || this,
                    to: toNode(b),
                    fromDir: last ? DIRECTION.BOTTOM : DIRECTION.RIGHT,
                    toDir: DIRECTION.TOP,
                    part: 'alternate',
                });

                b = b.makeLink(callback);
                last = b;
            });
        }
        callback({
            from: last || this,
            to: this.Endpoint,
            fromDir: last ? DIRECTION.BOTTOM : DIRECTION.RIGHT,
            toDir: DIRECTION.RIGHT,
            part: 'alternate',
            minSpanX: getLayoutConstance('minSpanX'),
        })

        // Consequent
        last = null;
        if(this.consequent.length) {
            this.consequent.forEach((b, idx) => {
                callback({
                    from: last || this,
                    to: toNode(b),
                    fromDir: DIRECTION.BOTTOM,
                    toDir: DIRECTION.TOP,
                    part: 'consequent',
                });

                b = b.makeLink(callback);
                last = b;
            });
        }
        callback({
            from: last || this,
            to: this.Endpoint,
            fromDir: DIRECTION.BOTTOM,
            toDir: DIRECTION.TOP,
            part: 'consequent',
        })

        return this.Endpoint;
    }

    traverse(callback) {
        callback(this);
        this.consequent.forEach(b => {
            b.traverse(callback);
        });
        this.alternate.forEach(b => {
            b.traverse(callback);
        });
        this.Endpoint.traverse(callback);
    }

    reflowPreCalculate(row, column, callback) {
        this.row = row;
        this.column = column;
        if (callback) {
            callback(row, column, this);
        }
        const { spanX: asx, spanY: asy } = verticalFlow(this, this.alternate, 0, 0, row + 1, column + 1, callback);
        const { spanX: csx, spanY: csy } = verticalFlow(this, this.consequent, 0, 0, row + 1, column, callback);
        let spanY = Math.max(csy, asy) + 1;
        let spanX = Math.max(csx, 1) + Math.max(asx, 1);
        const { spanY: syend, spanX: sxend } = this.Endpoint.reflowPreCalculate(row + spanY, column, callback);
        spanY += syend;
        spanX = Math.max(spanX, sxend);
        this.spanX = spanX;
        this.spanY = spanY;
        return {
            spanX: this.spanX, 
            spanY: this.spanY, 
            row, column,
        };
    }

    linkSource(source, linkMeta) {
        this.source[linkMeta.part].unshift(source);
    }
}

const TYPE_MAPPING = {
    'If': IFstatement,
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
            console.log(n.__endpoint__ )
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