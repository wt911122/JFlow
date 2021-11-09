import Rectangle from './rectangle';
import StackMixin from './stackMixin';
import LayoutMixin from './layoutMixin';
import { bounding_box } from '../utils/functions';
import { DIRECTION } from '../utils/constance';

class Icon extends Rectangle {
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