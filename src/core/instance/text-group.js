import Node from './node';
import StackMixin from './stackMixin';
import LayoutMixin from './layoutMixin';
import JFlowEvent from '../events/index';
import { requestCacheCanvas } from '../utils/canvas';

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
            if(this.needWrap){
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
        this.resolver = () => {
            const elements = configs.resolver();
            if(elements[elements.length-1].type !== 'text') {
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
        }
        this._cursor = {
            row: 0,
            column: [0,0],
        }
        this._makeFunctional();
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
        ctx.translate(cx, cy);
        ctx.beginPath();
        ctx.rect(-width/2, -height/2, width, height);
        ctx.stroke();

        ctx.beginPath();
        ctx.font = `${this.fontWeight} ${this.fontSize} ${this.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = this.textColor;
        this._lines.forEach(line => {
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

        if(this._status.cursorshow && (this._status.editing || this._status.dragover)) {
            const { row, column } = this._cursor;
            const { elements, anchorY } = this._lines[row];
            const [elemidx, offset] = column;
            const meta = elements[elemidx];
            let cw;
            if(meta.type === 'text') {
                const c = meta.source.substring(0, offset);
                cw = meta.anchorX - meta.width/2 + ctx.measureText(c).width
            } else {
                cw = meta.anchorX - meta.width/2
            }
            ctx.beginPath();
            ctx.moveTo(cw, anchorY - 8);
            ctx.lineTo(cw, anchorY + 8);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#60CFC4';
            ctx.stroke();
        }

        
          
        ctx.translate(-cx, -cy);
        

        ctx.restore();
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
            const jflow = this._jflow;
            if(this._status.editing) {
                // this._positionToCursorOffset(point);
            } else {   
                this._positionToCursorOffset(point);
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
                }) 
            }
        });

        this.addEventListener('click', (event) => {
            if(this._status.editing) {
                event.detail.bubbles = false;
                const point = this._currentp;
                this._positionToCursorOffset(point);
                inputElement.focus();   
                this._refreshCursor();   
            }
        })
        this.addEventListener('blur', (event) => {
            blurHandler(event);
            this.dispatchEvent(new JFlowEvent('change', {
                target: this,
                textElements: this._textElements.slice(),
            }));
            this._status.cursoranime.cancel()
            Object.assign(this._status, {
                cursorshow: true,
                cursoranime: null,
                lastElapsed: 0,
            })
            this._status.cursorshow = true;
            this._status.cursoranime = null;
        })
        this.addEventListener('dragenter', () => {
            const point = this._currentp;
            this._positionToCursorOffset(point);
            this._status.dragover = true;
        })
        this.addEventListener('dragover', () => {
            const point = this._currentp;
            this._positionToCursorOffset(point);
        });
        this.addEventListener('dragleave', () => {
            this._status.dragover = false;
        });
        this.addEventListener('drop', (event) => {
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
            this.dispatchEvent(new JFlowEvent('insert', {
                ...event.detail,
                textElements: this._textElements.slice(),
                idx, offset,
            }));
        })
    }

    _positionToCursorOffset(point) {
        const [x, y] = point;
        const [x0, y0] = this.anchor;
        const w = this.width/2;
        const h = this.height/2;
        const offsetX = x - x0 + w;
        const offsetY = y - y0 + h;
        let lineNumber = 0;
        const lines = this._lines;
        while(lineNumber < lines.length) {
            if(lines[lineNumber].reduceHeight > offsetY) {
                break;
            }
            lineNumber ++;
        }

        this._cursor.row = lineNumber;
        const currLine = lines[lineNumber];
        const elements = currLine.elements;
        if(offsetX >= currLine.width) {
            const elem = elements[elements.length - 1];
            let q = 0;
            if(elem.type === 'text') {
                q = elem.source.length;
            } 
            this._cursor.column = [elements.length - 1, q]
        } else {
            let elem_idx = 0;
            let last_c = 0;
            let _c = elements[elem_idx].width; 
            while(elem_idx < elements.length -1) {
                if(_c > offsetX) {
                    break;
                }
                last_c = _c;
                elem_idx++;
                _c += elements[elem_idx].width;
            }

            const textmeta = elements[elem_idx];
            if(textmeta.type === 'text') {
                const offx = offsetX - last_c;
                const idx = this._calculateOffsetByWidth(offx, textmeta)
                this._cursor.column = [elem_idx, idx];
            } else {
                this._cursor.column = [elem_idx, 0];
            }
        }
    }

    _calculateOffsetByWidth(offx, textmeta) {
        const content = textmeta.source;
        const maxL = content.length - 1;
        let idx = Math.floor(offx / textmeta.width);
        requestCacheCanvas((ctx) => {
            ctx.font = `${this.fontSize} ${this.fontFamily}`;
            let g1, g2;
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
            } while(idx >= 0 && idx <= maxL);
        });
        return idx;
    }

    _refreshCursor() {
        Object.assign(this._status, {
            cursorshow: true,
            refreshElapsed: true,
        });
    }

    _controlCallback(op, data) {
        this._refreshCursor();
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
                this._onArrowLeft();
                break;
            case "ArrowRight":
                this._onArrowRight();
                break;
            case "ArrowDown":
                this._onArrowDown();
                break;
            case "ArrowUp":
                this._onArrowUp();
                break;
            default:
                break;
        }
    }
    // 内部输入
    _inputControl(op, data) {
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
                element.source = preContent;
                element.dirty = true;
                element.needWrap = true;
                const t = new TextElement('text', afterContent);
                const idx = this._textElements.findIndex(el => el === element);
                t.needWrap = (idx !== this._textElements.length - 1)
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
        
        this.recalculateUp();
        this._jflow._render();
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
}

Object.assign(TextGroup.prototype, StackMixin);
Object.assign(TextGroup.prototype, LayoutMixin);
Object.assign(TextGroup.prototype, {
        // 屏蔽这两个方法，只根据reflow重算
    _getBoundingGroupRect() {},
    resetChildrenPosition() {},
    reflow() {
        let lineHeight = this.currentLineHeight;
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
                line.height = Math.max(line.height, node.height);
                let margin = lastElem?.type !== 'text' ? this.elementSpace : this.elementSpace*2;
                line.width += node.width+margin;
            }
            lastElem = element;
        });
        allHeight += line.height
        line.reduceHeight = allHeight;
        allWidth = Math.max(line.width, allWidth);
        
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
                if(el.type !== 'text') {
                    const renderNode = jflow.getRenderNodeBySource(el.source);
                    let margin = lastel?.type !== 'text' ? this.elementSpace : this.elementSpace*2;
                    el.width = renderNode.width + margin;
                    el.anchorY = anchorY;
                    el.anchorX = reduceX + el.width/2 + margin/2;
                    renderNode.anchor = [el.anchorX, el.anchorY];
                    reduceX += el.width + margin/2;
                } else {
                    el.anchorY = anchorY;
                    el.anchorX = reduceX + el.width/2;
                    reduceX += el.width;
                }
                
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
    })
    return input;
}
