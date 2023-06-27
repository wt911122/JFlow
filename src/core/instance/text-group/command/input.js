import Command from './base';
import { TextElement } from '../storage';
import { EDITOR_EVENTS, KEYBOARD_INPUT } from '../base/constants';
function _blandAdjacentElement(elem1, elem2, defaultOffset) {
    if(!elem1) {
        return [defaultOffset, false];
    }
    if(elem1.type === 'text' && elem2.type === 'text') {
        const offset = elem1.source.length;
        elem1.source += elem2.source;
        elem1.dirty = true;
        elem1.needWrap = elem2.needWrap;
        return [offset, true];
    }
    return [defaultOffset, false];
}

export class Input extends Command {
    static name = EDITOR_EVENTS.INPUT;

    cacheIdx = null;

    exec(kind, data) {
        const editor = this._editor;
        const range = editor._range;
        if(range.isEnable()) {
            range.delete(editor);
            if(kind === KEYBOARD_INPUT.BACKSPACE || kind === KEYBOARD_INPUT.DELETE) {
                this._editor.refresh();
                return;
            }
        }
        const caret = editor._caret;
        const flattenTxtElem = editor._flattenTxtElem;
        const row = caret.getRow();
        let [elem_idx, offset] = caret.getColumn();
        const area = editor._area;
        const line = area.get(row);
        let element = line.get(elem_idx);
        let preElem = line.get(elem_idx-1);
        
        let content = '';
        if(element.type === 'text') {
            content = element.source;
        } else if(preElem?.type ==='text'){
            content = preElem.source;
            element = preElem;
            offset = content.length;
            caret.setColumn([elem_idx-1, content.length]);
        } else {
            const newElement = new TextElement('text', '');
            flattenTxtElem.insertBefore(element, newElement);
            element = newElement;
        }

        let preContent = content.substring(0, offset);
        let afterContent 
        if(this.cacheIdx) {
            afterContent = content.substring(this.cacheIdx[1]);
        } else {
            afterContent = content.substring(offset);
        }

        switch(kind){
            case KEYBOARD_INPUT.INPUT:
                if(/\r?\n/.test(data)) {
                    const source = data.split(/\r?\n/);
                    let idx = flattenTxtElem.findIndex(element);
                    let a = source.shift();
                    element.source = preContent + a;
                    element.needWrap = true;
                    let _row = row + 1;
                    idx++;
                    while(source.length > 1) {
                        const t = new TextElement('text', source.shift());
                        t.needWrap = true;
                        _row++;
                        flattenTxtElem.inersetAt(idx, t);
                        idx++;
                    }
                    a = source.shift();
                    const curElem = flattenTxtElem.get(idx);
                    if(curElem && curElem.type === 'text') {
                        curElem.source = a + curElem.source;
                    } else {
                        const t = new TextElement('text', a);
                        flattenTxtElem.inersetAt(idx, t);
                    }
                    caret.setRow(_row);
                    caret.setColumn([0, a.length])
                } else {
                    preContent += data;
                    caret.setColumn(1, caret.getColumn(1) + data.length);
                    element.source = preContent + afterContent;
                }
                element.dirty = true;
                break;
            case KEYBOARD_INPUT.COMPOSITION_START:
                this.cacheIdx = [preContent.length, preContent.length];
                break;
            case KEYBOARD_INPUT.COMPOSITION_UPDATE:
                preContent = preContent.substring(0, this.cacheIdx[0]);
                preContent += data;
                element.source = preContent + afterContent;
                element.dirty = true;
                const _t = this.cacheIdx[0] + data.length;
                caret.setColumn(1, _t);
                this.cacheIdx[1] = _t;
                break;
            case KEYBOARD_INPUT.COMPOSITION_END:
                preContent = preContent.substring(0, this.cacheIdx[0]);
                caret.setColumn(1, this.cacheIdx[0] + data.length);
                this.cacheIdx = null;
                preContent += data;
                element.source = preContent + afterContent;
                element.dirty = true;
                break;
            case KEYBOARD_INPUT.ENTER:
                element.source = preContent;
                element.dirty = true;
                element.needWrap = true;
                const t = new TextElement('text', afterContent);
                flattenTxtElem.insertAfter(element, t);
                caret.setRow(row+1);
                caret.setColumn([0, 0])
                break;
            
            case KEYBOARD_INPUT.BACKSPACE:
                const result = element.shift(offset, -1);
                switch(result) {
                    case 'prev':
                        let idx = flattenTxtElem.findIndex(element);
                        if(elem_idx > 0) {
                            // 行内
                            flattenTxtElem.splice(idx-1, 1);
                            idx -= 1;
                            element.source = afterContent;
                            element.dirty = true;
                            const [offset, deleteop] = _blandAdjacentElement(flattenTxtElem.get(idx-1), element, 0);
                            if(deleteop) {
                                flattenTxtElem.remove(idx);
                            }
                            caret.setColumn([elem_idx - (offset > 0?2:1), offset])
                            
                        } else if(idx > 0) {
                            // 换行了
                            const preRow = row - 1;
                            const preElemidx = area.get(preRow).length() - 1;
                            const [offset, deleteop] = _blandAdjacentElement(flattenTxtElem.get(idx-1), element, 0);
                            if(deleteop) {
                                flattenTxtElem.remove(idx);
                            }
                            caret.setRow(preRow);
                            caret.setColumn([preElemidx, offset]);
                        }
                        break;
                    case 'self':
                        preContent = preContent.substring(0, preContent.length - 1);
                        caret.setColumn(1, caret.getColumn(1)-1)
                        element.source = preContent + afterContent;
                        element.dirty = true;
                        break;
                }
                break;
            case KEYBOARD_INPUT.DELETE:
                const shiftresult = element.shift(offset, 1);
                switch(shiftresult) {
                    case 'next':
                        let idx = flattenTxtElem.findIndex(element);
                        if(elem_idx < line.length()-1) {
                            // 行内
                            flattenTxtElem.splice(idx+1, 1);
                            const nextElem = flattenTxtElem.get(idx+1);
                            const [offset, deleteop] = _blandAdjacentElement(element, nextElem, element.source.length);
                            if(deleteop) {
                                flattenTxtElem.remove(idx+1);
                            }
                            caret.setColumn([elem_idx, offset])
                            
                        } else if(idx < flattenTxtElem.length()-1){
                            // 换行了
                            const nextElem = flattenTxtElem.get(idx+1);
                            const [offset, deleteop] = _blandAdjacentElement(element, nextElem, element.source.length);
                            if(deleteop) {
                                flattenTxtElem.remove(idx+1);
                            }
                            caret.setColumn([elem_idx, offset])
                        }
                        break;
                    case 'self':
                        afterContent = afterContent.substring(1);
                        element.source = preContent + afterContent;
                        element.dirty = true;
                        break;
                }
                break;
        }
        this._editor.refresh();
    }

    
}