import Node from '../node';
import StackMixin from '../stackMixin';
import LayoutMixin from '../layoutMixin';
import Rectangle from '../shapes/rectangle';
import { bounding_box, doOverlap } from '../../utils/functions';
import { DIRECTION } from '../../utils/constance';
import { ScrollBar } from '../../scrollbar/scrollbarMixin';
const ishitKey = Symbol('ishit');

class InnerScrollBar extends ScrollBar {
    constructor(dir, configs = {}) {
        super(dir, configs);
        this.visible = false;
    }
    render(ctx) {
        if(this.visible) {
            super.render(ctx);
        }
    }

    setHit(ishit) {
        if(this[ishitKey] !== ishit) {
            this.isFocus = ishit
            this.onHit();
        }
        this[ishitKey] = ishit;
    }
}
 
class ScrollGroup extends Node {
    constructor(configs) {
        super(configs);
        this.type = 'ScrollGroup';
        this.initStack(configs);
        this.initLayout(configs);
        this.initScrollBar(configs);
        this._shape = new Rectangle(configs);
        this._shape.anchor = [0, 0];
        this._shape._belongs = this;

        this.maxWidth = configs.maxWidth || Infinity;
        this.definedWidth = configs.definedWidth;
        this.maxHeight = configs.maxHeight || Infinity;
        this.definedHeight = configs.definedHeight;

        this.lock = configs.lock ?? true ;
        this._offset = [0, 0];

        this._getBoundingGroupRect();
        this.reflow();
        this._getBoundingGroupRect();  
        this._resetOffset();

    }

    initScrollBar(configs) {
        const {
            barColor,
            barFocusColor,
            barMarginX,
            barMarginY,
            barWidth,
        } = configs;
        this._scrollbarX = new InnerScrollBar('x', {
            plainColor: barColor,
            focusColor: barFocusColor,
            barWidth,
        });
        this._scrollbarY = new InnerScrollBar('y', {
            plainColor: barColor,
            focusColor: barFocusColor,
            barWidth
        });
        this._scrollbarX.barMarginX = barMarginX || 1;
        this._scrollbarY.barMarginY = barMarginY || 1;
        const _f = () => {
            this._jflow.scheduleRender();
        }
        this._scrollbarX.onHit = _f;
        this._scrollbarY.onHit = _f;

        this._scrollBarStatus = {
            dragging: false,
            target: null,

            barInitX: 0,
            barInitY: 0,
            barStartX: 0,
            barStartY: 0,

            hitScrollX: false,
            hitScrollY: false,
        }
        // // const jflowInstance = this._jflow;
        // this.addEventListener('instancemousemove', e => {
        //     if(this._scrollBarStatus.hitScrollX) {
        //         if(!this._scrollbarX.isFocus) {
        //             this._scrollbarX.isFocus = true;
        //             e.detail.jflow.scheduleRender();
        //         }
        //         return;
        //     }
        //     if(this._scrollbarX.isFocus) {
        //         this._scrollbarX.isFocus = false;
        //         e.detail.jflow.scheduleRender();
        //     }
        
        // })
        this.addEventListener('instancePressStart', e => {
            if(this._scrollBarStatus.hitScrollX) {
                e.detail.preventDefault();
                e.detail.bubbles = false;
                const clientX = e.detail.event.clientX;
                Object.assign(this._scrollBarStatus, {
                    dragging: true,
                    target: this._scrollbarX,
                    barStartX: this._scrollbarX.anchor[0],
                    barInitX: clientX,
                });
                this.onScrollbarPressStart();
            }
            if(this._scrollBarStatus.hitScrollY) {
                e.detail.preventDefault();
                e.detail.bubbles = false;
                const clientY = e.detail.event.clientY;
                Object.assign(this._scrollBarStatus, {
                    dragging: true,
                    target: this._scrollbarY,
                    barStartY: this._scrollbarY.anchor[1],
                    barInitY: clientY,
                });
                this.onScrollbarPressStart();
            }
        })
    }

    onScrollbarPressStart() {
        const jflowInstance = this._jflow;
        const canvas = jflowInstance.canvas;
        const f = (e => {
            const { clientX, clientY } = e;
            this.onDraggingScrollbar(clientX, clientY)
        }).bind(this);
        document.addEventListener('pointermove', f);
        const t = (e => {
            Object.assign(this._scrollBarStatus, {
                dragging: false,
                target: null,
                barInitX: 0,
                barInitY: 0,
                barStartX: 0,
                barStartY: 0,
                hitScrollX: false,
                hitScrollY: false,
            });
            document.removeEventListener('pointermove', f);
            document.removeEventListener('pointerup', t);
            canvas.removeEventListener('pointerup', t);
        }).bind(this);
        canvas.addEventListener('pointerup', t, {
            once: true
        })
        document.addEventListener('pointerup', t, {
            once: true
        })
    }

