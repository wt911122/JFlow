import Node from '../node';
import { DIRECTION, oppositeDirection } from '../../utils/constance';
/**
 * @typedef Rectangle~border
 * @type {object}
 * @property {number} borderColor      - 边框宽度, 默认 0
 * @property {number} borderWidth      - 边框颜色, 默认 transparent
 */
/**
 * @typedef Rectangle~borders
 * @type {object}
 * @property {Rectangle~border} top      - 上边框
 * @property {Rectangle~border} right      - 右边框
 * @property {Rectangle~border} bottom      - 下边框
 * @property {Rectangle~border} left      - 左边框
 */

/**
 * 矩形单元 配置
 * @typedef {Node~Configs} Rectangle~RectangleConfigs
 * @property {number} width - 宽
 * @property {number} height - 高
 * @property {number} borderRadius - 圆角矩形半径
 * @property {string} borderColor - 边框颜色, 默认 transparent
 * @property {string} borderWidth - 边框宽度, 默认 0
 * @property {Rectangle~borders} border      - 边框设置
 */
/**
 * 矩形单元
 * @constructor Rectangle
 * @extends Node
 * @param {Rectangle~RectangleConfigs} configs
 */
class Rectangle extends Node {
    constructor(configs = {}) {
        super(configs);
        this.type =             'Rectangle';
         /** @member {Number}      - 宽 */
        this.width =            configs.width || 10;
         /** @member {Number}      - 高 */
        this.height =           configs.height || 10;
         /** @member {Number}      - 圆角矩形半径 */
        this.borderRadius =     configs.borderRadius || 0;
        this._setBorder(configs);
    }

    _setBorder(configs){
        /** @member {Rectangle~borders}      - 边框设置，优先级高于 borderWidth，borderColor */
        this.border = {
            top: {
                color: configs.border?.top?.borderColor || configs.borderColor || 'transparent',
                width: configs.border?.top?.borderWidth || configs.borderWidth || 0,
                enable: configs.border?.top?.borderWidth,
            },
            right: {
                color: configs.border?.right?.borderColor || configs.borderColor || 'transparent',
                width: configs.border?.right?.borderWidth || configs.borderWidth || 0,
                enable: configs.border?.right?.borderWidth,
            },
            bottom: {
                color: configs.border?.bottom?.borderColor || configs.borderColor || 'transparent',
                width: configs.border?.bottom?.borderWidth || configs.borderWidth || 0,
                enable: configs.border?.bottom?.borderWidth,
            },
            left: {
                color: configs.border?.left?.borderColor || configs.borderColor || 'transparent',
                width: configs.border?.left?.borderWidth || configs.borderWidth || 0,
                enable: configs.border?.left?.borderWidth,
            }
        };
        this.borderColor = configs.borderColor || 'transparent';
        this.borderWidth = configs.borderWidth || 0;
    }

    setConfig(configs) {
        Object.keys(configs).forEach(k => {
            if(configs[k] !== undefined && configs[k] !== null) {
                this[k] = configs[k];
                this._rawConfigs[k] = configs[k];
            }
        });
        this._setBorder(configs);
    }

