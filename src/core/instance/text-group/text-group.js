import Node from '../node';
import StackMixin from '../stackMixin';
import LayoutMixin from '../layoutMixin';
import JFlowEvent from '../../events/index';
import { requestCacheCanvas } from '../../utils/canvas';
import ShadowCache from '../shapes/shadow-cache';
import ShadowInput from './base/shadow-input';

import Caret from './base/caret';
import Range from './base/range';
import UndoRedo from './undoredo';
import {
    Area,
    FlattenTextElements,
    Line,
    TextElement
} from './storage';

import { 
    Input,
    ArrowLeftCommand,
    ArrowRightCommand,
    ArrowUpCommand,
    ArrowDownCommand,
    StartEditCommand,
    ShiftDownCommand,
    ShiftUpCommand,
    ShiftOnClickCommand,
    EditClickCommand,
    CtrlACommand,
    DoubleClickCommand,
    // ReturnCommand,
    // DeleteCommand,
    UndoCommand,
    RedoCommand,
} from './command'
import { EDITOR_EVENTS, KEYBOARD_COMMANDS, MOUSE_COMMANDS } from './base/constants';

class TextGroup extends Node {

    get currentLineHeight() {
        return this.lineHeight || parseInt(this.fontSize);
    }

    constructor(configs) {
        super(configs);
        this.initStack(configs);
        this.initLayout(configs);

        this._undoredo = new UndoRedo();
        this._undoredo._editor = this;
        this._caret = new Caret();
        this._range = new Range();
        this._shadowInput = undefined;

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

        // this._lines = [];
        this._area = new Area();
        this._flattenTxtElem = FlattenTextElements.create(this.resolver()); 
        this._status = {
            editing: false,
            dragover: false,

        }

        this.commands = new Map();
        this.registCommand(StartEditCommand);
        this.registCommand(EditClickCommand);
        this.registCommand(ShiftUpCommand);
        this.registCommand(ShiftDownCommand);
        this.registCommand(ShiftOnClickCommand);
        this.registCommand(Input);
        this.registCommand(ArrowLeftCommand);
        this.registCommand(ArrowRightCommand);
        this.registCommand(ArrowUpCommand);
        this.registCommand(ArrowDownCommand);
        this.registCommand(CtrlACommand);
        this.registCommand(DoubleClickCommand);
        // this.registCommand(ReturnCommand);
        // this.registCommand(DeleteCommand);
        this.registCommand(UndoCommand);
        this.registCommand(RedoCommand);
        this._makeFunctional();

        this._cacheViewBox = [];
    }

    registCommand(cmd) {
        if(!this.commands.has(cmd.name)) {
            this.commands.set(cmd.name, cmd.create(this));
        }
    }