    onDraggingScrollbar(clientX, clientY) {
        if(this._scrollbarX.visible && this._scrollBarStatus.dragging) {
            const JFLOW = this._jflow;
            const scale = JFLOW.scale;
            const {
                target,
                barInitX,
                barStartX,
                barInitY,
                barStartY
            } = this._scrollBarStatus;
            if(target.dir === 'x') {
                const _scrollWidth = this._scrollbarX.width;
                const _outerWidth = this._outerWidth;
                const deltaX = clientX - barInitX;
                const xnew = barStartX + deltaX / scale;
                const q = target.anchor[0] = Math.max(Math.min(xnew, _outerWidth - _scrollWidth), 0);
                const ratioInX = q / (_outerWidth - _scrollWidth);
                const s = (this._innerWidth - _outerWidth)/2;
                this._offset[0] = s - (this._innerWidth - _outerWidth) * ratioInX
                JFLOW.scheduleRender()
            }

            if(target.dir === 'y') {
                const _scrollHeight = this._scrollbarY.height;
                const _outerHeight = this._outerHeight;
                const deltaY = clientY - barInitY;
                const ynew = barStartY + deltaY / scale;
                const q = target.anchor[1] = Math.max(Math.min(ynew, _outerHeight - _scrollHeight), 0);
                const ratio = q / (_outerHeight - _scrollHeight);
                const s = (this._innerHeight - _outerHeight)/2;
                this._offset[1] = s - (this._innerHeight - _outerHeight) * ratio
                JFLOW.scheduleRender()
            }
        }
    }


    setConfig(configs) {
        this._shape.setConfig(configs);
    }

    _getBoundingGroupRect() {
        const points = this._stack.getBoundingRectPoints();
        // content box 
        const bbox = bounding_box(points);
        const w = bbox.width;
        const h = bbox.height;
        const outerWidth = this.definedWidth || Math.min(w, this.maxWidth);
        const outerHeight = this.definedHeight || Math.min(h, this.maxHeight);
        this._innerWidth = w;
        this._outerWidth = outerWidth;
        this._innerHeight = h;
        this._outerHeight = outerHeight;

        this._shape.width = outerWidth;
        this._shape.height = outerHeight;
        this.width = outerWidth;
        this.height = outerHeight;
    }

    _calculatePointBack(point) {
        const [gx, gy] = point;
        const [tx, ty] = this._offset;
        const [cx, cy] = this.anchor; 
        const p = [gx - cx - tx, gy - cy - ty]
        return p
    }

    calculateToCoordination(point) {
        const [gx, gy] = point;
        const [cx, cy] = this.anchor;  
        const [tx, ty] = this._offset;
        const p = [gx + cx - tx, gy + cy - ty]
        if(this._belongs && this._belongs.calculateToCoordination) {
            return this._belongs.calculateToCoordination(p);
        } else {
            return p;
        }
    }

    calculateToRealWorld(point) {
        const [gx, gy] = point;
        const [cx, cy] = this.anchor;  
        const [tx, ty] = this._offset;
        const p = [gx + cx - tx, gy + cy - ty]
        if(this._belongs && this._belongs.calculateToRealWorld) {
            return this._belongs.calculateToRealWorld(p);
        }
    }

    _getViewBox() {
        const cacheViewBox = [
            ...this._calculatePointBack([0,0]),
            ...this._calculatePointBack([this.width, this.height]),
        ];
        this._cacheViewBox = cacheViewBox;
        return cacheViewBox;
    }

    _resetOffset() {
        this._offset = [
            Math.max((this._innerWidth - this._outerWidth)/2, 0),
            Math.max((this._innerHeight - this._outerHeight)/2, 0),
        ];
        if(this._innerWidth > this._outerWidth) {
            this._scrollbarX.visible = true;
            this._scrollbarX.width = this._outerWidth * this._outerWidth / this._innerWidth;
            this._scrollbarX.anchor = [0, this._outerHeight - 4]
        } else {
            this._scrollbarX.visible = false;
        }
        if(this._innerHeight > this._outerHeight) {
            this._scrollbarY.visible = true;
            this._scrollbarY.height = this._outerHeight * this._outerHeight / this._innerHeight;
            this._scrollbarY.anchor = [this._outerWidth - 4, 0]
        } else {
            this._scrollbarY.visible = false;
        }
    }

