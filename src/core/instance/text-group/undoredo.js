export default class UndoRedo {
    static length = 50;
    _undo = [];
    _redo = [];
    _editor = null;

    write(x) {
        this._undo.push(x);
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