import { TextElement } from "../storage";
class Range {
    _enable = false;
    _rangeFrom = null; // [row, elem_idx, offset]
    _rangeTo = null;   // [row, elem_idx, offset]
    _initialRange = null; 

    setInitialRange(initialRange) {
        this._initialRange = initialRange;
    }

    getRangeFrom() {
        return this._rangeFrom;
    }

    getRangeTo() {
        return this._rangeTo;
    }

    isEnable() {
        return this._enable;
    }

    enable() {
        this._enable = true;
    }
    disable() {
        this._enable = false;
    }

    handleCaret(caret) {
        const [a, b, c] = this._rangeTo;
        caret.setRow(a);
        caret.setColumn([b, c]);
    }

    setRange(another) {
        const a = this._initialRange;
        if(this._compareRange(a, another)) {
            this._rangeFrom = a;
            this._rangeTo = another;
        } else {
            this._rangeFrom = another;
            this._rangeTo = a;
        }

    }

    _compareRange(r1, r2) {
        if(r1[0] > r2[0]) {
            return false;
        }
        if(r1[0] === r2[0] && r1[1] > r2[1]) {
            return false;
        }
        if(r1[0] === r2[0] && r1[1] === r2[1] && r1[2] > r2[2]) {
            return false;
        }
        return true;
    }

    delete(editor) {
        if(this._enable) {
            const area = editor._area;
            const caret = editor._caret;
            const rangeFrom = this._rangeFrom;
            const rangeTo = this._rangeTo;
            const elemFrom = area.get(rangeFrom[0]).get(rangeFrom[1]);
            const elemTo = area.get(rangeTo[0]).get(rangeTo[1]);
            let [row, elem_idx, offset] = rangeFrom;
            if(elemFrom === elemTo) {
                const c = elemFrom.source;
                elemFrom.source = c.substring(0, rangeFrom[2]) + c.substring(rangeTo[2]);
                elemFrom.dirty = true;
            } else {
                const flattenTxtElem = editor._flattenTxtElem
                let preContent = '';
                let afterContent = '';
                let preElement;
                let afterElement;  
                const fromIdx = flattenTxtElem.findIndex(elemFrom);
                const toIdx = flattenTxtElem.findIndex(elemTo);
                let endTextNeedWrap = false;
                if(elemFrom.type === 'text') {
                    preContent = elemFrom.source.substring(0, rangeFrom[2]);
                } else {
                    preElement = flattenTxtElem.get(fromIdx-1)
                }
                if(elemTo.type === 'text') {
                    afterContent = elemTo.source.substring(rangeTo[2]);
                    endTextNeedWrap = elemTo.needWrap;
                } else {
                    afterElement = flattenTxtElem.get(toIdx-1);
                }

                if(preElement) {
                    flattenTxtElem.splice(fromIdx, toIdx-fromIdx+1);
                    if(preElement.type === 'text') {
                        if(preElement.needWrap) {
                            row -= 1;
                        } else {
                            elem_idx -= 1;
                        }
                        offset = preElement.source.length;
                        preElement.source += afterContent;
                        preElement.dirty = true;
                        preElement.needWrap = endTextNeedWrap;
                    } else {
                        const t = new TextElement('text', preContent + afterContent);
                        t.needWrap = endTextNeedWrap;
                        flattenTxtElem.splice(fromIdx, 0, t)
                    }
                } else {
                    flattenTxtElem.splice(fromIdx, toIdx-fromIdx);
                    if(afterElement) {
                        const t = new TextElement('text', preContent);
                        flattenTxtElem.splice(fromIdx, 0, t);
                    } else {
                        elemTo.source = preContent + afterContent;
                        elemTo.dirty = true;
                    }
                }
                
                if(flattenTxtElem.length() === 0) {
                    // elem_idx = 0;
                    flattenTxtElem.push(new TextElement('text', ''));
                }

            }
            this.disable();
            
            caret.setRow(row);
            caret.setColumn([elem_idx, offset]);
        }
    }
}
export default Range;