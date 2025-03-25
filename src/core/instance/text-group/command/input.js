import Command from './base';
import { TextElement } from '../storage';
import { EDITOR_EVENTS, KEYBOARD_INPUT } from '../base/constants';
function _blandAdjacentElement(editor, elem1, elem2, defaultOffset, records) {
    if(!elem1) {
        return [defaultOffset, false];
    }
    if(elem1.type === 'text' && elem2.type === 'text') {
        const offset = elem1.source.length;
        elem1.setSourceWithRecord(elem1.source + elem2.source, editor.spaceHolder, records);
        elem1.setNeedWrap(elem2.needWrap, records)
        return [offset, true];
    }
    return [defaultOffset, false];
}

export class Input extends Command {
    static _name = EDITOR_EVENTS.INPUT;

    cacheIdx = null;

    exec(kind, data) {
        const editor = this._editor;
        const range = editor._range;
        const caret = editor._caret;
        const flattenTxtElem = editor._flattenTxtElem;
        const undoredo = editor._undoredo;
        const records = flattenTxtElem.startRecord();
        flattenTxtElem.recordBeforeCaret(caret);
        // let _afterRangeDelete = false;
        if(range.isEnable()) {
            range.delete(editor, records);
            if(kind === KEYBOARD_INPUT.BACKSPACE || kind === KEYBOARD_INPUT.DELETE) {
                flattenTxtElem.collectRecords();
                flattenTxtElem.recordAfterCaret(caret);
                this._editor.refresh();
                undoredo.write(records, flattenTxtElem.getCaretRecord());
                return;
            } else {
                this._editor.refresh();
                // _afterRangeDelete = true;
            }
        }
        
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
            elem_idx -= 1;
            caret.setColumn([elem_idx, content.length]);
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
                // if(_afterRangeDelete) {
                //     element = flattenTxtElem.get(0);
                //     afterContent = '';
                //     preContent = '';
                // }
                if(/\r?[\n\t]/.test(data)) {
                    let rows = data.split(/\r?[\n\t]/) || '';
                    // source = source.replace(/\t/, '');
                    const idx = flattenTxtElem.findIndex(element);
                    const lastNeedWrap = element.needWrap;
                    element.setSourceWithRecord(preContent + rows.shift(), editor.spaceHolder, records);
                    element.setNeedWrap(true, records);
                    const temp = [];
                    let tn;
                    let _row = row;
                    let col;
                    while(rows.length){
                        tn = new TextElement('text', rows.shift());
                        tn.needWrap = true;
                        temp.push(tn);
                        _row++;
                    }
                    col = tn.source.length;
                    tn.source += afterContent;
                    tn.needWrap = lastNeedWrap;
                    temp.forEach((t, i) => {
                        flattenTxtElem.inersetAt(idx + 1 + i, t);
                    });
                    caret.setRow(_row);
                    caret.setColumn([0, col])
                } else {
                    preContent += data;
                    caret.setColumn(1, caret.getColumn(1) + data.length);
                    element.setSourceWithRecord(preContent + afterContent, editor.spaceHolder, records);
                }
                break;
            case KEYBOARD_INPUT.COMPOSITION_START:
                this.cacheIdx = [preContent.length, preContent.length];
                break;
            case KEYBOARD_INPUT.COMPOSITION_UPDATE:
                preContent = preContent.substring(0, this.cacheIdx[0]);
                preContent += data;
                element.setSourceWithRecord(preContent + afterContent, editor.spaceHolder, records);
                const _t = this.cacheIdx[0] + data.length;
                caret.setColumn(1, _t);
                this.cacheIdx[1] = _t;
                break;
            case KEYBOARD_INPUT.COMPOSITION_END:
                preContent = preContent.substring(0, this.cacheIdx[0]);
                caret.setColumn(1, this.cacheIdx[0] + data.length);
                this.cacheIdx = null;
                preContent += data;
                element.setSourceWithRecord(preContent + afterContent, editor.spaceHolder, records);
                break;
            case KEYBOARD_INPUT.ENTER:
                const lastNeedWrap = element.needWrap;
                element.setSourceWithRecord(preContent, editor.spaceHolder, records);
                element.setNeedWrap(true, records);
                const t = new TextElement('text', afterContent);
                flattenTxtElem.insertAfter(element, t, lastNeedWrap);
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
                            // element.setSource(afterContent, records);
                            // element.dirty = true;
                            const [offset, deleteop] = _blandAdjacentElement(editor, flattenTxtElem.get(idx-1), element, 0, records);
                            if(deleteop) {
                                flattenTxtElem.remove(idx);
                            }
                            caret.setColumn([elem_idx - ((offset > 0 || deleteop)?2:1), offset])
                            
                        } else if(idx > 0) {
                            // 换行了
                            const preRow = row - 1;
                            const preElemidx = area.get(preRow).length() - 1;
                            const [offset, deleteop] = _blandAdjacentElement(editor, flattenTxtElem.get(idx-1), element, 0, records);
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
                        element.setSourceWithRecord(preContent + afterContent, editor.spaceHolder, records);
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
                            const [offset, deleteop] = _blandAdjacentElement(element, nextElem, element.source.length, records);
                            if(deleteop) {
                                flattenTxtElem.remove(idx+1);
                            }
                            caret.setColumn([elem_idx, offset])
                            
                        } else if(idx < flattenTxtElem.length()-1){
                            // 换行了
                            const nextElem = flattenTxtElem.get(idx+1);
                            const [offset, deleteop] = _blandAdjacentElement(element, nextElem, element.source.length, records);
                            if(deleteop) {
                                flattenTxtElem.remove(idx+1);
                            }
                            caret.setColumn([elem_idx, offset])
                        }
                        break;
                    case 'self':
                        afterContent = afterContent.substring(1);
                        element.setSourceWithRecord(preContent + afterContent, editor.spaceHolder, records);
                        break;
                }
                break;
        }

        flattenTxtElem.collectRecords();
        flattenTxtElem.recordAfterCaret(caret);
        undoredo.write(records, flattenTxtElem.getCaretRecord());
        this._editor.refresh();
    }

    
}