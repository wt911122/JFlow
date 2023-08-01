
function isSetSourceBatch(x) {
    return x.length === 1 && x[0].op === 'setSource';
}
export default class UndoRedo {
    static length = 50;
    _undo = [];
    _redo = [];
    _editor = null;

    write(x, caretRecord) {
        if(x.length === 0) {
            return;
        }
        if(isSetSourceBatch(x)) {
            const t = x[0];
            const lastUndo = this.getLastUndo();
            if(lastUndo && isSetSourceBatch(lastUndo._batch)) {
                const q = lastUndo._batch[0];
                if(q.args[0] === t.args[0]) {
                    q.args[1] = t.args[1];
                    lastUndo._caretMetaTo = caretRecord.after;
                    return;
                }
            }
        }
        const r = new BatchAction(x);
        r._caretMetaFrom = caretRecord.before;
        r._caretMetaTo = caretRecord.after;
        this._undo.push(r);
        
        if(this._undo.length > UndoRedo.length) {
            this._undo.splice(0, 1);
        }
        if(this._redo.length) {
            this._redo = [];
        }
    }

    getLastUndo() {
        return this._undo[this._undo.length - 1];
    }

    undo() {
        const x = this._undo.pop();
        if(x) {
            x.undo(this._editor)
            this._redo.push(x);
        }
        return x;
    }

    redo() {
        let x = this._redo.pop();
        while(x && x.SKIP_REDO) {
            x = this._redo.pop();
        }
        if(x) {
            x.redo(this._editor)
            this._undo.push(x);
        }
        return x;
    }
}

class BatchAction {
    _batch = [];
    _caretMetaFrom = null;
    _caretMetaTo = null;
    constructor(batch) {
        this._batch = batch;
    }

    updateCaretMetaTo(meta) {
        this._caretMetaTo = meta;
    }

    undo(editor) {
        this._batch.slice().reverse().forEach(action => {
            switch(action.op) {
                case 'range':
                    const [rangeFrom, rangeTo] = action.args;
                    const range = editor._range;
                    range.setInitialRange(rangeFrom);
                    range.setRange(rangeTo);
                    range.enable();
                    break;
                case 'setSource':
                    const [elem, s, ls] = action.args;
                    elem.setSource(ls, editor.spaceHolder);
                    break;
                case 'setNeedWrap':
                    const [o, p, q] = action.args;
                    o.needWrap = q;
                    o.dirty = true;
                    break;
                case 'splice':
                    const flattenTxtElem = editor._flattenTxtElem;
                    const [a, b, ...c] = action.args;
                    const removed = action.removed;
                    let i = 0
                    if(c) {
                        i = c.length
                    }
                    flattenTxtElem.splice(a, i, ...removed);
                    break;
            }
        });

        editor._caret.fromRange(this._caretMetaFrom);
    }

    redo(editor) {
        this._batch.forEach(action => {
            switch(action.op) {
                case 'setSource':
                    const [elem, s, ls] = action.args;
                    elem.setSource(s, editor.spaceHolder);
                    break;
                case 'setNeedWrap':
                    const [o, p, q] = action.args;
                    o.needWrap = p;
                    o.dirty = true;
                    break;
                case 'splice':
                    const flattenTxtElem = editor._flattenTxtElem;
                    flattenTxtElem.splice(...action.args);
                    break;
            }
        })
        editor._caret.fromRange(this._caretMetaTo);
    }
}