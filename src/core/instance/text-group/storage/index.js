import { calculateOffsetByWidth } from '../utils'
export class Area {
    _lines = []; 

    get(idx) {
        return this._lines[idx];
    }

    getLineAbove(offsetY) {
        let row = 0;
        const lines = this._lines;
        while(row < lines.length) {
            if(lines[row].reduceHeight > offsetY) {
                break;
            }
            row ++;
        }
        return Math.min(row, lines.length - 1);
    }

    truncate(configs) {
        const l = Line.create(configs);
        this._lines = [l];
        return l;
    }

    push(line) {
        this._lines.push(line);
    }

    forEach(callback) {
        this._lines.forEach(callback);
    }

    length() {
        return this._lines.length;
    }
}

export class Line {
    width = 0;
    anchorY = 0;
    height = 0;
    reduceHeight = 0;
    _elements = []

    static create(configs) {
        const l = new Line(configs);
        return l;
    }

    constructor(configs = {}) {
        Object.assign(this, configs);
    }

    _elements = [];

    get(idx) {
        return this._elements[idx];
    }
    length() {
        return this._elements.length;
    }

    insert(idx, elem) {
        this._elements.splice(idx, 0, elem)
    }
    push(elem) {
        this._elements.push(elem);
    }
    tail() {
        return this._elements[this._elements.length-1];
    }
    copy() {
        return this._elements.slice();
    }

    getColumnNearest(offsetX, elementSpace, fontSize, fontFamily, editor) {
        const elements = this._elements;
        if(offsetX >= this.width) {
            const c = elements.length - 1;
            const elem = elements[c];
            let q = 0;
            if(elem.type === 'text') {
                q = elem.source.length;
            } 
            return [c, q]
        } else {
            let elem_idx = 0;
            let last_c = 0;
            let _c = 0; 
            let lastel = null;
            while(elem_idx < elements.length -1) {
                last_c = _c;
                const el = elements[elem_idx];
                if(el.type !== 'text') {
                    const doubleMargin = (lastel && lastel.type === 'text');
                    const margin = doubleMargin ? elementSpace*2 : elementSpace;
                    _c += (el.width + margin);
                } else {
                    _c += el.width;
                }
                if(_c > offsetX) {
                    lastel = el
                    break;
                }
                lastel = el
                
                elem_idx++;
                
            }
            if(_c <= offsetX) {
                last_c = _c;
            }
            const textmeta = elements[elem_idx];
            if(textmeta.type === 'text') {
                const offx = offsetX - last_c;
                const idx = calculateOffsetByWidth(offx, textmeta, fontSize, fontFamily, editor.spaceHolder)
                return [elem_idx, idx];
            } else {
                const offx = offsetX - last_c;
                if(offx > lastel.width/2){
                    return [elem_idx+1, 0]
                } else {
                    return [elem_idx, 0];
                }
               
            }
        }
    }

    forEach(callback) {
        this._elements.forEach(callback);
    }
}

export class FlattenTextElements {
    static create(elements) {
        const _e = new FlattenTextElements();
        _e.from(elements);
        return _e;
    }
    _textElements = [];
    _records = [];
    _caretRecord = null;

    insertBefore(anchor, elem) {
        const idx = this.findIndex(anchor);
        this.inersetAt(idx, elem);
    }
    insertAfter(anchor, elem, needWrap) {
        const idx = this.findIndex(anchor);
        // const next = this.get(idx+1);
        if(needWrap) {
            elem.setNeedWrap(true);
        }
        this.inersetAt(idx+1, elem);
    }
    findIndex(elem) {
        return this._textElements.findIndex(el => el === elem);
    }
    get(idx) {
        return this._textElements[idx];
    }
    from(elements) {
        this._textElements = elements;
    }
    inersetAt(idx, elem) {
        this.splice(idx, 0, elem)
    }
    push(elem) {
        this.splice(this.length(), 0, elem);
    }
    remove(idx) {
        this.splice(idx, 1);
    }
    splice() {
        const removed = this._textElements.splice(...arguments);
        this._records.push({
            op: 'splice',
            args: arguments,
            removed,
        })
    }
    slice(...args) {
        return this._textElements.slice(...args)
    }
    copy() {
        return this._textElements.slice();
    }
    isEmpty() {
        return this._textElements.length === 1 && this._textElements[0].source === '';
    }
    forEach(callback) {
        this._textElements.forEach(callback);
    }
    tail() {
        return this._textElements[this._textElements.length-1];
    }
    filter(callback) {
        return this._textElements.filter(callback);
    }
    length() {
        return this._textElements.length;
    }

    startRecord() {
        this._caretRecord = {
            before: null,
            after: null,
        }
        this._records = [];
        return this._records;
    }

    getRecord() {
        return this._records;
    }

    recordBeforeCaret(caret) {
        this._caretRecord.before = caret.toRange();
    }

    recordAfterCaret(caret) {
        this._caretRecord.after = caret.toRange();
    }

