import Command from './base';
import { KEYBOARD_COMMANDS, EDITOR_EVENTS, KEYBOARD_INPUT } from '../base/constants';
import JFlowEvent from '../../../events';
export class CopyCommand extends Command {
    static _name = KEYBOARD_COMMANDS.COPY;
    exec(event) {
        const editor = this._editor;
        const range = editor._range;
        const content = range.getRangeCopy(editor);
        if(content) {
            event.clipboardData.setData("text/plain", content);
        }
    }
}

export class CutCommand extends Command {
    static _name = KEYBOARD_COMMANDS.CUT;
    exec(event) {   
        const editor = this._editor;
        const range = editor._range;
        const content = range.getRangeCopy(editor);
        if(content) {
            event.clipboardData.setData("text/plain", content);
        }
        if(range.isEnable()) {
            const cmd = editor.commands.get(EDITOR_EVENTS.INPUT);
            cmd.exec(KEYBOARD_INPUT.BACKSPACE);
        }
    }
}

export class PasteCommand extends Command {
    static _name = KEYBOARD_COMMANDS.PASTE;
    exec(pasteContent) {
        const editor = this._editor;
        if(pasteContent) {
            let _preventDefault = false;
            editor.dispatchEvent(new JFlowEvent('paste', {
                content: pasteContent,
                preventDefault: () => {
                    _preventDefault = true;
                }
            }));
            if(!_preventDefault) {
                const cmd = editor.commands.get(EDITOR_EVENTS.INPUT);
                cmd.exec(KEYBOARD_INPUT.INPUT, pasteContent);  
            }
        }
    }
}


