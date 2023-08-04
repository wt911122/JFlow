import Rectangle from "../shapes/rectangle";
import { requestCacheCanvas } from '../../utils/canvas';
import JFlowEvent from '../../events'
import ShadowCache from '../shapes/shadow-cache';

const TEXT_ALIGN = {
    CENTER: 'center',
    LEFT: 'left',
    RIGHT: 'right',
};
const SPACE_REG = /\s/g;

class Text extends Rectangle {
    constructor(configs) {
        super(configs);
        this.type =         'Text';
        this.content =      configs.content || '';
        this.fontFamily =       configs.fontFamily || '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,Noto Sans,PingFang SC,Microsoft YaHei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji'
        this.fontSize =         configs.fontSize || '14px';
        this.fontWeight =       configs.fontWeight || '';
        this.textColor =        configs.textColor || 'white';
        this.placeholderColor = configs.placeholderColor ||  configs.textColor || 'white';
        this.textAlign =        configs.textAlign || TEXT_ALIGN.CENTER;
        this.textBaseline =     configs.textBaseline || 'middle';
        this.lineHeight =       configs.lineHeight ;
        this.indent =           configs.indent || 0;
        this.backgroundColor =  configs.backgroundColor;
        this.editable =         configs.editable;
        this.definedWidth =     configs.definedWidth;
        this.minWidth =         configs.minWidth || 0;
        this.maxWidth =         configs.maxWidth;
        this.ellipsis =         configs.ellipsis;

        this.placeholder =      configs.placeholder || '';
        this.emptyWhenInput =   configs.emptyWhenInput || false;
        
        this.editting =         false;
        this.disabled =         configs.disabled;

        this.cursorColor =      configs.cursorColor || '#60CFC4';
        this.textRangeColor =   configs.textRangeColor || '#4E75EC1A';

        this.spacePlaceholder = configs.spacePlaceholder;
        this.spacePlaceholderColor = configs.spacePlaceholderColor;
        this.spaceRecords = [];
        this._spacedContentSegmnent = [];

        this._status = {
            editing: false,
            cursorshow: true,
            cursoranime: null,
            lastElapsed: 0,
            refreshElapsed: false,

            cursorDragging: false,
            shiftOn: false,

            oldVal: '',
            inputElement: null,
        }

        this._cursorOffset = 0;

        this._textRange = {
            enable: false,
            rangefrom: null, // offsetfrom
            rangeTo: null,   // offsetto
            initialRange: null // offset
        }
        if(this.editable) {
            this._makeFunctional();
        }

        this.preCalculateText();
        this.shadowCache();
        
    }

