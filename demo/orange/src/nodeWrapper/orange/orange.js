import StackMixin from './stackMixin';
import LayoutMixin from './layoutMixin';
import BezierDeck from './bezierDeck';
import LinearLayout from '../layout/linear-layout';

function Orange(jflowNodeConstructor) {
    class o extends Node {
        constructor(configs) {
            super(configs);
            this.initStack();
            this._layout = new LinearLayout({
                direction: 'horizontal',
                gap: 0,
            });
            this.lock = true;
            this.initOrange(configs);
        }

        initOrange(configs) {
            this._cargoNode = new jflowNodeConstructor(configs);            
            this._indeck = new BezierDeck({
                ...configs.deck,
                dir: 'in',
            });
            this._outdeck = new BezierDeck({
                ...configs.deck,
                dir: 'out',
            });
            this.addToStack(_indeck);
            this.addToStack(_cargoNode);
            this.addToStack(_outdeck);
            this._getBoundingGroupRect();
            this.reflow();
            this._getBoundingGroupRect();
        }

        setConfig(configs) {
            this._cargoNode.setConfig(configs);
            this._indeck.setConfig(configs.InDeck);
            this._outdeck.setConfig(configs.outDeck);
        },

        
        render(ctx) {
            ctx.save();
            if(this._isMoving){
                ctx.globalAlpha = 0.6
            }

            const [cx, cy] = this.anchor;
            ctx.translate(cx, cy);
            this._stack.render(ctx);
            ctx.translate(-cx, -cy);
            ctx.restore();
        }
    }
    Object.assign(t.prototype, StackMixin);
    Object.assign(t.prototype, LayoutMixin);

    return o;
}
export default Orange;

