import Node from '../node';

class ShadowCache extends Node {
    constructor(configs) {
        super(configs);
        // this.imageData = configs.imageData;
        this.width = configs.width;
        this.height = configs.height;
        this.imageBuffer = document.createElement('canvas');
        this.imageBuffer.width = this.width + 2;
        this.imageBuffer.height = this.height + 2;
        configs.cache(this.imageBuffer.getContext('2d'));
    }

    render(ctx) {
        const [cx, cy] = this.anchor;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.beginPath();
        ctx.drawImage(this.imageBuffer, -this.width/2, -this.height/2);
        ctx.translate(-cx, -cy);
        ctx.restore();
    }

    getBoundingDimension() {
        return {
            height: this.height,
            width: this.width,
        }
    }

    recalculate(){}
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
}


export default ShadowCache;