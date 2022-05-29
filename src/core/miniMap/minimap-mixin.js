import { createCanvas } from '../utils/canvas';
export default {
    // 传入一个别的 context2d 来绘制
    captureMap(wrapper, padding = 0) {

        this._getBoundingGroupRect();
        const { 
            width: p_width, 
            height: p_height, 
            x: p_x, 
            y: p_y 
        } = this.bounding_box;
        let miniMap = this.miniMap;
        if(!miniMap) {
            this.miniMap = createCanvas(wrapper);
            const {
                width, height,
                raw_width,
                raw_height,
            } = this.miniMap;
            this.addEventListener('zoompan', () => {
                this._renderMap && this._renderMap();
            })
            let pressDown = false;
            this.miniMap.canvas.addEventListener('pointerdown', (event) => {
                let { offsetX, offsetY, deltaX, deltaY } = event
                pressDown = true;
                this._onMoveMap && this._onMoveMap(offsetX, offsetY)  
            })
            this.miniMap.canvas.addEventListener('pointermove', (event) => {
                let { offsetX, offsetY, deltaX, deltaY } = event
                if(pressDown) {
                    this._onMoveMap && this._onMoveMap(offsetX, offsetY)
                }
                if(offsetY < 5 || offsetX < 5 || offsetX > width-5 || offsetY > height-5) {
                    pressDown = false;
                }
            })
            this.miniMap.canvas.addEventListener('pointerup', () => {
                pressDown = false;
            })

            const caheCanvas = document.createElement('canvas');
            caheCanvas.width = raw_width;
            caheCanvas.height = raw_height;
            this.cacheMinimapCtx = caheCanvas.getContext('2d');
        }
        const { 
            width,
            height,
            raw_width,
            raw_height,
            left,
            top,
            scale,
            ctx
        } = this.miniMap
        const pad2 = padding * 2;
        const pad = padding;
        const r1 = (width - pad2) / p_width;
        const r2 = (height - pad2) / p_height;
        const r = Math.min(r1, r2);
        let m_x = 0;
        let m_y = 0;
        if(r1 < r2) {
            m_y = (height - p_height * r + pad) / 2;
            m_x = pad;
        } else {
            m_x = (width - p_width * r + pad) / 2;
            m_y = pad;
        }
        const cachectx = this.cacheMinimapCtx;
        cachectx.setTransform();
        cachectx.clearRect(0, 0, raw_width, raw_height);
        cachectx.scale(scale, scale);
        cachectx.transform(r, 0, 0, r, m_x, m_y);
        // ctx.fillStyle = 'red';
        // ctx.arc( 30, 30, 100, 0, 2*Math.PI);
        // ctx.fill()
        // debugger
        if(this.NodeRenderTop) {
            this._linkStack.render(cachectx);
            this._stack.render(cachectx);
        } else {
            this._stack.render(cachectx);
            this._linkStack.render(cachectx);
        }
        const _cacheMapImageData = cachectx.getImageData(0, 0,raw_width, raw_height);
        this._renderMap = () => {
            ctx.save();
            ctx.setTransform();
            ctx.clearRect(0, 0, raw_width, raw_height);
            // if(!i) {
            ctx.scale(scale, scale);
            ctx.putImageData(_cacheMapImageData, 0, 0);
            ctx.transform(r, 0, 0, r, m_x, m_y);
            const [x, y, t, d] = this._getViewBox();
            ctx.beginPath();
            ctx.rect(x, y,  t-x, d-y);
            ctx.setTransform();
            ctx.rect(0, 0, raw_width, raw_height);
            ctx.clip("evenodd");
            
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.fillRect(0, 0, raw_width, raw_height);
            ctx.restore();
            // }
        }
        this._renderMap();

        this._onMoveMap = (offsetX, offsetY) => {
            const [x, y, t, d] = this._getViewBox();
            // const w = t-x;
            const a = (t-x)/2 + x;
            const b = (d-y)/2 + y;
            
            const p = [a * r + m_x, b * r + m_y]
            this._recalculatePosition((p[0] - offsetX)/ r * this.scale, (p[1] - offsetY)/ r * this.scale);
            this._render();
            this._renderMap();
        }
        // this._render(ctx);
    }


}