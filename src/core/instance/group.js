import Instance from './instance';
import StackMixin from './stackMixin';
import { bounding_box } from '../utils/functions';
import { DIRECTION } from '../utils/constance';

class Group extends Instance {
    constructor(configs) {
        super(configs)
        this.initStack(configs);
        
        this.type =             'Group';
        this.padding =          configs.padding || 5;
        this.color =            '#fff';
        this.borderColor =      '#ddd';
        this.borderRadius =     configs.borderRadius || 0;
        this.borderWidth =      configs.borderWidth === undefined ? 2 : configs.borderWidth;
        this.hoverStyle =       configs.hoverStyle || 'cornflowerblue';
        this.shrink =           false;
        this.hasShrink =        configs.hasShrink;
        this.lock =             configs.lock;
        this.status.focusOnControlPoint = false;
        this._getBoundingGroupRect();
        this.addEventListener('click', (event) => {
            console.log(this.status.focusOnControlPoint)
            if(this.status.focusOnControlPoint) {
                this.shrink = !this.shrink;
                event.detail.jflow._render();
            }
        });
        this._currentCenter = this.getCenter();
    }

    getCenter() {
        const anchor = this.anchor;
        const { width, height } = this.bounding_box;
        return [anchor[0] + width/2, anchor[1] + height/2]
    }

    getColor() {
        if(this.status.hover) {
            return this.hoverStyle;
        }
        return this.borderColor;
    }

    _getBoundingGroupRect() {
        if(this.shrink) {
            const padding = this.padding;
            const anchor = this.anchor;
            const bx = anchor[0] - padding;
            const by = anchor[1] - padding;
            this.bounding_box = { x: bx, y: by, width: 100, height: 18, shrink: true, };
        } else {
            const points = this._stack.getBoundingRectPoints();
            const bbox = bounding_box(points);
            const padding = this.padding;
            const w = bbox.width + padding * 2;
            const h = bbox.height + padding * 2;
            const bx = bbox.x - padding;
            const by = bbox.y - padding;
            if(this.bounding_box && !this.bounding_box.shrink) {
                const vecx = bx - this.bounding_box.x;
                const vecy = by - this.bounding_box.y;
                this.anchor[0] += vecx;
                this.anchor[1] += vecy;
            }
            this.bounding_box = { x: bx, y: by, width: w, height: h };
        }
        
    }

    _renderRectangle(ctx) {
        const { width, height } = this.bounding_box;
        const x = this.anchor[0];
        const y = this.anchor[1];
        if(this.borderRadius) {
            const radius = this.borderRadius;
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
        } else {
            ctx.rect(x, y, width, height);
        }
    }

    render(ctx) {
        this._getBoundingGroupRect();
        const anchor = this.anchor;
        const { x, y, width, height } = this.bounding_box;
        ctx.beginPath();
        this._renderRectangle(ctx);
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fill(); 
        if(this.borderWidth) {
            ctx.strokeStyle = this.getColor();
            ctx.lineWidth = this.borderWidth;
            ctx.stroke();   
        }

        if(this.hasShrink) {  
            ctx.beginPath();
            ctx.arc(anchor[0], anchor[1], 8, 0, 2 * Math.PI)
            ctx.fill(); 
            ctx.lineWidth = 1;
            ctx.stroke();     
        }
        
        ctx.restore();
        ctx.translate(anchor[0] - x, anchor[1] - y);
        if(this.hasShrink && this.shrink) {
            // TODO 收起应该抛出事件
            ctx.fillText('Group', anchor[0], anchor[1])
        } else {
            this._stack.render(ctx);
            this._linkStack.render(ctx);
        }
        ctx.translate(x - anchor[0], y - anchor[1])


        if(this.status.focus) {
            this.renderFocus(ctx);
        }
    }

    

    isHit(point, condition) {
        const p = this._calculatePointBack(point);
        this._currentp = p; // 暂存，为了后续计算别的位置
        if(!this.lock) {
            const target = this._stack.checkHit(p, condition);
            if(target) return target;
        }
       

        const [x, y] = this.anchor;
        const ishitControlBtn = Math.pow(point[0] - x, 2) + Math.pow(point[1] - y, 2) < 64;
        if(ishitControlBtn) {
            this.status.focusOnControlPoint = true;
            return true;
        } else {
            this.status.focusOnControlPoint = false;
        }
        const { width, height } = this.bounding_box;
        return point[0] > x 
            && point[0] < x + width 
            && point[1] > y
            && point[1] < y + height;
    }

    _calculatePointBack(point) {
        const [gx, gy] = point;
        const anchor = this.anchor;
        const { x, y } = this.bounding_box;
        const p = [gx - (anchor[0] - x), gy - (anchor[1] -y) ];
        return p
    }

    getBoundingRect() {
        const [x, y] = this.anchor;
        const { width, height } = this.bounding_box;
        return [[x, y], [x + width, y], [x + width, y + height], [x, y + height]];
    }

    calculateIntersection(point) {
        const [bx, by] = this.anchor;
        const { width, height } = this.bounding_box;
        const [x1, y1] = point;
        
        const w = width/2;
        const h = height/2;
        const x2 = bx + w;
        const y2 = by + h;
        const vecx = x2 - x1;
        const vecy = y2 - y1;
        const theta1 = h/w;
        const theta2 = Math.abs(vecy/vecx);
        const dirx = x1 > x2;
        const diry = y1 > y2;
        let x, y;
        if(theta2 < theta1) {
            x = x2 + (dirx?w:-w);
            y = w * (diry?theta2:-theta2) + y2;
        } else {
            y = y2 + (diry?h:-h);
            x = h / (dirx?theta2:-theta2) + x2;
        }
        return [x, y];
    }

    calculateIntersectionInFourDimension(point) {
        const [bx, by] = this.anchor;
        const { width, height } = this.bounding_box;
        const [x1, y1] = point;

        const w = width/2;
        const h = height/2;
        const x2 = bx + w;
        const y2 = by + h;
        const vecx = x2 - x1;
        const vecy = y2 - y1;
        const theta1 = h/w;
        const theta2 = Math.abs(vecy/vecx);
        const dirx = x1 > x2;
        const diry = y1 > y2;
        if(theta2 > theta1) {
            return {
                p: [x2, diry?y2+h:y2-h],
                dir: diry ? DIRECTION.BOTTOM : DIRECTION.TOP,
            }
        } else {
            return {
                p: [dirx?x2+w:x2-w, y2],
                dir: dirx ? DIRECTION.RIGHT : DIRECTION.LEFT,
            }
        }
    }
}
Object.assign(Group.prototype, StackMixin);
export default Group;