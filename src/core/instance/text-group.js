import Node from './node';
import StackMixin from './stackMixin';
import LayoutMixin from './layoutMixin';
import JFlowEvent from '../events/index';
import { requestCacheCanvas } from '../utils/canvas';
import ShadowCache from './shapes/shadow-cache';
export class TextElement {
    constructor(type, source) {
        this.type = type;
        this.source = source;
        this.needWrap = false;
        this.width = 0;
        this.reduceWidth = 0;
        this.height = 0;
        this.anchorX = 0;
        this.anchorY = 0;
        this.dirty = true;
        this.isTail = false;
    }

    shift(offset, step, isTail) {
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
}

class TextGroup extends Node {
    constructor(configs) {
        super(configs);
        this.initStack(configs);
        this.initLayout(configs);

        this._lines = [];

        this.textColor = configs.textColor || 'transparent';
        this.fontFamily = configs.fontFamily || '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji'
        this.fontSize = configs.fontSize || '28px';
        this.fontWeight = configs.fontWeight || '';
        this.elementSpace = configs.elementSpace || 5;
        this.lineSpace = configs.lineSpace || 5;
        this.placeholder = configs.placeholder || '请输入';
        this.placeholderColor = configs.placeholderColor || '#eee';
        this.cursorColor = configs.cursorColor || '#60CFC4';
        this.textRangeColor = configs.textRangeColor || '#4E75EC1A';
        this.minWidth = configs.minWidth || 0;
        this.resolver = () => {
            const elements = configs.resolver();
            if(elements.length === 0 || elements[elements.length-1].type !== 'text') {
                elements.push(new TextElement('text', ''))
            }
            return elements;
        }
        this._textElements = this.resolver();

        this._status = {
            editing: false,
            dragover: false,
            cursorshow: true,
            cursoranime: null,
            lastElapsed: 0,
            refreshElapsed: false,

            cursorDragging: false,
            shiftOn: false,
        }
        this._cursor = {
            row: 0,
            column: [0,0],
        }

        this._textRange = {
            enable: false,
            rangefrom: null, // [row, elem_idx, offset]
            rangeTo: null,   // [row, elem_idx, offset]
            initialRange: null // [row, elem_idx, offset]
        }
        this._makeFunctional();

        this._buffer = document.createElement('canvas');
    }

    get currentLineHeight() {
        return this.lineHeight || parseInt(this.fontSize);
    }

    // 外部输入    
    setConfig(configs) {
        super.setConfig(configs);
        
    }

    refreshTextElements() {
        this._textElements = this.resolver();
    }

    refresh() {
        this.recalculateUp();
        this._jflow._render();
    }

    getBoundingDimension() {
        return {
            width: this.width,
            height: this.height,
        } 
    }

