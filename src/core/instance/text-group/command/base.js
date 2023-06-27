class Command {
    static create(editor) {
        return new this(editor)
    }

    constructor(editor) {
        this._editor = editor;
    }

    exec() {}
}

export default Command;