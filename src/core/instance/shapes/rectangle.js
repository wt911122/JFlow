import Node from '../node';
import { DIRECTION, oppositeDirection } from '../../utils/constance';
/**
 * 矩形单元
 * @extends Node
 */
class Rectangle extends Node {
    /**
     * 创建矩形节点.
     * @param {Configs} configs - 配置
     * @param {number} configs.width - 宽
     * @param {number} configs.height - 高
     * @param {number} configs.borderRadius - 圆角矩形半径
     */
    constructor(configs = {}) {
        super(configs);
        this.type =             'Rectangle';
        this.width =            configs.width || 10;
        this.height =           configs.height || 10;
        this.borderRadius =     configs.borderRadius || 0;
    }

    render(ctx) {
        ctx.save();
        if(this._isMoving){
            ctx.globalAlpha = 0.5;
        }
        ctx.beginPath();
        const {
            borderRadius: radius, anchor, width, height
        } = this;
        if(this.borderRadius) {
            const x = this.anchor[0] - this.width / 2;
            const y = this.anchor[1] - this.height / 2;
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
            ctx.rect(this.anchor[0] - this.width / 2, this.anchor[1] - this.height / 2, this.width, this.height);
        }
            
        if(this.borderWidth && this.borderColor){
            ctx.strokeStyle = this.borderColor;
            ctx.lineWidth = this.borderWidth
            ctx.stroke();
        }
        if(this.shadowColor) {
            ctx.shadowColor = this.shadowColor;
            ctx.shadowBlur = this.shadowBlur;
            ctx.shadowOffsetX = this.shadowOffsetX;
            ctx.shadowOffsetY = this.shadowOffsetY;
        }
        ctx.fillStyle = this.color;
        ctx.fill(); 
        // if(this.content) {
        //     ctx.font = this.font;
        //     ctx.textAlign = this.textAlign;
        //     ctx.textBaseline = this.textBaseline;
        //     ctx.fillStyle = this.textColor;
        //     ctx.fillText(this.content, this.anchor[0], this.anchor[1]);
        // } 
       
        // if(this._isTargeting) {
        //     this.renderFocus(ctx);
        // }

        ctx.restore();
    }

    isHit(point) {
        const anchor = this.anchor;
        const w = this.width /2;
        const h = this.height/2;
        return point[0] > anchor[0] - w 
            && point[0] < anchor[0] + w 
            && point[1] > anchor[1] - h 
            && point[1] < anchor[1] + h;
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
            [ltx, lty],
            [rbx, lty],
            [rbx, rby],
            [ltx, rby],
        ]
    }

    getBoundingDimension() {
        return {
            height: this.height,
            width: this.width,
        }
    }

    calculateIntersection(point) {
        const [x1, y1] = point;
        const [x2, y2] = this.anchor;
        const w = this.width/2;
        const h = this.height/2;
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
        }
    }
  
    calculateIntersectionInFourDimension(point, end) {
        const [x1, y1] = point;
        let p2 = this.anchor;
        if(this._belongs && this._belongs.calculateToCoordination) {
            p2 = this._belongs.calculateToCoordination(p2);
        }
        
        const [x2, y2] = p2;
        const w = this.width/2;
        const h = this.height/2;
        const allIntersections = {
            [DIRECTION.RIGHT]:  [x2+w, y2],
            [DIRECTION.LEFT]:   [x2-w, y2],
            [DIRECTION.BOTTOM]: [x2, y2+h],
            [DIRECTION.TOP]:    [x2, y2-h],
        }
        const vecx = x2 - x1;
        const vecy = y2 - y1;
        const theta1 = h/w;
        const theta2 = Math.abs(vecy/vecx);
        const dirx = x1 > x2;
        const diry = y1 > y2;
        let interDir = (theta2 > theta1 
            ? (diry ? DIRECTION.BOTTOM : DIRECTION.TOP) 
            : (dirx ? DIRECTION.RIGHT : DIRECTION.LEFT));

        if(this._belongs && this._belongs.calculateToCoordination) {
            console.log(JSON.stringify(this._intersections));
            console.log(interDir)
        }
        // interDir = this.checkLinked(interDir, end);
        if(this._belongs && this._belongs.calculateToCoordination) {
            console.log(interDir)
        }
        
        // if(!interDir) {
        //     debugger
        // }
        // let endDir = interDir;
        // if(end === 'to') {
        //     endDir = oppositeDirection(endDir)
        // }
        return {
            p: allIntersections[interDir],
            dir: interDir,
        }
    }
}

export default Rectangle;