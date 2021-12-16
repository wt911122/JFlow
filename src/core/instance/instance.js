import { setUniqueId, getUniqueId } from '../utils/functions';
import { nextDirection } from '../utils/constance';
const margin = 5;
const ishitKey = Symbol('ishit');
class Instance extends EventTarget{
    constructor(configs = {}) {
        super();
        Object.assign(this, configs);
        // this.anchor = configs.anchor || [0, 0];
        // this.belongs = undefined;
        this.visible = true;
        this.status = {
            hover: false,
            focus: false,
            moving: false,
        }
        // this._jflow = undefined;
        this._belongs = undefined;
        this[ishitKey] = false; 

        /** layout 抽象节点关联属性 */
        this._layoutNode = undefined;

        /**
            通用样式属性
         */
        this.borderWidth =      configs.borderWidth !== undefined ? configs.borderWidth : 2;
        this.borderColor =      configs.borderColor || 'black';
        this.hoverStyle =       configs.hoverStyle || 'transparent';
        this.content =          configs.content || '';
        this.color =            configs.color || 'white';
        this.strokeColor =      configs.strokeColor || 'white';
        this.font =             configs.font || '28px serif';
        this.textColor =        configs.textColor || 'white';
        this.textAlign =        configs.textAlign || 'center';
        this.textBaseline =     configs.textBaseline || 'middle';
    }

    get _isTargeting() {
        return this === (this._jflow._target.instance || this._jflow._target.link);
    }

    get _isMoving() {
        return this === this._jflow._getMovingTarget();
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
        Object.keys(configs).forEach(k => {
            if(configs[k] !== undefined && configs[k] !== null) {
                this[k] = configs[k]
            }
        })
    }

    render() {
        throw 'require render implement'
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

    getIntersectionsInFourDimension() {
        throw 'require getIntersectionsInFourDimension implement'
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
        console.log(customEvent)
        if(customEvent.detail.bubbles && this._belongs.bubbleEvent){
            console.log(customEvent.type)
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

    removeFromLayoutSource() {
        
        if(this._layoutNode) {
            this._layoutNode.remove();
        }
    }
}

export default Instance;