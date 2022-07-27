class ScrollBar {
    constructor(dir, configs = {}) {
        this.anchor = [0,0];
        this.width = configs.barWidth || 4;
        this.height = configs.barWidth || 4;  
        this.barMarginX = 0;
        this.barMarginY = 0
        this.dir = dir;
        this.plainColor = configs.plainColor || 'rgba(0, 0, 0, 0.15)';
        this.focusColor = configs.focusColor || 'rgba(0, 0, 0, 0.25)';
        this.isFocus = false;
    }
    render(ctx) {
        const [x, y] = this.anchor;
        ctx.save();
        ctx.beginPath();
        ctx.rect(
            x + this.barMarginX,
            y + this.barMarginY,
            this.width - this.barMarginX*2,
            this.height - this.barMarginY*2);
        ctx.fillStyle = this.isFocus ? this.focusColor : this.plainColor;
        ctx.fill();
        ctx.restore();
    }
    isHit(point) {
        const anchor = this.anchor;
        const w = this.width;
        const h = this.height;
        return point[0] > anchor[0] - 5
            && point[0] < anchor[0] + w + 5
            && point[1] > anchor[1] - 5
            && point[1] < anchor[1] + h + 5;
    }
}
export default {
    initScrollBar(configs = {}) {
        const {
            barColor,
            barFocusColor,
            barMarginX,
            barMarginY,
            barWidth,
        } = configs;
        this._scrollbarEnable = true;
        this._scrollbarX = new ScrollBar('x', {
            plainColor: barColor,
            focusColor: barFocusColor,
            barWidth,
        });
        this._scrollbarX.barMarginX = barMarginX || 5;
        
        this._scrollbarY = new ScrollBar('y', {
            plainColor: barColor,
            focusColor: barFocusColor,
            barWidth
        });
        this._scrollbarY.barMarginY = barMarginY || 5;

        this._scrollBarStatus = {
            dragging: false,
            target: null,
            xscale: undefined,
            yscale: undefined,

            barInitX: 0,
            barInitY: 0,
        }
        // this._scrollbarX.addEventListener('pressStart', (e) => {
        //     const { offsetX, offsetY } = e.detail;
        //     // console.log(e, offsetX, offsetY)
        //     Object.assign(this._scrollBarStatus, {
        //         dragging: true,
        //         target: this._scrollbarX,
        //         barStartX: this._scrollbarX.anchor[0],
        //         barInitX: offsetX,
        //         // barInitY: offsetY,
        //     });
        // })
        // this._scrollbarY.addEventListener('pressStart', (e) => {
        //     const { offsetX, offsetY } = e.detail;
        //     Object.assign(this._scrollBarStatus, {
        //         dragging: true,
        //         target: this._scrollbarY,
        //         barStartY: this._scrollbarY.anchor[1],
        //         // barInitX: offsetX,
        //         barInitY: offsetY,
        //     });
        // });

        this.addEventListener('zoompan', () => {
            this.scrollBarOnPanAndZoom();
        })
        this.scrollBarOnPanAndZoom();
    },
    onScrollbarPressStart(offsetX, offsetY) {
        if(this._scrollbarEnable) {
            const xhit = this._scrollbarX.isHit([offsetX, offsetY]);
            if(xhit) {
                Object.assign(this._scrollBarStatus, {
                    dragging: true,
                    target: this._scrollbarX,
                    barStartX: this._scrollbarX.anchor[0],
                    barInitX: offsetX,
                    // barInitY: offsetY,
                });
                return true;
            }
            const yhit = this._scrollbarY.isHit([offsetX, offsetY]);
            if(yhit) {
                Object.assign(this._scrollBarStatus, {
                    dragging: true,
                    target: this._scrollbarY,
                    barStartY: this._scrollbarY.anchor[1],
                    // barInitX: offsetX,
                    barInitY: offsetY,
                });
                return true;
            }
        }
        return false;
    },
    onDraggingScrollbar(offsetX, offsetY) {
        if(this._scrollbarEnable && this._scrollBarStatus.dragging) {
            const {
                target,
                barInitX,
                barStartX,
                barInitY,
                barStartY,
                xscale,
                yscale,
                scollbarHeight,
                scollbarWidth,
                realR,
                realL,
                realT,
                realB,
            } = this._scrollBarStatus;
            const { actual_width, actual_height } = this.canvasMeta;
            const { 
                x: p_x, 
                y: p_y 
            } = this.bounding_box;
            // console.log(target.dir, realT, realB)
            if(target.dir === 'x') {
                const deltaX = offsetX - barInitX;
                const xnew = barStartX + deltaX;
                const q = target.anchor[0] = Math.max(Math.min(xnew, actual_width - scollbarWidth), 0);
                const ratioInX = q / actual_width;
                // const y = (realB - (realB - realT) * ratioInY) * this.scale
                const ratioX = (realR - realL) * ratioInX + realL
                const x = (p_x - ratioX) * this.scale
                Object.assign(this.position, {
                    offsetX: x - p_x * this.scale,
                    x,
                });
            }

            if(target.dir === 'y') {      
                const deltaY = offsetY - barInitY;
                const ynew = barStartY + deltaY;
                const q = target.anchor[1] = Math.max(Math.min(ynew, actual_height - scollbarHeight), 0);;
                const ratioInY = q / actual_height;
                // const y = (realB - (realB - realT) * ratioInY) * this.scale
                const ratioY = (realB - realT) * ratioInY + realT
                const y = (p_y - ratioY) * this.scale
                Object.assign(this.position, {
                    offsetY: y - p_y * this.scale,
                    y,
                });
            }
            this.scheduleRender()
            return true;
        }
        return false;
    },
    checkScrollBarHover(offsetX, offsetY) {
        if(this._scrollbarEnable) {
            const xhit = this._scrollbarX.isHit([offsetX, offsetY]);
            if(xhit) {
                // this._scrollBarStatus.hoverTarget = this._scrollbarX;
                if(!this._scrollbarX.isFocus) {
                    this._scrollbarX.isFocus = true;
                    this.scheduleRender();
                }
                
                return true;
            }
            const yhit = this._scrollbarY.isHit([offsetX, offsetY]);
            if(yhit) {
                // this._scrollBarStatus.hoverTarget = this._scrollbarY;
                if(!this._scrollbarY.isFocus) {
                    this._scrollbarY.isFocus = true;
                    this.scheduleRender();
                }
                return true;
            }
        }
        return false;
    },
    resetScrollBarHover() {
        if(this._scrollbarEnable) {
            if(this._scrollbarY.isFocus || this._scrollbarX.isFocus) {
                this._scrollbarY.isFocus = false;
                this._scrollbarX.isFocus = false;
                this.scheduleRender();
            }
        }
    },
    scrollBarOnPanAndZoom() {
        if(!this._scrollbarEnable || this._scrollBarStatus.dragging) {
            return;
        }
        const { 
            width: p_width, 
            height: p_height, 
            x: p_x, 
            y: p_y 
        } = this.bounding_box;
        
        const [x, y, r, b] = this._getViewBox();
        const realR = Math.max(r, p_x + p_width);
        const realL = Math.min(x, p_x);
        const realT = Math.min(y, p_y);
        const realB = Math.max(b, p_y + p_height);
        const vw = r - x;
        const vh = b - y;
        const { actual_width, actual_height } = this.canvasMeta;
        const xscale = vw / (realR - realL)
        if(xscale < 1)  {
            const scollbarWidth = actual_width * xscale;
            const anchorX = (x - realL) * xscale * this.scale;
            this._scrollbarX.anchor = [anchorX, actual_height - 10];
            this._scrollbarX.width = scollbarWidth;
            this._scrollBarStatus.scollbarWidth = scollbarWidth;
        }
        
        const yscale = vh / (realB - realT);
        if(yscale < 1)  {
            const scollbarHeight = actual_height * yscale;
            const anchorY = (y - realT) * yscale * this.scale;
            this._scrollbarY.anchor = [actual_width - 10, anchorY];
            this._scrollbarY.height = scollbarHeight;
            this._scrollBarStatus.scollbarHeight = scollbarHeight;
        }

        Object.assign(this._scrollBarStatus, {
            yscale,
            xscale,
            realR,
            realL,
            realT,
            realB,
        })
        
    },
    resetScollBarStatus() {
        if(this._scrollbarEnable) {
            Object.assign(this._scrollBarStatus, {
                dragging: false,
                target: null,
                x: undefined,
                y: undefined,
            });
        }
    },
    renderScrollBar(ctx) {
        if(this._scrollbarEnable) {
            ctx.setTransform();
            ctx.scale(this.dpr, this.dpr);
            const {
                xscale,
                yscale
            } = this._scrollBarStatus;
            if(xscale < 1)  {
                this._scrollbarX.render(ctx);
            }
            if(yscale < 1)  {
                this._scrollbarY.render(ctx);
            }
        }
    }
}