    _makeFunctional() {
        this.addEventListener('dblclick', (event) => {
            if(event.currentTarget !== this) {
                return
            }
            event.detail.bubbles = false;
            if(this._status.editing) {
                this.execCommand(MOUSE_COMMANDS.DOUBLE_CLICK)
            } 
        });
        this.addEventListener('click', (event) => {
            if(event.currentTarget !== this) {
                return
            }
            event.detail.bubbles = false;
            let commnd;
            if(this._status.editing) {
                if(this._status.shiftOn) {
                    commnd = MOUSE_COMMANDS.SHIFT_ON_CLICK
                } else {
                    commnd = MOUSE_COMMANDS.EDIT_CLICK
                }
            } else {
                commnd = MOUSE_COMMANDS.START_EDIT
            }
            this.execCommand(commnd)
        });

        this.addEventListener('blur', (event) => {
            this._status.editing = false;
            if(this._shadowInput) {
                this._shadowInput.destroy();
            }
            if(this._belongs) {
                this._jflow._render();
            } 

            this.dispatchEvent(new JFlowEvent('change', {
                target: this,
                textElements: this._flattenTxtElem.copy(),
            }));

            this._range.disable();
            this._caret.cancelAnimate();
        });

        this.addEventListener('instancePressStart', (event) => {
            if(this._status.editing && !this._status.shiftOn) {
                event.detail.bubbles = false;
                event.detail.preventDefault();
                // event.detail.jflow.setMovingTargets(null);
                const point = this._currentp;
                const c = this._positionToCursorOffset(point);
                // this._cursor = c;
                const range = this._range;
                range.setInitialRange([c.row, ...c.column]);
                const jflow = event.detail.jflow;
                let moved = false;
                const t = (e => {
                    this._status.editing = false;
                    moved = true;
                    const { offsetX, offsetY } = e;
                    const p = jflow._calculatePointBack([offsetX, offsetY]);
                    jflow._stack.checkHit(p)
                    const point = this._currentp;
                    const c = this._positionToCursorOffset(point);
                    // this._cursor = c;
                    range.setRange([c.row, ...c.column]);
                    range.enable();
                }).bind(this);

                document.addEventListener('pointermove', t)
                document.addEventListener('pointerup', (e) => {
                    document.removeEventListener('pointermove', t);
                    range.setInitialRange(null);
                    if(!moved) {
                        return;
                    }
                    range.handleCaret(this._caret)
                    this._status.editing = true;
                    this._shadowInput.focus();   
                }, {
                    once: true,
                })
            }
        });

        this.addEventListener('dragenter', () => {
            this.moveCaretByHitPoint();
            this._status.dragover = true;
        });
        this.addEventListener('dragover', () => {
            this.moveCaretByHitPoint();
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
            const caret = this._caret;
            const row = caret.getRow();
            const column = caret.getColumn();
            const line = this._area.get(row);
            let [elemidx, offset] = column;
            const element = line.get(elemidx);
            const preElem = line.get(elemidx-1);
            let flattenTxtElem = this._flattenTxtElem;
            
            let idx = flattenTxtElem.findIndex(element)
            if(element.type !== 'text' && preElem?.type ==='text') {
                offset = preElem.source.length;
                idx = flattenTxtElem.findIndex(preElem)   
            }

            const lastLength = flattenTxtElem.length()
            this.dispatchEvent(new JFlowEvent('insert', {
                ...event.detail,
                type: event.type,
                textElements: flattenTxtElem.copy(),
                idx, offset,
            }));
            // after insert
            flattenTxtElem = this._flattenTxtElem;
            if(this._status.editing) {
                if(flattenTxtElem.length() > lastLength) {
                    caret.setColumn([
                        elemidx + flattenTxtElem.length() - lastLength,
                        0
                    ])
                }
                this._shadowInput.focus(); 
            }
            if(this._status.editing) {
                this._caret.refresh();
            }
            this.syncShadowInputPosition();
            this._range.disable();
        }).bind(this)
        this.addEventListener('pressEnd', onDrop)
        this.addEventListener('drop', onDrop);
    }

    toggleShift(val) {
        this._status.shiftOn = val;
    }

    execCommand(kind) {
        const cmd = this.commands.get(kind);
        cmd.exec();
    }

    createShadowInput() {
        const jflow = this._jflow;
        this._shadowInput = new ShadowInput(jflow.DOMwrapper);
        this._shadowInput.addEventListener(EDITOR_EVENTS.CONTROL_CMD, e => {
            const kind = e.detail.kind;
            this.execCommand(kind)
        });

        this._shadowInput.addEventListener(EDITOR_EVENTS.INPUT, e => {
            const kind = e.detail.kind;
            const data = e.detail.data;
            const cmd = this.commands.get(EDITOR_EVENTS.INPUT);
            cmd.exec(kind, data);
        });
        this._status.editing = true;
        jflow.setFocusInstance(this);
    }

    moveCaretByHitPoint() {
        const point = this._currentp;
        const caret = this._caret;
        const { row, column } = this._positionToCursorOffset(point);
        caret.setRow(row);
        caret.setColumn(column);
    }

    refresh() {
        this.recalculateUp();
        this.syncShadowInputPosition();
        this._jflow._render();
    }

    refreshTextElements() {
        this._flattenTxtElem = FlattenTextElements.create(this.resolver()); 
    }

    _positionToCursorOffset(point) {
        const [x, y] = point;
        // const [x0, y0] = this.anchor;
        const area = this._area;
        const w = this.width/2;
        const h = this.height/2;
        const offsetX = x + w;
        const offsetY = y + h;
        const row = area.getLineAbove(offsetY)
        const currLine = area.get(row);
        const column = currLine.getColumnNearest(offsetX, this.elementSpace, this.fontSize, this.fontFamily);
        return {
            row, 
            column,
        }
    }

    _caretToPosition() {
        const row = this._caret.getRow();
        const column = this._caret.getColumn();
        const line = this._area.get(row);
        const [elemidx, offset] = column;
        const meta = line.get(elemidx);
        const idx = this._flattenTxtElem.findIndex(meta);
        const preElem = this._flattenTxtElem.get(idx-1);
        let cw;
        let c_len = this.currentLineHeight/2;
        if(meta.type === 'text') {
            const c = meta.source.substring(0, offset);
            requestCacheCanvas((ctx) => {
                ctx.beginPath();
                ctx.font = `${this.fontSize} ${this.fontFamily}`;
                cw = meta.anchorX - meta.width/2 + ctx.measureText(c).width
            })
        } else {
            cw = meta.anchorX - meta.width/2
            c_len = Math.max(c_len, meta.height/2);
        }
        if(offset === 0 && preElem && preElem.type !== 'text') {
            c_len = Math.max(c_len, preElem.height/2);
        }
        return [cw, c_len, line.anchorY, preElem, meta]
    }

