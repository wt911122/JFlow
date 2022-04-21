import Capsule from './capsule';
/**
 * 垂直胶囊单元
 * @constructor CapsuleVertical
 * @extends Capsule
 * @param {Capsule~CapsuleConfigs} configs - 配置
 */
class CapsuleVertical extends Capsule {
    render(ctx) {
        ctx.save();
        if(this._isMoving){
            ctx.globalAlpha = 0.6
        }
        ctx.beginPath();
        const [x, y] = this.anchor;
        const hw = this.width/2;
        const hh = this.height/2;
        const topCenter = y - hh + hw;
        const bottomCenter = y + hh - hw;
        const left = x - hw;
        const right = x + hw;

        ctx.moveTo(left, topCenter);
        ctx.arc(x, topCenter, hw, -Math.PI, 0);
        ctx.lineTo(right, bottomCenter);
        ctx.arc(x, bottomCenter, hw, 0, Math.PI);
        ctx.closePath();

        ctx.fillStyle = this.backgroundColor;
        if (this.shadowColor) {
            ctx.shadowColor = this.shadowColor;
            ctx.shadowBlur = this.shadowBlur;
            ctx.shadowOffsetX = this.shadowOffsetX;
            ctx.shadowOffsetY = this.shadowOffsetY;
        }
        ctx.fill();
        if(this.borderWidth) {
            ctx.lineWidth = this.borderWidth;
            ctx.strokeStyle = this.borderColor;
            ctx.stroke();
        }
        // ctx.fillStyle = 'rgba(0,0,0,0.3)';
        // ctx.fillRect(x-hw, y-hh, this.width, this.height)

        ctx.restore();
    }

    isHit(point, condition) {
        const [x, y] = this.anchor;
        const hw = this.width/2;
        const hh = this.height/2;
        const yy =  Math.abs(hh - hw);
        const topCenter = y - hh + hw;
        const bottomCenter = y + hh - hw;
        const rr = hw * hw;
        return (point[0] > x - hw
            && point[0] < x + hw
            && point[1] > y - yy
            && point[1] < y + yy)
            || ( Math.pow(point[0] - x, 2) + Math.pow(point[1] - topCenter, 2) < rr)
            || ( Math.pow(point[0] - x, 2) + Math.pow(point[1] - bottomCenter, 2) < rr)
    }
}
export default CapsuleVertical;