    render(ctx) {
        if(this._isMoving){
            ctx.globalAlpha = 0.6
        } else if(this.opacity !== 1) {
            ctx.globalAlpha = this.opacity;
        }
        const [cx, cy] = this.anchor; 
        const w = this.width;
        const h = this.height;
        const w2 = w/2;
        const h2 = h/2;
        // if((this.width * this.height) * this._jflow.scale < 144) {
        //     ctx.restore();
        //     return;
        // }
        const [tx, ty] = this._offset;
        ctx.translate(cx, cy);
        this._shape.render(ctx);
        ctx.translate(-w2, -h2);
        if(this._scrollbarX.visible) {
            this._scrollbarX.render(ctx);
        }
        if(this._scrollbarY.visible) {
            this._scrollbarY.render(ctx);
        }

        ctx.translate(w2, h2);
        ctx.save();
        ctx.beginPath();
        ctx.rect(-w2, -h2, w, h);
        ctx.clip();
        ctx.translate(tx, ty);
        this._stack.render(ctx);
        this._linkStack.render(ctx);    
        ctx.translate(-cx-tx, -cy-ty);
        ctx.restore();
    }

    isHit(point, condition) {
        const [gx, gy] = point;
        const [cx, cy] = this.anchor; 
        const w = this.width/2;
        const h = this.height/2;
        const sp = [gx - cx + w, gy - cy + h]
        this._scrollBarStatus.hitScrollX = false;
        this._scrollBarStatus.hitScrollY = false;
        if(this._scrollbarX.visible) {
            const xhit = this._scrollbarX.isHit(sp);
            if(xhit) {
                this._scrollBarStatus.hitScrollX = true;
                this._scrollbarX.setHit(true)
                return true;
            }
        }
        this._scrollbarX.setHit(false)

        if(this._scrollbarY.visible) {
            const yhit = this._scrollbarY.isHit(sp);
            if(yhit) {
                this._scrollBarStatus.hitScrollY = true;
                this._scrollbarY.setHit(true)
                return true;
            }
        }
        this._scrollbarY.setHit(false)
       
        // const br = this._getViewBox();
        const isInBound = this._shape.isHit([gx - cx, gy - cy]);
        if(isInBound) {
            const [tx, ty] = this._offset;
            const p = [gx - cx - tx, gy - cy - ty];
            this._currentp = p; // 暂存，为了后续计算别的位置
            const target = this._stack.checkHit(p, condition); 
            if(target) return target; 
        } else {
            this._stack.resetHitStatus();
        }
        return false;
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
        return [
            ltx, lty,
            rbx, rby,
        ]
    }

    getIntersectionsInFourDimension() {
        let p2 = this.anchor;
        if(this._belongs && this._belongs.calculateToCoordination) {
            p2 = this._belongs.calculateToCoordination(p2);
        }

        const [x2, y2] = p2;
        const w = this.width/2;
        const h = this.height/2;
        return {
            [DIRECTION.RIGHT]:  [x2+w, y2],
            [DIRECTION.LEFT]:   [x2-w, y2],
            [DIRECTION.BOTTOM]: [x2, y2+h],
            [DIRECTION.TOP]:    [x2, y2-h],
            [DIRECTION.SELF]:   [x2+w*0.618, y2+h*0.618]
        }
    }

    onEnterViewbox() {
        this.interateNodeStack((instance) => {
            instance.onEnterViewbox();
        })
    }
    onLeaveViewbox() {
        this.interateNodeStack((instance) => {
            instance.onLeaveViewbox();
        })
    }
    destroy() {
        this._shape.destroy();
        this.interateNodeStack((instance) => {
            instance.destroy();
        })
    }

    clone() {
        const C = this.constructor;
        const configs = Object.assign({}, this._rawConfigs, {
            layout: this._layout && this._layout.clone(),
        })
        const t = new C(configs);
        this.interateNodeStack((instance) => {
            t.addToStack(instance.clone());
        })
        t.recalculate();
        t.visible = this.visible;
        return t;
    }
}

Object.assign(ScrollGroup.prototype, StackMixin);
Object.assign(ScrollGroup.prototype, LayoutMixin);
Object.assign(ScrollGroup.prototype, {
    recalculateUp() {
        let dirty = true;
        
        if(this.getBoundingDimension) {
            // const { width: wold, height: hold } = this.getBoundingDimension();
            const wold = this._innerWidth;
            const hold = this._innerHeight;
            if(this.resetChildrenPosition) {
                this.resetChildrenPosition();
            }
            if(this._getBoundingGroupRect){
                this._getBoundingGroupRect();
            }
            this.reflow();
            if(this._getBoundingGroupRect){
                this._getBoundingGroupRect();
            }
            const wnow = this._innerWidth;
            const hnow = this._innerHeight;
            // const { width: wnow, height: hnow } = this.getBoundingDimension();
            dirty = (wold !== wnow || hold !== hnow)
        } else {
            this.reflow();
        }
        if(this._belongs && dirty) {
            this._resetOffset();
            this._belongs.recalculateUp();
        }
    },

    recalculate() {
        const { width: wold, height: hold } = this.getBoundingDimension();
        this.reflow();
        if(this._getBoundingGroupRect){
            this._getBoundingGroupRect();
        }
        const { width: wnow, height: hnow } = this.getBoundingDimension();
        if (wold !== wnow || hold !== hnow) {
            this._resetOffset();
        }
    },
})


export default ScrollGroup