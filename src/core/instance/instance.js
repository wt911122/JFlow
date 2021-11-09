import { setUniqueId, getUniqueId } from '../utils/functions';
const margin = 5;
const ishitKey = Symbol('ishit');
class Instance extends EventTarget{
    constructor(configs = {}) {
        super();
        this.anchor = configs.anchor || [0, 0];
        // this.belongs = undefined;
        this.visible = true;
        this.outOfFlow = !!configs.outOfFlow;
        this.status = {
            hover: false,
            focus: false,
            moving: false,
        }
        // this._jflow = undefined;
        this._belongs = undefined;
        this[ishitKey] = false; 
        /**
            通用样式属性
         */
        this.borderWidth =      configs.borderWidth !== undefined ? configs.borderWidth : 2;
        this.borderColor =      configs.borderColor || 'black';
        this.hoverStyle =       configs.hoverStyle || 'transparent';
        this.content =          configs.content || '';
        this.color =            configs.color || 'white';
        this.font =             configs.font || '28px serif';
        this.textColor =        configs.textColor || 'white';
        this.textAlign =        configs.textAlign || 'center';
        this.textBaseline =     configs.textBaseline || 'middle';
    }

    get _isTargeting() {
        return this === (this._jflow._target.instance || this._jflow._target.link);
    }

    get _isMoving() {
        return this === this._jflow._target.moving;
    }

    get _isHit() {
        return this[ishitKey];
    }

    get _jflow() {
        return this._belongs.uniqueName === 'jflow' ? this._belongs : this._belongs._jflow;
    }

    set _isHit(ishit) {
        if(this[ishitKey] !== ishit) {
            this.dispatchEvent(new CustomEvent(ishit ? 'mouseenter': 'mouseleave' , {
                detail: {
                    instance: this,
                }
            }));
        }
        this[ishitKey] = ishit; // validation could be checked here such as only allowing non numerical values
    }
    setConfig(configs) {
        Object.assign(this, configs)
    }

    render() {
        throw 'require render implement'
    }

    renderFocus(ctx) {
        const points = this.getBoundingRect();
        if(points.length !== 4) return;
        const [p0, p1, p2, p3] = points;
        const width = p1[0] - p0[0];
        const height = p3[1] - p0[1];
        const w = width * 0.2;
        const h = height * 0.2;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(p0[0] - margin, p0[1] - margin + h);
        ctx.lineTo(p0[0] - margin, p0[1] - margin);
        ctx.lineTo(p0[0] - margin + w, p0[1] - margin);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(p1[0] + margin - w, p1[1] - margin);
        ctx.lineTo(p1[0] + margin, p1[1] - margin);
        ctx.lineTo(p1[0] + margin, p1[1] - margin + h);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(p2[0] + margin, p2[1] + margin - h);
        ctx.lineTo(p2[0] + margin, p2[1] + margin);
        ctx.lineTo(p2[0] + margin - w, p2[1] + margin);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(p3[0] - margin + w, p3[1] + margin);
        ctx.lineTo(p3[0] - margin, p3[1] + margin);
        ctx.lineTo(p3[0] - margin, p3[1] + margin - h);
        ctx.stroke();
        ctx.restore();
    }

    isHit() {
        throw 'require isHit implement'
    }

    getBoundingRect() {
        throw 'require getBoundingRect implement'
    }

    calculateIntersection() {
        throw 'require calculateIntersection implement'
    }

    getCenter() {
        return this.anchor;
    }

    getBoundingDimension() {
        const rect = instance.getBoundingRect();
        let min_y = Infinity;
        let max_y = -Infinity;
        let min_x = Infinity;
        let max_x = -Infinity;
        rect.forEach(point => {
            max_y = Math.max(max_y, point[1]);
            min_y = Math.min(min_y, point[1]);
            max_x = Math.max(max_x, point[0]);
            min_x = Math.min(min_x, point[0]);
        });
        return {
            height: max_y - min_y,
            width: max_x - min_x,
        }
    }

    bubbleEvent(customEvent){
        this.dispatchEvent(customEvent);
        if(customEvent.detail.bubbles && this._belongs.bubbleEvent){
            this._belongs.bubbleEvent(customEvent);
        }
    }

    calculateToRealWorld(point) {
        if(this._belongs && this._belongs.calculateToRealWorld) {
            return this._belongs.calculateToRealWorld(point);
        } else {
            return point;
        }
    }
}

export default Instance;