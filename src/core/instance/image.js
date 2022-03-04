import Rectangle from './shapes/rectangle';
import StackMixin from './stackMixin';
import LayoutMixin from './layoutMixin';
import { bounding_box } from '../utils/functions';
import { DIRECTION } from '../utils/constance';

/**
 * 图片单元 配置
 * @typedef {Rectangle~RectangleConfigs} Icon~IconConfigs
 * @property {number} image   - 图片地址
 * @property {number} imageWidth   - 图片宽度
 * @property {number} imageHeight   - 图片高度
 */

/**
 * 图片单元
 * @description 图片单元可以绘制图片，图片加载后会自动重新绘制
 * @constructor Icon
 * @extends Rectangle
 * @param {Icon~IconConfigs} configs - 配置
 */
class Icon extends Rectangle {
    constructor(configs) {
        super(configs)
        this.image = configs.image;
        this.image.onload = () => {
            requestAnimationFrame(() => {
                this._jflow._render();
            })
        }
        this.imageBounding = {
            width: configs.imageWidth || configs.width,
            height: configs.imageHeight ||  configs.height,
        }
    }

    setConfig(configs) {
        Object.keys(configs).forEach(k => {
            if(configs[k] !== undefined && configs[k] !== null) {
                this[k] = configs[k];
                this._rawConfigs[k] = configs[k];
            }
        });
        if(configs.image && !configs.image.complete) {
            this.image.onload = () => {
                requestAnimationFrame(() => {
                    this._jflow._render();
                })
            }
        }
        this.imageBounding = {
            width: configs.imageWidth || configs.width || this.imageBounding.width,
            height: configs.imageHeight ||  configs.height || this.imageBounding.height,
        }
    }

    render(ctx) {
        ctx.save();
        if(this._isMoving){
            ctx.globalAlpha = 0.6
        }
        Rectangle.prototype.render.call(this, ctx);
        const x = this.anchor[0] - this.width / 2;
        const y = this.anchor[1] - this.height / 2;
        if(this.image.complete) {
            ctx.drawImage(this.image, x, y, this.imageBounding.width, this.imageBounding.height);
        }
        ctx.restore();
    }
}
export default Icon;