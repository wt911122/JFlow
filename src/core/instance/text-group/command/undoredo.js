import Command from './base';
import { KEYBOARD_COMMANDS } from '../base/constants';

export class UndoCommand extends Command {
    static name = KEYBOARD_COMMANDS.UNDO;
    exec() {
        this._editor._range.disable()
        this._editor._undoredo.undo();
        this._editor.refresh();

    }
}

export class RedoCommand extends Command {
    static name = KEYBOARD_COMMANDS.REDO;
    exec() {
        this._editor._range.disable()
        this._editor._undoredo.redo();
        this._editor.refresh();
    }
}