import Rectangle from './shapes/rectangle';
// import { doOverlap } from '../utils/functions';
class ShadowDom extends Rectangle {
    constructor(configs) {
        super(configs);
        this.domFactory = configs.createDocument;
        this._dom = null;
    }

    getRealWorldPosition() {
        const b = this.getBoundingRect();
        return this.calculateToRealWorld(b.slice(0, 2));
    }

    render(ctx) {
        if(!this._dom && this.domFactory) {
            requestAnimationFrame(() => {
                if(!this._dom) {
                    const container = document.createElement('div');
                    const pos = this.getRealWorldPosition();
                    const scale = this._jflow.scale;
                    container.setAttribute('style', `
                        position: absolute;
                        width: ${this.width}px;
                        height: ${this.height}px;
                        transform-origin: left top;
                        top: 0;
                        left: 0;
                        transform: translate(${pos[0]}px, ${pos[1]}px) scale(${scale});`);
                    this._dom = container;
                    this._jflow.DOMwrapper.appendChild(container);
                    this.domFactory(container);
                }
            });
        } else {
            const pos = this.getRealWorldPosition();
            const scale = this._jflow.scale;
            this._dom.style.transform = `translate(${pos[0]}px, ${pos[1]}px) scale(${scale})`
        }
        super.render(ctx)
    }    

    onEnterViewbox() {
        if(this._dom) {
            this._dom.style.display = 'block';
        }
    }

    onLeaveViewbox(){
        if(this._dom) {
            this._dom.style.display = 'none';
        }
    }

    destroy() {
        
        if(this._dom) {
            this._jflow.DOMwrapper.removeChild(this._dom);
        }
        super.destroy();
    }
}
export default ShadowDom;