    syncShadowInputPosition() {
        if(this._status.editing) {
            const [cw, c_len, anchorY] = this._caretToPosition();
            const point = this.calculateToRealWorld([cw, anchorY + c_len]);
            const canvasMeta = this._jflow.canvasMeta;
            const px = Math.min(canvasMeta.actual_width - 120, point[0]);
            // return [px, point[1]];
            this._shadowInput.syncPosition(px, point[1]);
            this._shadowInput.focus();
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
        const jflow = this._jflow;
        const area = this._area;
        ctx.translate(cx, cy);
        // ctx.beginPath();
        // ctx.rect(-width/2, -height/2, width, height);
        // ctx.stroke();
        const flattenTxtElem = this._flattenTxtElem;
        if(flattenTxtElem.isEmpty()) {
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
        area.forEach(line => {
            line.forEach(el => {
                if(el.type === 'text') {
                    ctx.fillText(el.source, el.anchorX, el.anchorY)
                } 
            })
        })
        flattenTxtElem.forEach(elem => {
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
        this._renderRange(ctx);
        ctx.translate(-cx, -cy);
        ctx.restore();
    }

    _randerCursor(ctx) {
        if(this._caret.isShow() && (this._status.editing || this._status.dragover)) {
            const [cw, c_len, anchorY] = this._caretToPosition();
            ctx.beginPath();
            ctx.moveTo(cw, anchorY - c_len);
            ctx.lineTo(cw, anchorY + c_len);
            ctx.lineWidth = 2;
            ctx.strokeStyle = this.cursorColor;
            ctx.stroke();
        }
    }

    _renderRange(ctx) {
        const range = this._range;
        if(range.isEnable()) {
            const area = this._area;
            const textRangeColor = this.textRangeColor;
            const blockheight = this.height;
            const blockwidth = this.width;
            const lineSpace = this.lineSpace;
            const [r_f, idx_f, offset_f] = range.getRangeFrom();
            const [r_t, idx_t, offset_t] = range.getRangeTo();
            if(r_f === r_t) {
                if(idx_f === idx_t && offset_f == offset_t) {
                    return;
                }
                const line = area.get(r_f);
                let space = (r_f === area.length()-1 ? 0 : lineSpace);
                const lty = line.reduceHeight - space - line.height - blockheight/2;
                const height = line.height;
                const x1 = this._measureElementOffsetX(line.get(idx_f), offset_f, ctx);
                const x2 = this._measureElementOffsetX(line.get(idx_t), offset_t, ctx);
                ctx.beginPath();
                ctx.rect(x1, lty , x2 - x1, height);
                ctx.fillStyle = textRangeColor
                ctx.fill();
            } else {
                let _r = r_f;
                let beginning = true;
                while(_r <= r_t) {
                    const line = area.get(_r);
                    let space = (_r === area.length()-1 ? 0 : lineSpace);
                    const lty = line.reduceHeight - space - line.height - blockheight/2;
                    const height = line.height;
    
                    if(beginning) {
                        const elem = line.get(idx_f);
                        const x = this._measureElementOffsetX(elem, offset_f, ctx);
                        const lastElem = line.tail();
                        const t = lastElem.anchorX + lastElem.width/2;
    
                        ctx.beginPath();
                        ctx.rect(x, lty, t - x, height);
                        ctx.fillStyle = textRangeColor
                        ctx.fill();
                    } else if(_r === r_t){
                        const elem = line.get(idx_t);
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
    }

    _measureElementOffsetX(element, offset, ctx) {
        if(element.type !== 'text' || offset === 0){
            return element.anchorX - element.width/2;
        }
        return element.anchorX - element.width/2 + ctx.measureText(element.source.substring(0, offset)).width;
    }

    measureTextWidth(content) {
        let t;
        requestCacheCanvas((ctx) => {
            ctx.font = `${this.fontSize} ${this.fontFamily}`;
            t = ctx.measureText(content).width;
        });
        return t;
    }

    getBoundingDimension() {
        return {
            width: this.width,
            height: this.height,
        } 
    }

    getBoundingRect() {
        const anchor = this.anchor;
        const w = this.width /2;
        const h = this.height/2;
        const ltx = anchor[0] - w;
        const lty = anchor[1] - h;
        const rbx = anchor[0] + w;
        const rby = anchor[1] + h;
        const br = this._boundingrect;
        br[0] = ltx;
        br[1] = lty;
        br[2] = rbx;
        br[3] = rby;
        return br
    }

    _getViewBox() {
        const belongs_vbox = this._belongs.getCacheViewBox();
        const cacheViewBox = this._cacheViewBox;
        
        this._calculatePointBackWithPoint(belongs_vbox[0], belongs_vbox[1], cacheViewBox, 0, 1);
        this._calculatePointBackWithPoint(belongs_vbox[2], belongs_vbox[3], cacheViewBox, 2, 3);
        return this._cacheViewBox;
    }
    
    getCacheViewBox() {
        return this._cacheViewBox;
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

    _calculatePointBackWithPoint(a, b, arr, idx1, idx2) {
        arr[idx1] = a - this.anchor[0];
        arr[idx2] = b - this.anchor[1];
    }

    isHit(point, condition) {
        const p = this._calculatePointBack(point);
        const jflow = this._jflow;
        this._currentp = p; // 暂存，为了后续计算别的位置
        let validInstance = [];
        const flattenTxtElem = this._flattenTxtElem;
        flattenTxtElem.forEach(elem => {
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

    destroy() {
        if(this._jflow._focus.instance === this) {
            this._jflow.blur();
        }
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
        const flattenTxtElem = this._flattenTxtElem;
        const area = this._area;
        if(flattenTxtElem.isEmpty()) {
            let width = 0;
            const t = flattenTxtElem.get(0);
            requestCacheCanvas((ctx) => {
                ctx.font = `${this.fontSize} ${this.fontFamily}`;
                width = ctx.measureText(this.placeholder).width;
            });
            const line = area.truncate({
                height: lineHeight,
                reduceHeight: lineHeight,
            });
            line.insert(0, t);
            Object.assign(t, {
                anchorX: -width/2,
                height: lineHeight,
                isTail: true,
            })
            this.width = width;
            this.height = lineHeight;
            return;
        }
        const jflow = this._jflow;
        requestCacheCanvas((ctx) => {
            ctx.font = `${this.fontSize} ${this.fontFamily}`;
            flattenTxtElem.forEach(element => {
                if(element.type === 'text' && element.dirty) {
                    element.width = ctx.measureText(element.source).width;
                    element.dirty = false;
                }
            });
        });
        const nextArea = new Area();
        nextArea.truncate({
            height: lineHeight,
        });
        let line = nextArea.get(0);
        let allHeight = 0;
        let allWidth = 0;
        let lastElem = null;
        const lineSpace = this.lineSpace;
        const elementSpace = this.elementSpace;
        flattenTxtElem.forEach(element => {
            line.push(element);
            element.reduceWidth = line.width;
            if(element.type === 'text') {
                element.height = lineHeight;
                line.width += element.width;
                if(element.needWrap){
                    allHeight += (line.height + lineSpace);
                    line.reduceHeight = allHeight;
                    allWidth = Math.max(line.width, allWidth);
                    line = Line.create({
                        height: lineHeight,
                    });
                    nextArea.push(line);
                }
            } else {
                const node = jflow.getRenderNodeBySource(element.source);
                element.height = node.height;
                line.height = Math.max(line.height, node.height);
                const margin = (!lastElem || lastElem.type === 'text') ? elementSpace*2 : elementSpace;
                line.width += node.width+margin;
            }
            lastElem = element;
        });

        flattenTxtElem.tail().isTail = true;
        allHeight += line.height
        line.reduceHeight = allHeight;
        allWidth = Math.max(this.minWidth, Math.max(line.width, allWidth));
        
        const hh = allHeight/2;
        const hw = allWidth/2;
        let ty = -hh;
        let lastReduceY = 0;

        nextArea.forEach(l => {
            const { height, reduceHeight } = l;
            const anchorY = ty + lastReduceY + height / 2;
            l.anchorY = anchorY;
            let reduceX = -hw;
            let lastel = null;
            l.forEach(el => {
                if(el.type === 'text') {
                    el.anchorY = anchorY;
                    el.anchorX = reduceX + el.width/2;
                    reduceX += el.width;
                } else {
                    const renderNode = jflow.getRenderNodeBySource(el.source);
                    const doubleMargin = (!lastel || lastel.type === 'text');
                    const margin = doubleMargin ? elementSpace*2 : elementSpace;
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
        this._area = nextArea;
        this.width = allWidth;
        this.height = allHeight;
    }
})
export default TextGroup;