    getCaretRecord() {
        return this._caretRecord;
    }

    collectRecords() {
        return this._records;
    }
}

export class TextElement {
    needWrap = false;
    width = 0;
    reduceWidth = 0;
    height = 0;
    anchorX = 0;
    anchorY = 0;
    dirty = true;
    isTail = false;

    _spaceRecords = [];
    _spacedContentSegmnent = [];
    _returnSymbol = {
        symbol: '↲',
        width: 0,
    };

    constructor(type, source) {
        this.type = type;
        this.source = source;
    }

    getRenderSource(spaceHolder) {
        const content = this.source;
        if(spaceHolder.enable) {
            return content.replace(/\s/g, spaceHolder.spacePlaceholder);
        }

        return content;
    }

    setSourceWithRecord(source, spaceHolder, records) {
        const lastSource = this.source;
        this.setSource(source, spaceHolder);
        if(records) {
            records.push({
                op: 'setSource',
                args: [this, source, lastSource],
            });
        }
    }

    setSource(source, spaceHolder) {
        this.source = source;
        this.dirty = true;
        if(spaceHolder.enable) {
            const r = this._spaceRecords;
            const p = spaceHolder.spacePlaceholder
            r.length = 0;
            let lastOffset;
            source.replace(/\s/g, (_, offset) => {
                if(lastOffset === undefined) {
                    lastOffset = offset;
                    r.push(offset);
                }
                if(offset - lastOffset > 1) {
                    r.push(lastOffset);
                    r.push(offset);
                }
                lastOffset = offset;
            
                return p;
            })
            if(lastOffset !== undefined) {
                r.push(lastOffset);
            }
        }
    }

    setNeedWrap(needWrap, records) {
        const lastWrap = this.needWrap;
        this.needWrap = needWrap;
        if(lastWrap!== needWrap && records) {
            records.push({
                op: 'setNeedWrap',
                args: [this, needWrap, lastWrap],
            })
        }
    }

    shift(offset, step) {
        if(this.type === 'text') {
            const content = this.source;
            const l = content.length;
            const nextOffset = offset + step;
            if(nextOffset < 0) {
                return 'prev';
            }
            if(nextOffset > l ){//- ((isTail || this.needWrap) ? 0 : 1)) {
                return 'next';
            }
            return 'self';
        } else {
            if(step > 0) {
                return 'next';
            } 
            if(step < 0){
                return 'prev';
            }
        }
    }

    tailOffset() {
        if(this.type === 'text') {
            if(this.needWrap || this.isTail){
                return this.source.length;
            } else {
                return Math.max(0, this.source.length - 1);
            }
        } else {
            return 0;
        }
    }

    headOffset() {
        return 0;
    }

    preCalculateText(ctx, spaceHolder) {
        const content = this.getRenderSource(spaceHolder);
        this.width = ctx.measureText(content).width;
        this.dirty = false;
        if(spaceHolder.enable) {
            const s_width = ctx.measureText(spaceHolder.spacePlaceholder).width;
            this._returnSymbol.width = ctx.measureText(this._returnSymbol.symbol).width;
            const r2 = this._spacedContentSegmnent;
            let lastOffset = 0;
            r2.length = 0;
            if(this._spaceRecords.length) {
                const r = this._spaceRecords;      
                const l = r.length;
                let i = 0;
                while(i < l) {
                    const f = r[i++];
                    const t = r[i++];
                    const q = content.substring(lastOffset, f);
                    r2.push([
                        q,
                        ctx.measureText(q).width,
                        'text',
                    ])
                    r2.push([
                        content.substring(f, t+1),
                        (t - f + 1) * s_width,  
                        'placeholder',
                    ])
                    lastOffset = t+1
                }
            }
            if(lastOffset < content.length) {
                const q = content.substring(lastOffset);
                r2.push([
                    q,
                    ctx.measureText(q).width,
                    'text',
                ])
            }

            if(this.needWrap) {
                this.width += this._returnSymbol.width;
            }
        }
        
    }

    render(ctx, spaceHolder, textColor) {
        if(spaceHolder.enable) {
            const hw = this.width/2;
            let _w =  -hw + this.anchorX;
            const spacePlaceholderColor = spaceHolder.spacePlaceholderColor;
            this._spacedContentSegmnent.forEach(seg => {
                ctx.fillStyle = seg[2] === 'text' ? textColor : spacePlaceholderColor;
                const t = seg[1]/2;
                _w += t;
                ctx.fillText(seg[0], _w, this.anchorY);
                _w += t;
            })
            if(this.needWrap) {
                ctx.save();
                ctx.font = spaceHolder.returnFont;
                ctx.fillStyle = spacePlaceholderColor;
                ctx.fillText(this._returnSymbol.symbol, 
                    _w + this._returnSymbol.width/2, this.anchorY);
                ctx.restore();
            }
            return;   
        }
        ctx.fillText(this.source, this.anchorX, this.anchorY)
    }
}