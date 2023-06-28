import Command from './base';
import { KEYBOARD_COMMANDS, MOUSE_COMMANDS } from '../base/constants';

export class ShiftUpCommand extends Command {
    static name = KEYBOARD_COMMANDS.SHIFT_UP;
    exec() {
        const range = this._editor._range;
        range.setInitialRange(null);
        this._editor.toggleShift(false)
    }
}

export class ShiftDownCommand extends Command {
    static name = KEYBOARD_COMMANDS.SHIFT_DOWN;
    
    exec() {
        const range = this._editor._range;
        const caret = this._editor._caret;
        range.setInitialRange(caret.toRange());
        this._editor.toggleShift(true)
    }
}

export class ShiftOnClickCommand extends Command {
    static name = MOUSE_COMMANDS.SHIFT_ON_CLICK;

    exec() {
        const editor = this._editor;
        editor.moveCaretByHitPoint();
        const caret = this._editor._caret;
        const range = this._editor._range;
        range.setRange(caret.toRange());
        range.enable();
        range.handleCaret(caret);
        caret.refresh();
        editor.syncShadowInputPosition();
    }
}