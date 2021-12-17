import Rectangle from './rectangle';
import StackMixin from './stackMixin';
import LayoutMixin from './layoutMixin';
import { bounding_box } from '../utils/functions';
import { DIRECTION } from '../utils/constance';

/**
 * 图片单元
 * @description 图片单元可以绘制图片，图片加载后会自动重新绘制
 * @extends Rectangle
 */
class Icon extends Rectangle {
      /**
        * 创建一个图片单元
        * @param {Configs} configs - 配置
        * @param {number} configs.image   - 图片地址
        * @param {number} configs.imageWidth   - 图片宽度
        * @param {number} configs.imageHeight   - 图片高度
        **/
    constructor(configs) {
        super(configs)
        this.borderWidth = 0;
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

    render(ctx) {
        ctx.save();
        if(this._isMoving){
            ctx.globalAlpha = 0.5;
        }
        Rectangle.prototype.render.call(this, ctx);
        const x = this.anchor[0] - this.width / 2;
        const y = this.anchor[1] - this.height / 2;
        ctx.drawImage(this.image, x, y, this.imageBounding.width, this.imageBounding.height);
        ctx.restore();
    }
}
export default Icon;