    render(ctx) {
        ctx.save();
        if(this._isMoving){
            ctx.globalAlpha = 0.6
        }

        const {
            borderRadius: radius, anchor, width, height
        } = this;
        const x = this.anchor[0] - this.width / 2;
        const y = this.anchor[1] - this.height / 2;
        const xt = this.anchor[0] + this.width / 2;
        const yt = this.anchor[1] + this.height / 2;
        if(this.borderRadius) {
            ctx.beginPath();
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
            ctx.beginPath();
            ctx.rect(this.anchor[0] - this.width / 2, this.anchor[1] - this.height / 2, this.width, this.height);
        }
        if(this.borderWidth) {
            ctx.lineWidth = this.borderWidth;
            ctx.strokeStyle = this.borderColor;
        }
        
        if(this.shadowColor && this.shadowColor !== 'transparent') {
            ctx.shadowColor = this.shadowColor;
            const scale = this._jflow.scale;
            ctx.shadowBlur = this.shadowBlur * scale;
            ctx.shadowOffsetX = this.shadowOffsetX * scale;
            ctx.shadowOffsetY = this.shadowOffsetY * scale;
            let switchPath = new Path2D();
            if(this.borderRadius) {
                switchPath.moveTo(x + radius, y);
                switchPath.lineTo(x + width - radius, y);
                switchPath.quadraticCurveTo(x + width, y, x + width, y + radius);
                switchPath.lineTo(x + width, y + height - radius);
                switchPath.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                switchPath.lineTo(x + radius, y + height);
                switchPath.quadraticCurveTo(x, y + height, x, y + height - radius);
                switchPath.lineTo(x, y + radius);
                switchPath.quadraticCurveTo(x, y, x + radius, y);
                switchPath.closePath();
            } else {
                switchPath.rect(this.anchor[0] - this.width / 2, this.anchor[1] - this.height / 2, this.width, this.height);
            }
            switchPath.rect(x - 10, y - 10, this.width+ 20, this.height+ 20);
            ctx.save();
            ctx.clip(switchPath, "evenodd");
            ctx.stroke();
            ctx.restore();
        }  
        ctx.fillStyle = this.backgroundColor;
        ctx.fill();
        if(this.borderRadius && this.borderWidth) {
            ctx.shadowColor = 'transparent'
            ctx.stroke();
        }
        
        if(this.borderRadius) {
            if(this.border.top.enable) {
                const ty = y - this.border.top.width / 2;
                // console.log(this.border.top.width)
                ctx.beginPath();
                let topPath = new Path2D();
                topPath.moveTo(x, ty + radius);
                topPath.quadraticCurveTo(x, ty, x + radius, ty);
                topPath.lineTo(x + width - radius, ty);
                topPath.quadraticCurveTo(x + width, ty, x + width, ty + radius);
                topPath.closePath();
                ctx.clip(topPath);             
                ctx.save();
                ctx.shadowColor = 'transparent';
                ctx.fillStyle = this.border.top.color;
                ctx.rect(x, ty, this.width, this.border.top.width);
                ctx.fill();
                ctx.restore();

                // ctx.stroke();
                // ctx.save();
                // ctx.beginPath();
                // ctx.moveTo(x, ty + radius);
                // ctx.quadraticCurveTo(x, ty, x + radius, ty);
                // ctx.lineTo(x + width - radius, ty);
                // ctx.quadraticCurveTo(x + width, ty, x + width, ty + radius);
                // ctx.closePath();

                // // ctx.fill();
                // ctx.clip();

                // ctx.beginPath();
                // ctx.rect(x, ty, this.width, this.border.top.width);
                // ctx.fillStyle = this.border.top.color;
                // ctx.shadowColor = 'transparent';
                // ctx.fill();
                // ctx.restore();
            }
        } else {
            if(this.border.top.width) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(xt, y);
                ctx.strokeStyle = this.border.top.color;
                ctx.lineWidth = this.border.top.width;
                ctx.stroke();
            }

            if(this.border.right.width) {
                ctx.beginPath();
                ctx.moveTo(xt, y);
                ctx.lineTo(xt, yt);
                ctx.strokeStyle = this.border.right.color;
                ctx.lineWidth = this.border.right.width;
                ctx.stroke();
            }

            if(this.border.bottom.width) {
                ctx.beginPath();
                ctx.moveTo(xt, yt);
                ctx.lineTo(x, yt);
                ctx.strokeStyle = this.border.bottom.color;
                ctx.lineWidth = this.border.bottom.width;
                ctx.stroke();
            }

            if(this.border.left.width) {
                ctx.beginPath();
                ctx.moveTo(x, yt);
                ctx.lineTo(x, y);
                ctx.strokeStyle = this.border.left.color;
                ctx.lineWidth = this.border.left.width;
                ctx.stroke();
            }
        }
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
        const br = this._boundingrect;
        br[0] = ltx;
        br[1] = lty;
        br[2] = rbx;
        br[3] = rby;
        return br
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

        // if(this._belongs && this._belongs.calculateToCoordination) {
        //     console.log(JSON.stringify(this._intersections));
        //     console.log(interDir)
        // }
        // interDir = this.checkLinked(interDir, end);
        // if(this._belongs && this._belongs.calculateToCoordination) {
        //     console.log(interDir)
        // }

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