    render(ctx) {
        ctx.save();
        if(this._isMoving){
            ctx.globalAlpha = 0.6
        } else if(this.opacity !== 1) {
            ctx.globalAlpha = this.opacity;
        }
        const [cx, cy] = this.anchor;
        const width = this.width;
        const height = this.height;
        const jflow = this._jflow;
        const lines = this._lines;
        ctx.translate(cx, cy);
        // ctx.beginPath();
        // ctx.rect(-width/2, -height/2, width, height);
        // ctx.stroke();

        if(this._textElements.length === 1 && this._textElements[0].source === '') {
            ctx.beginPath();
            ctx.font = `${this.fontWeight} ${this.fontSize} ${this.fontFamily}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = this.placeholderColor;
            ctx.fillText(this.placeholder, 0, 0);

            this._randerCursor(ctx);

            ctx.translate(-cx, -cy);
            ctx.restore();
            return;
        }

        ctx.beginPath();
        ctx.font = `${this.fontWeight} ${this.fontSize} ${this.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = this.textColor;
        lines.forEach(line => {
            const { elements } = line;
            elements.forEach(el => {
                if(el.type === 'text') {
                    ctx.fillText(el.source, el.anchorX, el.anchorY)
                } 
            })
        })
        this._textElements.forEach(elem => {
            if(elem.type !== 'text') {
                const instance = jflow.getRenderNodeBySource(elem.source);
                if(instance.visible) {
                    ctx.save();
                    instance.render(ctx);
                    ctx.restore();
                }
            }
        })

        this._randerCursor(ctx);

        if(this._textRange.enable) {
            this._renderRange(ctx);
        } 
        ctx.translate(-cx, -cy);
        ctx.restore();
    }
    
    _randerCursor(ctx) {
        if(this._status.cursorshow && (this._status.editing || this._status.dragover)) {
            const { row, column } = this._cursor;
            const { elements, anchorY } = this._lines[row];
            const [elemidx, offset] = column;
            const meta = elements[elemidx];
            const idx = this._textElements.findIndex(el => el === meta);
            const preElem = this._textElements[idx-1];
            let cw;
            let c_len = this.currentLineHeight/2;
            if(meta.type === 'text') {
                const c = meta.source.substring(0, offset);
                cw = meta.anchorX - meta.width/2 + ctx.measureText(c).width
            } else {
                cw = meta.anchorX - meta.width/2
                c_len = Math.max(c_len, meta.height/2);
            }
            if(offset === 0 && preElem && preElem.type !== 'text') {
                c_len = Math.max(c_len, preElem.height/2);
            }
            
            
            ctx.beginPath();
            ctx.moveTo(cw, anchorY - c_len);
            ctx.lineTo(cw, anchorY + c_len);
            ctx.lineWidth = 2;
            ctx.strokeStyle = this.cursorColor;
            ctx.stroke();
        }
    }

    _renderRange(ctx) {
        const lines = this._lines;
        const textRangeColor = this.textRangeColor;
        const blockheight = this.height;
        const blockwidth = this.width;
        const {
            rangefrom, rangeTo
        } = this._textRange;
        const [r_f, idx_f, offset_f] = rangefrom;
        const [r_t, idx_t, offset_t] = rangeTo;
        if(r_f === r_t) {
            if(idx_f === idx_t && offset_f == offset_t) {
                return;
            }
            const line = lines[r_f];
            let space = (r_f === lines.length-1 ? 0 : this.lineSpace);
            const lty = line.reduceHeight - space - line.height - blockheight/2;
            const height = line.height;
            const x1 = this._measureElementOffsetX(line.elements[idx_f], offset_f, ctx);
            const x2 = this._measureElementOffsetX(line.elements[idx_t], offset_t, ctx);
            ctx.beginPath();
            ctx.rect(x1, lty , x2 - x1, height);
            ctx.fillStyle = textRangeColor
            ctx.fill();
        } else {
            let _r = r_f;
            let beginning = true;
            while(_r <= r_t) {
                const line = lines[_r];
                let space = (_r === lines.length-1 ? 0 : this.lineSpace);
                const lty = line.reduceHeight - space - line.height - blockheight/2;
                const height = line.height;

                if(beginning) {
                    const elem = line.elements[idx_f];
                    const x = this._measureElementOffsetX(elem, offset_f, ctx);
                    const lastElem = line.elements[line.elements.length - 1];
                    const t = lastElem.anchorX + lastElem.width/2;

                    ctx.beginPath();
                    ctx.rect(x, lty, t - x, height);
                    ctx.fillStyle = textRangeColor
                    ctx.fill();
                } else if(_r === r_t){
                    const elem = line.elements[idx_t];
                    const x = this._measureElementOffsetX(elem, offset_t, ctx);
                    ctx.beginPath();
                    ctx.rect(-blockwidth/2, lty , elem.reduceWidth + (x - elem.anchorX + elem.width/2), height);
                    ctx.fillStyle = textRangeColor
                    ctx.fill();
                } else {
                    ctx.beginPath();
                    ctx.rect(-blockwidth/2, lty, line.width, height);
                    ctx.fillStyle = textRangeColor
                    ctx.fill();
                }
                
                beginning = false;
                _r++;
            }
        }
    }

    _measureElementOffsetX(element, offset, ctx) {
        if(element.type !== 'text' || offset === 0){
            return element.anchorX - element.width/2;
        }
        return element.anchorX - element.width/2 + ctx.measureText(element.source.substring(0, offset)).width;
    }

    _makeFunctional() {
        let inputElement;
        const blurHandler = (event) => {
            this._status.editing = false;
            if(inputElement) {
                inputElement.remove();
            }
            if(this._belongs) {
                this._jflow._render();
            } 
        };
        this.addEventListener('dblclick', (event) => {
            if(event.currentTarget !== this) {
                return
            }
            event.detail.bubbles = false;
            const point = this._currentp;
            // const jflow = this._jflow;
            if(this._status.editing) {
                const cursor = this._positionToCursorOffset(point);
                this._selectRowRange(cursor.row);
            } 
            // else {   
            //     this._cursor = this._positionToCursorOffset(point);
            //     inputElement = createInputElement(this._controlCallback.bind(this));
            //     const wrapper = jflow.DOMwrapper;
            //     wrapper.append(inputElement);  
            //     inputElement.focus();      
            //     jflow.setFocusInstance(this);
            //     this._status.editing = true;   
                
            //     this._status.cursoranime = jflow.requestJFlowAnime((elapsed) => {
            //         const lastElapsed = this._status.lastElapsed;
            //         if(this._status.refreshElapsed) {
            //             this._status.lastElapsed = elapsed;
            //             this._status.refreshElapsed = false;
            //         }
            //         if(elapsed - lastElapsed > 500) {
            //             this._status.cursorshow = !this._status.cursorshow;
            //             this._status.lastElapsed = elapsed;
            //         } 
            //     });
            //     this._selectFullRange();
            // }
        });

        this.addEventListener('click', (event) => {
            if(event.currentTarget !== this) {
                return
            }
            event.detail.bubbles = false;
            if(this._status.editing) {
                const point = this._currentp;
                const cursor = this._positionToCursorOffset(point);
                if(this._status.shiftOn) {
                    const rangeAnother = [cursor.row, ...cursor.column];
                    const initialRange = this._textRange.initialRange;
                    if(this._compareRange(initialRange, rangeAnother)) {
                        this._textRange.rangefrom = initialRange;
                        this._textRange.rangeTo = rangeAnother;
                    } else {
                        this._textRange.rangefrom = rangeAnother;
                        this._textRange.rangeTo = initialRange;
                    }
                    this._textRange.enable = true;
                    const [a, b, c] = this._textRange.rangeTo;
                    this._cursor = {
                        row: a,
                        column: [b, c],
                    }
                    inputElement.focus(); 
                } else {
                    this._cursor = cursor
                    inputElement.focus();   
                    this._refreshCursor();  
                }
            } else {
                let flag = true;
                this.dispatchEvent(new JFlowEvent('edit', {
                    target: this,
                    preventDefault() {
                        flag = false;
                    }
                }))  
                if(!flag) {
                    return;
                }
                   
                const point = this._currentp;
                const jflow = this._jflow; 
                this._cursor = this._positionToCursorOffset(point);
                inputElement = createInputElement(this._controlCallback.bind(this));
                const wrapper = jflow.DOMwrapper;
                wrapper.append(inputElement);  
                inputElement.focus();      
                jflow.setFocusInstance(this);
                this._status.editing = true; 
                 
                this._status.cursoranime = jflow.requestJFlowAnime((elapsed) => {
                    const lastElapsed = this._status.lastElapsed;
                    if(this._status.refreshElapsed) {
                        this._status.lastElapsed = elapsed;
                        this._status.refreshElapsed = false;
                    }
                    if(elapsed - lastElapsed > 500) {
                        this._status.cursorshow = !this._status.cursorshow;
                        this._status.lastElapsed = elapsed;
                    } 
                });
                
            }
        })
        this.addEventListener('blur', (event) => {
            blurHandler(event);
            this.dispatchEvent(new JFlowEvent('change', {
                target: this,
                textElements: this._textElements.slice(),
            }));
            this._textRange.enable = false;
            this._status.cursoranime.cancel()
            Object.assign(this._status, {
                editing: false,
                cursorshow: true,
                cursoranime: null,
                lastElapsed: 0,
            })
            this._status.cursorshow = true;
            this._status.cursoranime = null;
        })
        this.addEventListener('instancePressStart', (event) => {
            if(this._status.editing && !this._status.shiftOn) {
                event.detail.bubbles = false;
                event.detail.preventDefault();
                // event.detail.jflow.setMovingTargets(null);
                const point = this._currentp;
                const c = this._positionToCursorOffset(point);
                // this._cursor = c;
                const range = [c.row, ...c.column]
                this._textRange.initialRange = range;
                const jflow = event.detail.jflow;
                let moved = false;
                const t = (e => {
                    moved = true;
                    const { offsetX, offsetY } = e;
                    const p = jflow._calculatePointBack([offsetX, offsetY]);
                    jflow._stack.checkHit(p)
                    const point = this._currentp;
                    const c = this._positionToCursorOffset(point);
                    // this._cursor = c;
                    const rangeAnother = [c.row, ...c.column];
                    const initialRange = this._textRange.initialRange;
                    this._status.editing = false;
                    this._textRange.enable = true;
                    if(this._compareRange(initialRange, rangeAnother)) {
                        this._textRange.rangefrom = initialRange;
                        this._textRange.rangeTo = rangeAnother;
                    } else {
                        this._textRange.rangefrom = rangeAnother;
                        this._textRange.rangeTo = initialRange;
                    }
                }).bind(this);

                document.addEventListener('pointermove', t)
                document.addEventListener('pointerup', (e) => {
                    document.removeEventListener('pointermove', t);
                    if(!moved) {
                        this._textRange.initialRange = null;
                        return;
                    }
                    const [a, b, c] = this._textRange.rangeTo;
                    this._cursor = {
                        row: a,
                        column: [b, c],
                    }
                    this._status.editing = true;
                    inputElement.focus();   
                    this._textRange.initialRange = null;
                }, {
                    once: true,
                })
            }
        });

        this.addEventListener('dragenter', () => {
            const point = this._currentp;
            this._cursor = this._positionToCursorOffset(point);
            this._status.dragover = true;
        });
        this.addEventListener('dragover', () => {
            const point = this._currentp;
            this._cursor = this._positionToCursorOffset(point);
        });
        this.addEventListener('dragleave', () => {
            this._status.dragover = false;
        });
        const onDrop = ((event) => {
            if(!this._status.dragover) {
                return;
            }
            event.detail.bubbles = false;
            this._status.dragover = false;
            const {
                row, column,
            } = this._cursor;
    
            const meta = this._lines[row];
            let [elem_idx, offset] = column;
            let element = meta.elements[elem_idx];
            let preElem = meta.elements[elem_idx-1];
            let idx;
            if(element.type !== 'text') {
                if(preElem?.type ==='text'){
                    offset = preElem.source.length;
                    idx = this._textElements.findIndex(el => el === preElem);
                } else {
                    idx = this._textElements.findIndex(el => el === element);
                }
            } else {
                idx = this._textElements.findIndex(el => el === element);
            }
            const lastLength = this._textElements.length
            this.dispatchEvent(new JFlowEvent('insert', {
                ...event.detail,
                type: event.type,
                textElements: this._textElements.slice(),
                idx, offset,
            }));
            if(this._status.editing) {
                if(this._textElements.length > lastLength) {
                    this._cursor.column[0] += (this._textElements.length - lastLength);
                    this._cursor.column[1] = 0;
                }
                inputElement.focus(); 
            }
            this._refreshCursor();
        }).bind(this)
        this.addEventListener('pressEnd', onDrop)
        this.addEventListener('drop', onDrop);
    }
    _positionToCursorOffset(point) {
        let row;
        let column;

        const [x, y] = point;
        // const [x0, y0] = this.anchor;
        const w = this.width/2;
        const h = this.height/2;
        const offsetX = x + w;
        const offsetY = y + h;
        let lineNumber = 0;
        const lines = this._lines;
        while(lineNumber < lines.length) {
            if(lines[lineNumber].reduceHeight > offsetY) {
                break;
            }
            lineNumber ++;
        }
        row = lineNumber;
        
        const currLine = lines[lineNumber];
        const elements = currLine.elements;
        if(offsetX >= currLine.width) {
            const elem = elements[elements.length - 1];
            let q = 0;
            if(elem.type === 'text') {
                q = elem.source.length;
            } 
            column = [elements.length - 1, q]
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
                    const margin = doubleMargin ? this.elementSpace*2 : this.elementSpace;
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
                const idx = this._calculateOffsetByWidth(offx, textmeta)
                column = [elem_idx, idx];
            } else {
                const offx = offsetX - last_c;
                if(offx > lastel.width/2){
                    column = [elem_idx+1, 0]
                } else {
                    column = [elem_idx, 0];
                }
               
            }
        }

        return {
            row, 
            column,
        }
    }
    
    // _getCurrentPoint() {
    //     this._currentp 
    // }

    _calculateOffsetByWidth(offx, textmeta) {
        const content = textmeta.source;
        const maxL = content.length - 1;
        if(textmeta.width === 0) {
            return 0;
        }
        const allwidth = textmeta.width;
        let idx = Math.floor(offx / allwidth * maxL) ;
        requestCacheCanvas((ctx) => {
            ctx.font = `${this.fontSize} ${this.fontFamily}`;
            /* let g1, g2;
             do {
                const c0 = content.substring(0, idx-1);
                const c1 = content.substring(0, idx);
                const c2 = content.substring(0, idx+1);
                const w0 = ctx.measureText(c0).width;
                const w1 = ctx.measureText(c1).width;
                const w2 = ctx.measureText(c2).width;
                g1 = (w1 - w0)/2 + w0;
                g2 = (w2 - w1)/2 + w1;
                if(g2 < offx) {
                    idx+=1
                } else if(g1 > offx) {
                    idx-=1
                } else if(g1 <= offx && g2 >= offx) {
                    break;
                }
            } while(idx >= 0 && idx <= maxL); */
            let g1, g2;
            let lastidx;

            let c = content.substring(0, idx);
            let c1 = content.substring(idx-1, idx);
            let c2 = content.substring(idx, idx+1);
            let w = ctx.measureText(c).width;
            let w1 = ctx.measureText(c1).width;
            let w2 = ctx.measureText(c2).width;
            g1 = w - w1/2;
            g2 = w + w2/2;
            
            do {
                if(g1 <= offx && g2 >= offx) {
                    break;
                }  
                if(g1 > offx) {
                    // 左侧少了
                    const spanw = g2 - offx;
                    lastidx = idx;
                    if(spanw < 100) {
                        idx -= 1;
                    } else {
                        idx -= Math.floor(spanw / g2 * lastidx)
                    }
                    c = content.substring(idx, lastidx);
                    w -= ctx.measureText(c).width;
                } else if(g2 < offx) {
                    // 右侧少了
                    const spanw = offx - g1;
                    lastidx = idx;
                    if(spanw < 100) {
                        idx += 1;
                    } else {
                        idx += Math.floor(spanw / (allwidth - g1) * (maxL - lastidx))
                    }
                    c = content.substring(lastidx, idx);
                    w += ctx.measureText(c).width;
                }
                
                c1 = content.substring(idx-1, idx);
                c2 = content.substring(idx, idx+1);
                w1 = ctx.measureText(c1).width;
                w2 = ctx.measureText(c2).width;
                g1 = w - w1/2;
                g2 = w + w2/2;
            } while(idx >= 0 && idx <= maxL)
            
        });
        return idx;
    }

    _selectRowRange(row) {
        const lines = this._lines;
        const line = lines[row];
        const elems = line.elements
        const toElemidx = elems.length-1;
        const elem = elems[elems.length-1];
        this._textRange = {
            enable: true,
            rangefrom: [row, 0, 0],
            rangeTo: [row, toElemidx, elem.tailOffset()],
        }
        this._cursor = {
            row,
            column: [toElemidx, elem.tailOffset()]
        }
    }

    _selectFullRange() {
        const lines = this._lines;
        const toRow = lines.length - 1;
        const elems = lines[toRow].elements
        const toElemidx = elems.length-1;
        const elem = elems[elems.length-1];
        this._textRange = {
            enable: true,
            rangefrom: [0, 0, 0],
            rangeTo: [toRow, toElemidx, elem.tailOffset()],
        }
        this._cursor = {
            row: toRow,
            column: [toElemidx, elem.tailOffset()]
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
    _clearTextRange() {
        if(this._textRange.enable) {
            const { rangefrom, rangeTo } = this._textRange;
            const elemFrom = this._lines[rangefrom[0]].elements[rangefrom[1]];
            const elemTo = this._lines[rangeTo[0]].elements[rangeTo[1]];
            let [elem_idx, offset] = rangefrom.slice(1);
            let row = rangefrom[0];
            if(elemFrom === elemTo) {
                const c = elemFrom.source;
                elemFrom.source = c.substring(0, rangefrom[2]) + c.substring(rangeTo[2]);
                elemFrom.dirty = true;
            } else {
                let preContent = '';
                let afterContent = '';
                let preElement;
                let afterElement;
                
                const fromIdx = this._textElements.findIndex(el => el === elemFrom);
                const toIdx = this._textElements.findIndex(el => el === elemTo);
                let endTextNeedWrap = false;
                if(elemFrom.type === 'text') {
                    preContent = elemFrom.source.substring(0, rangefrom[2]);
                } else {
                    preElement = this._textElements[fromIdx-1]
                }
                if(elemTo.type === 'text') {
                    afterContent = elemTo.source.substring(rangeTo[2]);
                    endTextNeedWrap = elemTo.needWrap;
                } else {
                    afterElement = this._textElements[toIdx-1]
                }
                if(preElement) {
                    this._textElements.splice(fromIdx, toIdx-fromIdx+1);
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
                        this._textElements.splice(fromIdx, 0, t)
                    }
                } else {
                    this._textElements.splice(fromIdx, toIdx-fromIdx);
                    if(afterElement) {
                        const t = new TextElement('text', preContent);
                        this._textElements.splice(fromIdx, 0, t);
                    } else {
                        elemTo.source = preContent + afterContent;
                        elemTo.dirty = true;
                    }
                    
                }
                // if(preContent || preElement) {
                    
                //     // if(afterElement) {
                //     //     if(afterElement.type === 'text') {
                //     //         offset = 
                //     //         preElement.source += afterContent;
                //     //     } else {
                //     //         const t = new TextElement('text', preContent + afterContent);
                //     //         this._textElements.splice(fromIdx, 0, t)
                //     //     }
                //     // }
                // } else {
                //     this._textElements.splice(fromIdx, toIdx-fromIdx+1);
                // }
                if(this._textElements.length === 0) {
                    // elem_idx = 0;
                    this._textElements.push(new TextElement('text', ''));
                }
            }
            this._textRange.enable = false;
            this._cursor = {
                row,
                column: [elem_idx, offset],
            }
        }
    }

    _refreshCursor() {
        if(this._status.editing) {
            Object.assign(this._status, {
                cursorshow: true,
                refreshElapsed: true,
            });
        }
        if(this._textRange.enable) {
            this._textRange.enable = false;
        }
    }

    _controlCallback(op, data) {
        if(this._status.editing) {
            Object.assign(this._status, {
                cursorshow: true,
                refreshElapsed: true,
            });
        }
        switch(op){
            case "Input":
            case "compositionstart":
            case "compositionupdate":
            case "compositionend":
            case "Enter":
            case "Backspace":
                this._inputControl(op, data);
                break;
            case "ArrowLeft":
                if(this._textRange.enable) {
                    this._textRange.enable = false;
                }
                this._onArrowLeft();
                break;
            case "ArrowRight":
                if(this._textRange.enable) {
                    this._textRange.enable = false;
                }
                this._onArrowRight();
                break;
            case "ArrowDown":
                if(this._textRange.enable) {
                    this._textRange.enable = false;
                }
                this._onArrowDown();
                break;
            case "ArrowUp":
                if(this._textRange.enable) {
                    this._textRange.enable = false;
                }
                this._onArrowUp();
                break;
            case "Shift":
                this._onShiftToggle(data)
                break;
            case "CtrlA":
                this._selectFullRange();
            default:
                break;
        }
    }

    // 内部输入
    _inputControl(op, data) {
        if(this._textRange.enable) {
            this._clearTextRange();
            if(op === 'Backspace') {
                this.refresh();
                return;
            }
        }
        const {
            row, column,
        } = this._cursor;

        const meta = this._lines[row];
        let [elem_idx, offset] = column;
        let element = meta.elements[elem_idx];
        let preElem = meta.elements[elem_idx-1];
        let content = '';
        if(element.type === 'text') {
            content = element.source;
        } else if(preElem?.type ==='text'){
            content = preElem.source;
            element = preElem;
            offset = content.length;
            this._cursor.column[0] -= 1;
            this._cursor.column[1] = content.length;
        } else {
            const newElement = new TextElement('text', '');
            const idx = this._textElements.findIndex(el => el === element);
            this._textElements.splice(idx, 0, newElement);
            element = newElement;
        }

        let preContent = content.substring(0, offset);
        let afterContent 
        if(this.cacheIdx) {
            afterContent = content.substring(this.cacheIdx[1]);
        } else {
            afterContent = content.substring(offset);
        }
        
        switch(op){
            case "Input":
                preContent += data;
                column[1] += data.length;
                element.source = preContent + afterContent;
                element.dirty = true;
                break;
            case "compositionstart":
                this.cacheIdx = [preContent.length, preContent.length];
                break;
            case "compositionupdate":
                preContent = preContent.substring(0, this.cacheIdx[0]);
                preContent += data;
                element.source = preContent + afterContent;
                element.dirty = true;
                column[1] = this.cacheIdx[0] + data.length;
                this.cacheIdx[1] = this.cacheIdx[0] + data.length;
                break;
            case "compositionend":
                preContent = preContent.substring(0, this.cacheIdx[0]);
                column[1] = this.cacheIdx[0] + data.length;
                this.cacheIdx = null;
                preContent += data;
                element.source = preContent + afterContent;
                element.dirty = true;
                break;
            case "Enter":
                if(this.cacheIdx) {
                    return;
                }
                element.source = preContent;
                element.dirty = true;
                element.needWrap = true;
                const t = new TextElement('text', afterContent);
                const idx = this._textElements.findIndex(el => el === element);
                t.needWrap = this._textElements[idx + 1]?.needWrap || this._textElements[idx + 1]?.isTail;
                this._textElements.splice(idx+1, 0, t);
                this._cursor.row += 1;
                this._cursor.column = [0, 0];
                break;
            case "Backspace":
                const result = element.shift(offset, -1);
                switch(result) {
                    case 'prev':
                        let idx = this._textElements.findIndex(el => el === element);
                        if(elem_idx > 0) {
                            // 行内
                            this._textElements.splice(idx-1, 1);
                            idx -= 1;
                            element.source = afterContent;
                            element.dirty = true;
                            const offset = this._blandAdjacentElement(this._textElements[idx-1], element, idx);
                            this._cursor.column = [elem_idx - (offset > 0?2:1), offset];
                            
                        } else if(idx > 0) {
                            // 换行了
                            const preRow = row - 1;
                            const preElemidx = this._lines[preRow].elements.length - 1;
                            const offset = this._blandAdjacentElement(this._textElements[idx-1], element, idx);
                            this._cursor.row = preRow;
                            this._cursor.column = [preElemidx, offset];
                        }

                        break;
                    case 'self':
                        preContent = preContent.substring(0, preContent.length - 1);
                        column[1] -= 1;
                        element.source = preContent + afterContent;
                        element.dirty = true;
                        break;
                }
                break;
        }
        
        this.refresh();
    }

    _onArrowLeft() {
        const { row, column } = this._cursor;
        const [elemidx, offset] = column;
        const elements = this._lines[row].elements;
        const element = elements[elemidx];
        const idx = this._textElements.findIndex(el => el === element);
        const result = element.shift(offset, -1);
        switch(result) {
            case 'prev':
                if(elemidx > 0) {
                    const el = elements[elemidx - 1];
                    this._cursor.column = [elemidx - 1, el.tailOffset()];
                } else if(idx > 0) {
                    const preRow = row - 1;
                    const preElemidx = this._lines[preRow].elements.length - 1
                    const offset = this._textElements[idx-1].tailOffset();
                    this._cursor.row = preRow;
                    this._cursor.column = [preElemidx, offset];
                }
                this._jflow._render();
                break;
            case 'self':
                column[1] -= 1;
                this._jflow._render();
                break;
        }
    }

    _onArrowRight() {
        const { row, column } = this._cursor;
        const [elemidx, offset] = column;
        const elements = this._lines[row].elements;
        const element = elements[elemidx];
        const idx = this._textElements.findIndex(el => el === element);
        const result = element.shift(offset, 1, idx === this._textElements.length-1);
        
        switch(result) {
            case 'next':
                if(elemidx < elements.length-1) {
                    const el = elements[elemidx + 1];
                    if(element.type === 'text' && el.type !== 'text') {
                        this._cursor.column = [elemidx + 2, el.headOffset()];
                    } else {
                        this._cursor.column = [elemidx + 1, el.headOffset()];
                    }
                } else if(idx < this._textElements.length-1) {
                    const afterRow = row + 1;
                    const offset = this._textElements[idx + 1].headOffset();
                    this._cursor.row = afterRow;
                    this._cursor.column = [0, offset];
                }
                this._jflow._render();
                break;
            case 'self':
                column[1] += 1;
                this._jflow._render();
                break;
        }
    }

    _onArrowDown() {
        const { row } = this._cursor;
        const rowlength = this._lines.length;
        if(row + 1 < rowlength){
            this._ArrowVerticalHanlder(row + 1);
        }
    }

    _onArrowUp() {
        const { row } = this._cursor;
        if(row - 1 > -1){
            this._ArrowVerticalHanlder(row - 1);
        }
    }

    _onShiftToggle(val) {
        this._status.shiftOn = val;
        if(val) {
            this._textRange.initialRange = [this._cursor.row, ...this._cursor.column];
        } else {
            this._textRange.initialRange = null;
        }
    }

    _ArrowVerticalHanlder(nextRow) {
        const { row, column } = this._cursor;
        const [elemidx, offset] = column;
        let currElem = this._lines[row].elements[elemidx];
        let currElemReduceWidth = currElem.reduceWidth;
        if(offset > 0) {
            requestCacheCanvas((ctx) => {
                ctx.font = `${this.fontSize} ${this.fontFamily}`;
                currElemReduceWidth += ctx.measureText(currElem.source.substring(0, offset)).width;
            });
        }
        const nextLine = this._lines[nextRow];
        if(nextLine.width < currElemReduceWidth) {
            const i = nextLine.elements.length-1;
            const elem = nextLine.elements[i];
            this._cursor.row = nextRow;
            this._cursor.column = [i, elem.tailOffset()];
        } else {
            const t = nextLine.elements.slice();
            let i = 0;
            while(t.length) {
                const elem = t.shift();
                if(elem.reduceWidth + elem.width > currElemReduceWidth) {
                    const l = currElemReduceWidth - elem.reduceWidth;
                    if(elem.type === 'text') {
                        const offset = this._calculateOffsetByWidth(l, elem);
                        this._cursor.row = nextRow;
                        this._cursor.column = [i, offset];
                    } else {
                        this._cursor.row = nextRow;
                        if(l < elem.width/2) {
                            const preElem = elem[i-1];
                            if(preElem?.type === 'text') {
                                this._cursor.column = [i-1, elem.tailOffset()];
                            } else {
                                this._cursor.column = [i, elem.headOffset()];
                            }
                        } else {
                            // const afterElem = elem[i+1];
                            this._cursor.column = [i+1, elem.headOffset()];
                        }
                        
                    }
                    break;
                }
                i++;
            }
        }
        this._jflow._render();
    }

    getBoundingRect() {
        const anchor = this.anchor;
        const w = this.width /2;
        const h = this.height/2;
        const ltx = anchor[0] - w;
        const lty = anchor[1] - h;
        const rbx = anchor[0] + w;
        const rby = anchor[1] + h;
        return [
            ltx, lty,
            rbx, rby,
        ]
    }

    calculateToCoordination(point) {
        const [gx, gy] = point;
        const [cx, cy] = this.anchor;
        // const p = [cx + anchor[0] - spanH, cy + anchor[1] - spanV];
        const p = [gx + cx, gy + cy]
        if(this._belongs && this._belongs.calculateToCoordination) {
            return this._belongs.calculateToCoordination(p);
        } else {
            return p;
        }
    }

    calculateToRealWorld(point) {
        const [gx, gy] = point;
        const [cx, cy] = this.anchor;
        const p = [gx + cx, gy + cy]
        if(this._belongs && this._belongs.calculateToRealWorld) {
            return this._belongs.calculateToRealWorld(p);
        }
    }

    _calculatePointBack(point) {
        const [gx, gy] = point;
        const [cx, cy] = this.anchor;
        const p = [gx - cx, gy - cy]
        return p
    }

    isHit(point, condition) {
        const p = this._calculatePointBack(point);
        const jflow = this._jflow;
        this._currentp = p; // 暂存，为了后续计算别的位置
        let validInstance = [];
        this._textElements.forEach(elem => {
            if(elem.type !== 'text') {
                const instance = jflow.getRenderNodeBySource(elem.source);
                if(instance.visible) {
                    validInstance.push(instance);
                }
            }
        })
        const target = this._stack.checkHit(p, condition, (i) => validInstance.includes(i));
        
        if(target) return target;

        const anchor = this.anchor;
        const w = this.width /2;
        const h = this.height/2;
        return point[0] > anchor[0] - w
            && point[0] < anchor[0] + w
            && point[1] > anchor[1] - h
            && point[1] < anchor[1] + h;
    }

    _blandAdjacentElement(elem1, elem2, idx) {
        if(!elem1) {
            return 0;
        }
        if(elem1.type === 'text' && elem2.type === 'text') {
            const offset = elem1.source.length;
            elem1.source += elem2.source;
            elem1.dirty = true;
            elem1.needWrap = elem2.needWrap;
            this._textElements.splice(idx, 1);
            return offset;
            // if(elem1.needWrap) {
                
            // } else {
            //     const offset = elem1.source.length;
            //     elem1.source += elem2.source;
            //     elem1.needWrap = elem2.needWrap;
            //     this._textElements.splice(idx, 1);
            //     return offset;
            // }
        }
        return 0;
    }

    clone() {
        const t = new ShadowCache({
            width: this.width,
            height: this.height,
            cache: (ctx) => {
                const [cx, cy] = this.anchor;
                ctx.translate(-cx + this.width/2, -cy + this.height/2);
                this.render(ctx);
            }
        })

        return t;
    }
}

Object.assign(TextGroup.prototype, StackMixin);
Object.assign(TextGroup.prototype, LayoutMixin);
Object.assign(TextGroup.prototype, {
        // 屏蔽这两个方法，只根据reflow重算
    _getBoundingGroupRect() {},
    resetChildrenPosition() {},
    reflow() {
        let lineHeight = this.currentLineHeight;
        if(this._textElements.length === 1 && this._textElements[0].source === '') {
            let width = 0;
            const t = this._textElements[0];
            requestCacheCanvas((ctx) => {
                ctx.font = `${this.fontSize} ${this.fontFamily}`;
                width = ctx.measureText(this.placeholder).width;
            });
            this._lines = [{
                width: 0,
                anchorY: 0,
                height: lineHeight,
                reduceHeight: lineHeight,
                elements: [this._textElements[0]],
            }];
            t.anchorX = -width/2;
            t.anchorY = 0;
            t.width = 0;
            t.height = lineHeight;
            t.isTail = true;
            this.width = width;
            this.height = lineHeight;
            return;
        }
        const jflow = this._jflow;
        requestCacheCanvas((ctx) => {
            ctx.font = `${this.fontSize} ${this.fontFamily}`;
            this._textElements.forEach(element => {
                if(element.type === 'text' && element.dirty) {
                    element.width = ctx.measureText(element.source).width;
                    element.dirty = false;
                }
            });
        });
        let line = {
            width: 0,
            height: lineHeight,
            elements: [],
        };
        const lines = [line];
        let allHeight = 0;
        let allWidth = 0;
        let lastElem = null;
        const lineSpace = this.lineSpace;
        this._textElements.forEach(element => {
            line.elements.push(element);
            element.reduceWidth = line.width;
            if(element.type === 'text') {
                element.height = lineHeight;
                line.width += element.width;
                if(element.needWrap){
                    allHeight += (line.height + lineSpace);
                    line.reduceHeight = allHeight;
                    allWidth = Math.max(line.width, allWidth);
                    line = {
                        width: 0,
                        height: lineHeight,
                        elements: [],
                        reduceHeight: 0
                    }
                    lines.push(line);
                }
            } else {
                
                const node = jflow.getRenderNodeBySource(element.source);
                element.height = node.height;
                line.height = Math.max(line.height, node.height);
                const margin = (!lastElem || lastElem.type === 'text') ? this.elementSpace*2 : this.elementSpace;
                line.width += node.width+margin;
            }
            lastElem = element;
        });
        this._textElements[this._textElements.length-1].isTail = true;
        allHeight += line.height
        line.reduceHeight = allHeight;
        allWidth = Math.max(this.minWidth, Math.max(line.width, allWidth));
        
        const hh = allHeight/2;
        const hw = allWidth/2;
        let ty = -hh;
        let lastReduceY = 0;

        lines.forEach(l => {
            const { height, elements, reduceHeight } = l;
            const anchorY = ty + lastReduceY + height / 2;
            l.anchorY = anchorY;
            let reduceX = -hw;
            let lastel = null;
            elements.forEach(el => {
                if(el.type === 'text') {
                    el.anchorY = anchorY;
                    el.anchorX = reduceX + el.width/2;
                    reduceX += el.width;
                } else {
                    const renderNode = jflow.getRenderNodeBySource(el.source);
                    const doubleMargin = (!lastel || lastel.type === 'text');
                    const margin = doubleMargin ? this.elementSpace*2 : this.elementSpace;
                    el.width = renderNode.width;
                    el.anchorY = anchorY;
                    el.anchorX = reduceX + el.width/2 + (doubleMargin ? margin/2 : 0);
                    renderNode.anchor = [el.anchorX, el.anchorY];
                    reduceX += (el.width + margin);
                }
                lastel = el;
            })
            lastReduceY = reduceHeight;
        });
        this._lines = lines;
        this.width = allWidth;
        this.height = allHeight;
    }
})


export default TextGroup;

function createInputElement(controlCallback) {
    const input = document.createElement('input');
    input.setAttribute('style',`
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        border:none;
        opacity: 0;
        z-index: -1;
        contain: strict;`);
    input.setAttribute('tabindex', -1);
    input.setAttribute('aria-hidden', true);
    input.setAttribute('spellcheck', false);
    input.setAttribute('autocorrect', 'off');


    // let content = configs.content;
    // let startidx = 0;

    // function renderContent() {
    //     configs.callback(content)
    // }
    let stopInput = false;
    let status = {
        ctrlOn: false,
    }

    input.addEventListener('beforeinput', e => {
        e.preventDefault();
        if(e.data) {
            // content += e.data;
            // renderContent();
            if(!stopInput) {
                controlCallback('Input', e.data);
            }
        }
    })

    input.addEventListener('compositionstart', (e) => {
        // cache composition start offset
        // startidx = content.length;
        controlCallback('compositionstart');
        stopInput = true;
    });
    input.addEventListener('compositionupdate', (e) => {
        // update content
        // content = content.substring(0, startidx);
        // content += e.data;
        // renderContent();
        controlCallback('compositionupdate', e.data);
    });
    input.addEventListener('compositionend', (e) => {
        // replace text at start offset
        // content = content.substring(0, startidx);
        // startidx = 0;
        // content += e.data;
        // renderContent();
        controlCallback('compositionend', e.data);
        input.value = '';
        stopInput = false
    });

    input.addEventListener('keyup', (event) => {
        switch(event.key) {
            case "Shift":
                controlCallback("Shift", false);
                break;
            case "Meta":
            case "Control":
                status.ctrlOn = false;
                break;
            
        }
    })

    input.addEventListener('keydown', (event) => {
        switch(event.code) {
            case "Enter":
                // content = content + '\n';
                // renderContent();
                controlCallback('Enter');
                break;
            case "Backspace":
                // content = content.substring(0, content.length - 1);
                // renderContent();
                controlCallback('Backspace');
                break;
            case "ArrowLeft":
                controlCallback("ArrowLeft");
                break;
            case "ArrowRight":
                controlCallback("ArrowRight");
                break;
            case "ArrowDown":
                controlCallback("ArrowDown");
                break;
            case "ArrowUp":
                controlCallback("ArrowUp");
                break;
        }
        switch(event.key) {
            case "Shift":
                controlCallback("Shift", true);
                break;
            case "Meta":
            case "Control":
                status.ctrlOn = true;
                break;
            case 'a':
                if(status.ctrlOn) {
                    controlCallback('CtrlA');
                }
                break;
            case 'c':
                if(status.ctrlOn) {
                    controlCallback('CtrlC');
                }
                break; 
            case 'v':
                if(status.ctrlOn) {
                    controlCallback('CtrlV');
                }
                break;   
            case 'x':
                if(status.ctrlOn) {
                    controlCallback('CtrlX');
                }
                break;
        }
    })
    return input;
}
