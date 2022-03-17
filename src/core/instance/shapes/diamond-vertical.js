import Diamond from './diamond';
const backsqrt3 = 1/Math.sqrt(3)

/**
 * 垂直钻石形单元
 * @constructor DiamondVertical
 * @param {Diamond~DiamondConfigs} configs - 配置
 * @extends Diamond
 */
class DiamondVertical extends Diamond {
    constructor(configs) {
        super(configs)
    }

    render(ctx) {
        ctx.save();
        if(this._isMoving){
            ctx.globalAlpha = 0.6
        }
        ctx.beginPath();
        const [x, y] = this.anchor;
        const hw = this.width/2;
        const hh = this.height/2;
        const yy = hw / 1.732

        const top = y - hh;
        const bottom = y + hh;
        const topmiddle = y - hh + yy;
        const bottommiddle = y + hh - yy;
        const xleft = x - hw;
        const xright = x + hw;

        ctx.moveTo(x, top);
        ctx.lineTo(xright, topmiddle);
        ctx.lineTo(xright, bottommiddle);
        ctx.lineTo(x, bottom);
        ctx.lineTo(xleft, bottommiddle);
        ctx.lineTo(xleft, topmiddle);
        ctx.closePath();
        ctx.fillStyle = this.backgroundColor;
        ctx.fill();
        if(this.borderWidth) {
            ctx.lineWidth = this.borderWidth;
            ctx.strokeStyle = this.borderColor;
            ctx.stroke();
        }

        ctx.restore();
        this._cachePoints = [
            [x, top],
            [xright, topmiddle],
            [xright, bottommiddle],
            [x, bottom],
            [xleft, bottommiddle],
            [xleft, topmiddle]
        ];
    }
}
export default DiamondVertical;