    replaceSpaceHolder(content, useCache = false) {
        if(useCache) {
            return content.replace(/\s/g, this.spacePlaceholder)
        }

        const r = this.spaceRecords;
        const p = this.spacePlaceholder
        r.length = 0;
        let lastOffset;
        const c = content.replace(/\s/g, (_, offset) => {
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
        return c;
    }

    get currentContent() {
        return this.content || this.placeholder || '';
    }

    get isEmpty() {
        return !this.content;
    }

    preCalculateText() {
        requestCacheCanvas((ctx) => {
            ctx.beginPath();
            ctx.font = `${this.fontWeight} ${this.fontSize} ${this.fontFamily}`;
            ctx.textAlign = this.textAlign;
            ctx.textBaseline = this.textBaseline;
            const t_h = parseInt(this.fontSize);
            let content = this.currentContent;
            if(this.spacePlaceholder) {
                content = this.replaceSpaceHolder(content);
            }
            

            const {
                // actualBoundingBoxLeft,
                // actualBoundingBoxRight,
                fontBoundingBoxAscent,
                fontBoundingBoxDescent,
                width,
            } = ctx.measureText(content);

            this._textWidth = this.indent + width;
            if(this.definedWidth) {
                if(this.ellipsis && (this._textWidth > this.definedWidth)) {
                    const offset = this._calculateOffset(this.definedWidth - 12);
                    this.ellipsisContent = content.substring(0, offset) + '...'; 
                } else {
                    this.ellipsisContent = content;
                }
                this.width = this.definedWidth;
            } else if(this.maxWidth && this.ellipsis) {
                if(this._textWidth > this.maxWidth) {
                    const ratio =this.maxWidth / this._textWidth;
                    const l = Math.floor(content.length * ratio - 3);
                    this.ellipsisContent = content.substring(0, l) + '...'; 
                }  else {
                    this.ellipsisContent = content;
                }
                this.width = Math.min(this.maxWidth, this._textWidth);
            } else{ 
                this.width = Math.max(this.minWidth, this._textWidth);
            }


            if(this.spacePlaceholder) {
                const {
                    width: s_width,
                } = ctx.measureText(this.spacePlaceholder);
                const r2 = this._spacedContentSegmnent;
                const textColor = this.textColor;
                let lastOffset = 0;
                r2.length = 0;
                if(this.spaceRecords.length) {
                    const r = this.spaceRecords;
                    const pcolor = this.spacePlaceholderColor;
                    
                    const l = r.length;
                    let i = 0;
                    while(i < l) {
                        const f = r[i++];
                        const t = r[i++];
                        const q = content.substring(lastOffset, f);
                        r2.push([
                            q,
                            ctx.measureText(q).width,
                            textColor,
                        ])
                        r2.push([
                            content.substring(f, t+1),
                            (t - f + 1) * s_width,  
                            pcolor,
                        ])
                        lastOffset = t+1
                    }
                }
                if(lastOffset < content.length) {
                    const q = content.substring(lastOffset);
                    r2.push([
                        q,
                        ctx.measureText(q).width,
                        textColor,
                    ])
                }
            }
            
            
            const height = (Math.abs(fontBoundingBoxAscent) + Math.abs(fontBoundingBoxDescent)) || t_h;
            this._textHeight = height;
            if(this.lineHeight) {
                this.height = this.lineHeight;
            } else {
                this.height = height;
            }
        });
    }

    shadowCache() {
        const scale = window.devicePixelRatio;
        const w = this.width * scale;
        const h = this.height * scale;
        const i = this.indent * scale;
        const size = parseInt(this.fontSize) * scale;
        this._shadowCache = new ShadowCache({
            width: w,
            height: h,
            cache: (ctx) => {
                // const [cx, cy] = this.anchor;
                // ctx.scale(4, 4)
                ctx.translate(w/2, h/2);
                const font = `${this.fontWeight} ${size}px ${this.fontFamily}`;
                ctx.font = font
                ctx.textAlign = this.textAlign;
                ctx.textBaseline = this.textBaseline;
                ctx.fillStyle = this.isEmpty ? this.placeholderColor : this.textColor;
                let content = this.currentContent;
                if(this.spacePlaceholder) {
                    if(this.textAlign === TEXT_ALIGN.LEFT) {
                        const hw = w/2;
                        let _w =  -hw + i/2;
                        this._spacedContentSegmnent.forEach(seg => {
                            ctx.fillStyle = seg[2];
                            ctx.fillText(seg[0], _w, 0);
                            _w += seg[1] * scale;
                        })
                    } 
                } else {
                    if(this.ellipsisContent) {
                        content = this.ellipsisContent;
                    }
                    if(content) {
                        if(this.textAlign === TEXT_ALIGN.LEFT){
                            const hw = w / 2;
                            ctx.fillText(content,  -hw + i / 2, 0);
                        } else if(this.textAlign === TEXT_ALIGN.RIGHT) {
                            const hw = w / 2;
                            ctx.fillText(content, hw, 0);
                        } else {
                            ctx.fillText(content, i / 2, 0);
                        }
                        
                    }
                }
                
            }
        });
        
    }

    setConfig(configs) {
        Object.keys(configs).forEach(k => {
            if(configs[k] !== undefined && configs[k] !== null) {
                this[k] = configs[k];
                this._rawConfigs[k] = configs[k];
            }
        });
        this.preCalculateText();
        this.shadowCache();
    }

    click() {
        if(!this._status.editing) {
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

            const point = this._belongs._currentp;
            const jflow = this._jflow; 
            if(point) {
                this._cursorOffset = this._positionToCursorOffset(point);
            } else {
                this._cursorOffset = 0;
            }
            
            const inputElement = createInputElement(
                this._controlCallback.bind(this),
                this._defaultCallback.bind(this));
            const wrapper = jflow.DOMwrapper;
            wrapper.append(inputElement);  
            inputElement.focus({ preventScroll: true });      
            jflow.setFocusInstance(this);

            Object.assign(this._status, {
                editing: true,
                oldVal: this.content,
                inputElement,
                cursoranime: jflow.requestJFlowAnime((elapsed) => {
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
            });
            if(this.emptyWhenInput) {
                this.content = '';
            }
            this.syncShadowInputPosition();
        }
    }

    _makeFunctional() {
        const blurHandler = (event) => {
            this._status.editing = false;
            if(this._status.inputElement) {
                this._status.inputElement.remove();
            }
            if(this._belongs) {
                this._jflow.scheduleRender();
            } 
        };
        this.addEventListener('dblclick', (event) => {
            if(event.currentTarget !== this) {
                return
            }
            if(this._status.editing) {
                this._selectFullRange();
            } 
        });
        this.addEventListener('click', (event) => {
            if(event.currentTarget !== this) {
                return
            }
            // event.detail.bubbles = false;
            if(this._status.editing) {
                const point = this._belongs._currentp;
                const offset = this._positionToCursorOffset(point);
                if(this._status.shiftOn) {
                    const initialRange = this._textRange.initialRange;
                    Object.assign(this._textRange, {
                        rangefrom: Math.min(offset, initialRange),
                        rangeTo: Math.max(offset, initialRange),
                        enable: true,
                    });
                    this._cursorOffset = this._textRange.rangeTo;
                    this._status.inputElement.focus({ preventScroll: true });
                    // this._refreshCursor();  
                } else {
                    this._cursorOffset = offset
                    this._status.inputElement.focus({ preventScroll: true });
                    this._refreshCursor();  
                    this.syncShadowInputPosition();
                }
            } 
            this.click();
        })
        this.addEventListener('blur', (event) => {
            blurHandler(event);
            this.dispatchEvent(new JFlowEvent('change', {
                target: this,
                oldVal: this._status.oldVal,
                val: this.content,
            }));
            this._textRange.enable = false;
            this._status.cursoranime?.cancel()
            Object.assign(this._status, {
                editing: false,
                cursorshow: true,
                cursoranime: null,
                lastElapsed: 0,
                refreshElapsed: false,

                cursorDragging: false,
                shiftOn: false,

                oldVal: '',
                inputElement: null,
            })
        })
        this.addEventListener('instancePressStart', (event) => {
            if(this._status.editing && !this._status.shiftOn) {
                event.detail.bubbles = false;
                event.detail.preventDefault();
                const point = this._belongs._currentp;
                const c = this._positionToCursorOffset(point);

                this._textRange.initialRange = c;
                const jflow = event.detail.jflow;
                let moved = false;
                const t = (e => {
                    moved = true;
                    const { offsetX, offsetY } = e;
                    const p = jflow._calculatePointBack([offsetX, offsetY]);
                    jflow._stack.checkHit(p)
                    const point = this._belongs._currentp;
                    const c = this._positionToCursorOffset(point);
                    const initialRange = this._textRange.initialRange;
                    this._status.editing = false;
                    Object.assign(this._textRange, {
                        rangefrom: Math.min(c, initialRange),
                        rangeTo: Math.max(c, initialRange),
                        enable: true,
                    });
                }).bind(this);

                document.addEventListener('pointermove', t)
                document.addEventListener('pointerup', (e) => {
                    document.removeEventListener('pointermove', t);
                    if(!moved) {
                        this._textRange.initialRange = null;
                        return;
                    }
                    const rangeTo = this._textRange.rangeTo;
                    this._cursorOffset = rangeTo;
                    this._status.editing = true;
                    this._status.inputElement.focus({ preventScroll: true });   
                    this._textRange.initialRange = null;
                }, {
                    once: true,
                })
            }
        });
    }

    _positionToCursorOffset(point) {
        const [x] = point;
        const w = this.width/2;
        const [ox] = this.anchor;
        const offsetX = x - (ox - w);
        let cursorOffset = 0;
        if(offsetX >= this._textWidth) {
            cursorOffset = this.content.length;
        } else {
            cursorOffset = this._calculateOffset(offsetX);
        }

        return cursorOffset;
    }

    _calculateOffset(offx) {
        let content = this.currentContent;
        if(this.spacePlaceholder) {
            content = this.replaceSpaceHolder(content, true);
        }
        const maxL = content.length - 1;
        const contentWidth = this._textWidth;
        if(contentWidth === 0) {
            return 0;
        }
        const allwidth = contentWidth;
        let idx = Math.floor(offx / allwidth * maxL) ;
        requestCacheCanvas((ctx) => {
            ctx.font = `${this.fontSize} ${this.fontFamily}`;
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

    render(ctx) {
        if(this._isMoving){
            ctx.globalAlpha = 0.6
        }
        if(!ctx.disableCache && !this._status.editing && this._jflow.scale * parseInt(this.fontSize) < 8) {
            const [cx, cy] = this.anchor;
            // this._shadowCache.render(ctx);
            ctx.save();
            ctx.translate(cx, cy);
            ctx.beginPath();
            ctx.drawImage(this._shadowCache.imageBuffer, -this.width/2, -this.height/2, this.width, this.height);
            ctx.translate(-cx, -cy);
            ctx.restore();
            return;
        }

        const font = `${this.fontWeight} ${this.fontSize} ${this.fontFamily}`;
        if(ctx.font !== font) {
            ctx.font = font
        }

        if(ctx.textAlign !== this.textAlign) {
            ctx.textAlign = this.textAlign;
        }

        if(ctx.textBaseline !== this.textBaseline) {
            ctx.textBaseline = this.textBaseline;
        }

        ctx.fillStyle = this.isEmpty ? this.placeholderColor : this.textColor;
        let content = this.currentContent;
        if(this.spacePlaceholder) {
            if(this.textAlign === TEXT_ALIGN.LEFT){
                const hw = this.width / 2;
                let w = this.anchor[0] - hw + this.indent / 2;
                const y = this.anchor[1];
                this._spacedContentSegmnent.forEach(seg => {
                    ctx.fillStyle = seg[2];
                    ctx.fillText(seg[0], w, y);
                    w += seg[1];
                })
            } 
        } else {
            if(this.ellipsisContent) {
                content = this.ellipsisContent;
            }
            if(content) {
                if(this.textAlign === TEXT_ALIGN.LEFT){
                    const hw = this.width / 2;
                    ctx.fillText(content, this.anchor[0] - hw + this.indent / 2, this.anchor[1]);
                } else if(this.textAlign === TEXT_ALIGN.RIGHT) {
                    const hw = this.width / 2;
                    ctx.fillText(content, this.anchor[0] + hw, this.anchor[1]);
                } else {
                    ctx.fillText(content, this.anchor[0] + this.indent / 2, this.anchor[1]);
                }
            }
        }


        const hw = this.width/2;
        const textheight = this._textHeight
        const [x, y] = this.anchor;
        const lx = x - hw;
        const ly = y - textheight/2;

        if(this._status.cursorshow && this._status.editing) {
            const offset = this._cursorOffset;
            let c = content.substring(0, offset);
            if(this.spacePlaceholder) {
                c = this.replaceSpaceHolder(c, true);
            }
            const cw = lx + ctx.measureText(c).width;
            const c_len = this._textHeight/2;
            ctx.beginPath();
            ctx.moveTo(cw, y - c_len);
            ctx.lineTo(cw, y + c_len);
            ctx.lineWidth = 2;
            ctx.strokeStyle = this.cursorColor;
            ctx.stroke();
        }

        if(this._textRange.enable) {
            const {
                rangefrom, rangeTo
            } = this._textRange;
            const c = this.content.substring(0, rangefrom);
            const range = this.content.substring(rangefrom, rangeTo)
            
            const x = lx + ctx.measureText(c).width;
            const w = ctx.measureText(range).width;
            ctx.beginPath();
            ctx.rect(x, ly, w, textheight);
            ctx.fillStyle = this.textRangeColor
            ctx.fill();
        } 
    }

    _inputControl(op, data) {
        if(this._textRange.enable) {
            this._clearTextRange();
            if(op === 'Backspace') {
                this.dispatchEvent(new JFlowEvent('input', {
                    target: this,
                    oldVal: this._status.oldVal,
                    val: this.content,
                }));
                this.refresh();
                this.syncShadowInputPosition();
                return;
            }
        }
        const offset = this._cursorOffset;
        const content = this.content;
        let preContent = content.substring(0, offset);
        let afterContent 
        if(this.cacheIdx) {
            afterContent = content.substring(this.cacheIdx[1]);
        } else {
            afterContent = content.substring(offset);
        }
        let stopInputEvent = false;
        switch(op){
            case "Input":
                preContent += data;
                this._cursorOffset += data.length;
                this.content = preContent + afterContent;
                break;
            case "compositionstart":
                this.cacheIdx = [preContent.length, preContent.length];
                break;
            case "compositionupdate":
                preContent = preContent.substring(0, this.cacheIdx[0]);
                preContent += data;
                this.content = preContent + afterContent;

                this._cursorOffset = this.cacheIdx[0] + data.length;
                this.cacheIdx[1] = this.cacheIdx[0] + data.length;
                break;
            case "compositionend":
                preContent = preContent.substring(0, this.cacheIdx[0]);
                this._cursorOffset = this.cacheIdx[0] + data.length;
                this.cacheIdx = null;
                preContent += data;
                this.content = preContent + afterContent;
                break;
            case "Enter":
                if(this.cacheIdx) {
                    return;
                }
                let defaultAct = true;
                
                this.dispatchEvent(new JFlowEvent('enterkeypressed', {
                    target: this,
                    handler: (val) => {
                        defaultAct = val;
                    },
                    stopInput() {
                        stopInputEvent = true;
                    }
                }))
                if(defaultAct) {
                    this._jflow.blur();
                }
         
                break;
            case "Backspace":
                preContent = preContent.substring(0, preContent.length - 1);
                this._cursorOffset = Math.max(0, this._cursorOffset-1);
                this.content = preContent + afterContent;
                break;
            
        }

        if(!stopInputEvent) {
            this.dispatchEvent(new JFlowEvent('input', {
                target: this,
                oldVal: this._status.oldVal,
                val: this.content,
            }));
    
        }
       
        this.refresh();
        this.syncShadowInputPosition();
    }

    refresh() {
        this.preCalculateText();
        this._belongs.recalculateUp();
        this._jflow.scheduleRender();
    }

    syncShadowInputPosition() {
        if(this._status.editing) {
            const hw = this.width/2;
            const hh = this.height/2;
            let lx = this.anchor[0] - hw;
            const offset = this._cursorOffset;

            requestCacheCanvas((ctx) => {
                ctx.beginPath();
                ctx.font = `${this.fontSize} ${this.fontFamily}`;
                const c = this.content.substring(0, offset);
                lx += ctx.measureText(c).width;
            });
            const point = this.calculateToRealWorld([lx, hh]);
            const canvasMeta = this._jflow.canvasMeta;
            const px = Math.min(canvasMeta.actual_width - 120, point[0]);
            this._status.inputElement.style.transform = `translate(${px}px, ${point[1]}px)`
        }
    }

    _controlCallback(op, data, e) {
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
            case "Shift":
                this._onShiftToggle(data)
                break;
            case "CtrlA":
                this._selectFullRange();
                break;
            case "COPY":
                this._copy(e);
                break;
            case "CUT":
                this._cut(e);
                break;
            case "PASTE":
                this._paste(e);
                break;
        }

    }

    _onArrowLeft() {
        this._cursorOffset = Math.max(0, this._cursorOffset - 1);
        this._jflow.scheduleRender();
        this.syncShadowInputPosition();
    }

    _onArrowRight() {
        this._cursorOffset = Math.min(this.content.length, this._cursorOffset + 1);
        this._jflow.scheduleRender();
        this.syncShadowInputPosition();
    }    

    _onShiftToggle(val) {
        this._status.shiftOn = val;
        if(val) {
            this._textRange.initialRange = this._cursorOffset;
        } else {
            this._textRange.initialRange = null;
        }
    }

    _selectFullRange() {
        this._textRange = {
            enable: true,
            rangefrom: 0,
            rangeTo: this.content.length
        }
        this._cursorOffset = this.content.length;
    }

    _clearTextRange() {
        if(this._textRange.enable) {
            const { rangefrom, rangeTo } = this._textRange;
            const content = this.content;
            const preContent = content.substring(0, rangefrom);
            const afterContent = content.substring(rangeTo);
            this.content = preContent + afterContent;
            this._cursorOffset = preContent.length;
            this._textRange.enable = false;
        }
    }

    _getSelection() {
        if(this._textRange.enable) {
            const { rangefrom, rangeTo } = this._textRange;
            const content = this.content;
            return content.substring(rangefrom, rangeTo);
        }
        return null;
    }

    _copy(event) {
        const selection = this._getSelection();
        if(selection) {
            event.clipboardData.setData("text/plain", selection);
        }
    }
    _cut(event) {
        const selection = this._getSelection();
        if(selection) {
            event.clipboardData.setData("text/plain", selection);
            this._clearTextRange();
            this.refresh();
        }
    }
    _paste(event) {
        let pasteContent = (event.clipboardData || window.clipboardData).getData("text");
        let flag = false;
        this.dispatchEvent(new JFlowEvent('paste', {
            target: this,
            content: pasteContent,
            preventDefault() {
                flag = true;
            },
            resolvePasteContent(callback) {
                pasteContent = callback(pasteContent);
            }
        }));
        if(flag) {
            return;
        }
        this._clearTextRange();
        const offset = this._cursorOffset;
        const content = this.content;
        const preContent = content.substring(0, offset);
        const afterContent = content.substring(offset);
        this.content = preContent + pasteContent + afterContent;
        this._cursorOffset = (preContent + pasteContent).length;
        this.refresh();
    }
    _defaultCallback(op, e) {
        switch(op){
            case 'KeyDown': 
                this.dispatchEvent(new JFlowEvent('keydown', {
                    target: this,
                    key: e.key,
                    code: e.code,
                    rawEvent: e,
                }));
                break;
            case 'KeyUp': 
                this.dispatchEvent(new JFlowEvent('keyup', {
                    target: this,
                    key: e.key,
                    code: e.code,
                    rawEvent: e,
                }));
                break;
        }
        
    }

    destroy() {
        if(this._jflow._focus.instance === this) {
            this._jflow.blur();
        }
    }
}       

export default Text;


function createInputElement(controlCallback, defaultCallback) {
    const input = document.createElement('input');
    input.setAttribute('style',`
        width: 100px;
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
        }
    })

    input.addEventListener('keyup', (event) => {
        defaultCallback('KeyUp', event);
    });

    input.addEventListener('keydown', (event) => {
        defaultCallback('KeyDown', event);
    });

    input.addEventListener('copy', event => {
        event.preventDefault();
        event.stopPropagation();
        controlCallback('COPY', null, event);
    });

    input.addEventListener('cut', event => {
        event.preventDefault();
        event.stopPropagation();
        controlCallback('CUT', null, event);
    });

    input.addEventListener('paste', event => {
        event.preventDefault();
        event.stopPropagation();
        controlCallback('PASTE', null, event);
    });
    return input;
}
