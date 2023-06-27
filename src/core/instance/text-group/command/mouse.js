import Command from './base';

import { MOUSE_COMMANDS } from '../base/constants';
import JFlowEvent from '../../../events/index';

export class StartEditCommand extends Command {
    static name = MOUSE_COMMANDS.START_EDIT;

    exec() {
        const editor = this._editor;
        if(!this._startEdit()) {
            return;
        }
        const jflow = editor._jflow;
        editor.moveCaretByHitPoint();
        editor.createShadowInput();
        editor._caret.animate(jflow);
        editor.syncShadowInputPosition();
    }

    _startEdit() {
        let flag = true;
        const editor = this._editor;
        editor.dispatchEvent(new JFlowEvent('edit', {
            target: editor,
            preventDefault() {
                flag = false;
            }
        })) 
        return flag; 
    }
}
export class EditClickCommand extends Command {
    static name = MOUSE_COMMANDS.EDIT_CLICK;

    exec() {
        const editor = this._editor;
        editor.moveCaretByHitPoint();
        editor._caret.refresh();
        editor.syncShadowInputPosition();
        editor._range.disable();
    }
}

export class DoubleClickCommand extends Command {
    static name = MOUSE_COMMANDS.DOUBLE_CLICK;

    exec() {
        const editor = this._editor;
        editor.moveCaretByHitPoint();
        const caret = editor._caret;
        const range = editor._range;
        const area = editor._area;
        const row = caret.getRow();
        const line = area.get(row);
        const elem_idx = line.length() - 1;
        range.setInitialRange([row, 0, 0]);
        range.setRange([
            row, elem_idx, line.tail().tailOffset()
        ]);
        range.handleCaret(caret);
        range.enable();
        editor.syncShadowInputPosition();
    }
}
