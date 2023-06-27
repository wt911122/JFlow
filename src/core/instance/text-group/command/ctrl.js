import Command from './base';
import { KEYBOARD_COMMANDS } from '../base/constants';

export class CtrlACommand extends Command {
    static name = KEYBOARD_COMMANDS.CTRLA;
    exec() {
        const editor = this._editor;
        const caret = editor._caret;
        const range = editor._range;
        const area = editor._area;
        const row = area.length() - 1;
        const line = area.get(row);
        const elem_idx = line.length() - 1;
        range.setInitialRange([0, 0, 0]);
        range.setRange([
            row, elem_idx, line.tail().tailOffset()
        ]);
        range.handleCaret(caret);
        range.enable();
        editor.syncShadowInputPosition();
    }
}
