import Command from './base';
import { KEYBOARD_COMMANDS } from '../base/constants';

export class ArrowLeftCommand extends Command {
    static _name = KEYBOARD_COMMANDS.ARROW_LEFT;

    exec() {
        const editor = this._editor;
        editor._range.disable();
        const flattenTxtElem = editor._flattenTxtElem
        const caret = editor._caret;
        const row = caret.getRow();
        const column = caret.getColumn();
        const [elemidx, offset] = column;
        const line = editor._area.get(row);
        const element = line.get(elemidx);
        const idx = flattenTxtElem.findIndex(element);
        const result = element.shift(offset, -1);
        switch(result) {
            case 'prev':
                if(elemidx > 0) {
                    const el = line.get(elemidx - 1);
                    caret.setColumn([elemidx - 1, el.tailOffset()])
                } else if(idx > 0) {
                    const preRow = row - 1;
                    const preElemidx = editor._area.get(preRow).length() - 1
                    const offset = flattenTxtElem.get(idx-1).tailOffset();
                    caret.setRow(preRow);
                    caret.setColumn([preElemidx, offset]);
                }
                break;
            case 'self':
                caret.setColumn(1, offset - 1)
                break;
        }
        caret.refresh();
        editor.syncShadowInputPosition();
        editor._jflow._render();
    }
}
export class ArrowRightCommand extends Command {
    static _name = KEYBOARD_COMMANDS.ARROW_RIGHT;

    exec() {
        const editor = this._editor;
        editor._range.disable();
        const flattenTxtElem = editor._flattenTxtElem
        const caret = editor._caret;
        const row = caret.getRow();
        const column = caret.getColumn();
        const [elemidx, offset] = column;
        const line = editor._area.get(row);
        const element = line.get(elemidx);
        const idx = flattenTxtElem.findIndex(element);
        const result = element.shift(offset, 1, idx === flattenTxtElem.length()-1);
        switch(result) {
            case 'next':
                if(elemidx < line.length()-1) {
                    const el = line.get(elemidx + 1);
                    if(element.type === 'text' && el.type !== 'text') {
                        caret.setColumn([elemidx + 2, el.headOffset()])
                    } else {
                        caret.setColumn([elemidx + 1, el.headOffset()])
                    }
                } else if(idx < flattenTxtElem.length()-1) {
                    const afterRow = row + 1;
                    const offset = flattenTxtElem.get(idx + 1).headOffset();
                    caret.setRow(afterRow);
                    caret.setColumn([0, offset]);
                }            
                break;
            case 'self':
                caret.setColumn(1, offset + 1);
                break;
        }

        caret.refresh();
        editor.syncShadowInputPosition();
        editor._jflow._render();
    }
}
export class ArrowUpCommand extends Command {
    static _name = KEYBOARD_COMMANDS.ARROW_UP;

    exec() {
        this._editor._range.disable();
        const nextRow = this._editor._caret.getRow() - 1;
        if(nextRow > -1){
            this._handler(nextRow);
        }
    }
}
export class ArrowDownCommand extends Command {
    static _name = KEYBOARD_COMMANDS.ARROW_DOWN;

    exec() {
        this._editor._range.disable();
        const nextRow = this._editor._caret.getRow() + 1;
        if(nextRow < this._editor._area.length()){
            this._handler(nextRow);
        }
    }
}
const _mixin = {
    _handler(nextRow) {
        const editor = this._editor;
        const caret = editor._caret;
        const row = caret.getRow();
        const column = caret.getColumn();
        const [elemidx, offset] = column;
        const area = editor._area;
        const line = area.get(row);
        let currElem = line.get(elemidx);
        let currElemReduceWidth = currElem.reduceWidth;
        if(offset > 0) {
            currElemReduceWidth += editor.measureTextWidth(currElem.getRenderSource(editor.spaceHolder).substring(0, offset))
        }
        
        const nextLine = area.get(nextRow);
        const nextColumn = nextLine.getColumnNearest(currElemReduceWidth, editor.elementSpace, editor.fontSize, editor.fontFamily, editor)
        caret.setRow(nextRow);
        caret.setColumn(nextColumn);
        
        caret.refresh();
        editor.syncShadowInputPosition();
        editor._jflow._render();
    }
}

Object.assign(ArrowUpCommand.prototype, _mixin);
Object.assign(ArrowDownCommand.prototype, _mixin);