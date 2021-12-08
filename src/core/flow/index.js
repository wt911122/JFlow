import { createCanvas } from '../utils/canvas';
import { bounding_box } from '../utils/functions';
import StackMixin from '../instance/stackMixin';
import InstanceStack from '../instance/stack';
import LayoutMixin from '../instance/layoutMixin';
import MessageMixin from '../instance/messageMixin';
import { setUniqueId, getUniqueId } from '../utils/functions';
import Point from '../instance/point';
import JFlowEvent from '../events';


class JFlow extends EventTarget{
    constructor(configs) {
        super();
        this.uniqueName = 'jflow';
        this.initStack(configs);
        this.initLayout(configs);
        this.plugins = [];
        this.ctx = null;
        this.canvas = null;
        this.dpr = 1;
        this.padding = 20;
        /**
            for zoom and pinch
         */
        this.position = null;
		this.scale = null;
        this.maxZoom = 3;
        this.minZoom = .5
		// this.initScale = 1;
		// this.initPosition = null
		this.offeset = null;
        this._lastState = {
            x: null,
            y: null,
            dragging: false,
            processing: false
        };
        this._lastDragState = {
            target: null,
            targetLink: null,
            processing: false,
        }

        this._target = {
            instance: null,
            link: null,
            moving: null,
            isInstanceDirty: false, 
            isLinkDirty: false, 
            isMovingDirty: false, 
            cache: {
                stack: null,
                belongs: null,
                point: null,
            },
            meta: {
                x: undefined,
                y: undefined,
                initialX: undefined,
                initialY: undefined, 
            },
            status: {
                dragovering: false,
                dragging: false,
                processing: false,
            }
        }

        /**
            for focus
         */
        this._lastFocus = {
            instance: null,
            processing: false,
        }

        this.allowDrop = configs.allowDrop;
    }

    use(plugin) {
        this.plugins.push(plugin)
    }

    $mount(dom) {
        const { 
            canvas, 
            ctx, 
            scale: dpr, 
            width: c_width, 
            height: c_height, 
            raw_width,
            raw_height,
            left, top 
        } = createCanvas(dom);
        this.reflow();
        this.ctx = ctx;
        this.canvas = canvas;
        this.canvasMeta = {
            width: raw_width,
            height: raw_height,
        }
        this.dpr = dpr;
        this._createEventHandler();
        this._getBoundingGroupRect();

        const padding = this.padding;
        const { width: p_width, height: p_height, x, y } = this.bounding_box;
       
        const contentBox = {
            x: padding,
            y: padding,
            width: c_width - padding * 2,
            height: c_height - padding * 2,
        }
        const position = { x: 0, y: 0, offsetX: 0, offsetY: 0 };
        const w_ratio = contentBox.width / p_width;
        const h_ratio = contentBox.height / p_height;
        const align = w_ratio <= h_ratio ? 'x' : 'y';
        const scaleRatio = Math.min(w_ratio, h_ratio);
        this.scale = scaleRatio;
        if(scaleRatio > this.maxZoom) {
            this.maxZoom = scaleRatio;
        }
        if(scaleRatio < this.minZoom) {
            this.minZoom = scaleRatio;
        }
        // this.initScale = scaleRatio;
        position.x = align === 'x' ? contentBox.x : (contentBox.width - p_width * scaleRatio) / 2 + padding
        position.y = align === 'y' ? contentBox.y : (contentBox.height - p_height * scaleRatio) / 2 + padding
        position.offsetX = position.x - x * scaleRatio;
        position.offsetY = position.y - y * scaleRatio;
        this.position = position;
        this._render();
    }
    
    _getBoundingGroupRect() {
        const points = this._stack.getBoundingRectPoints();
        this.bounding_box = bounding_box(points);
    }

    $setFocus(instance) {
        if(this._lastFocus.processing) return;
        this._lastFocus.processing = true;
        if(this._lastFocus.instance){
            this._lastFocus.instance.status.focus = false;
        }
        
        this._lastFocus.instance = instance;
        if(instance) {
            instance.status.focus = true;
            instance.bubbleEvent(new JFlowEvent('focus'))
        }

        requestAnimationFrame(() => {
            this._render();
            this._lastFocus.processing = false;
        })

    }

    _createEventHandler() { 
        const canvas = this.canvas;
        const zoomHandler = this._onZoom.bind(this);
        const pressStartHandler = this._onPressStart.bind(this);
        const pressMoveHandler = this._onPressMove.bind(this);
        const pressUpHandler = this._onPressUp.bind(this);
        const pressUpDocument = this._onPressUpDocument.bind(this);
        canvas.addEventListener('wheel', zoomHandler );
        canvas.addEventListener('contextmenu', e => {
            e.preventDefault();
        });
        canvas.addEventListener('pointerdown', pressStartHandler );
        canvas.addEventListener('pointermove', pressMoveHandler );
        canvas.addEventListener('pointerup', pressUpHandler );
        document.addEventListener('pointerup', pressUpDocument);
        let destroyListener;
        const destroyPlainEventListener = () => {
            canvas.removeEventListener('wheel', zoomHandler );
            canvas.removeEventListener('pointerdown', pressStartHandler );
            canvas.removeEventListener('pointermove', pressMoveHandler );
            canvas.removeEventListener('pointerup', pressUpHandler );
            document.removeEventListener('pointerup', pressUpDocument);
        }
        destroyListener = destroyPlainEventListener;

        if(this.allowDrop) {
            const dragoverHandler = this._onDragover.bind(this);
            const dropHandler = this._onDrop.bind(this);
            canvas.addEventListener('dragover', dragoverHandler);
            canvas.addEventListener('drop', dropHandler);
            destroyListener = () => {
                destroyPlainEventListener();
                canvas.removeEventListener('dragover', dragoverHandler);
                canvas.removeEventListener('drop', dropHandler);
            }
        } 
        this.destroy = destroyListener;
    }

    _targetLockOn(offsetPoint) {
        let point = this._calculatePointBack(offsetPoint);
        this._currentp = point;
        let stack = this._stack;
        const target = stack.checkHit(point, (instance) => {
            return this._target.status.dragging && (instance === this._target.moving)
        });
        let linkStack = this._linkStack;
        let belongs = this;
        if(target) {
            linkStack = target._belongs._linkStack;
            point = target._belongs._currentp;
            stack = target._belongs._stack;
            belongs = target._belongs
        }
        const targetLink = linkStack.checkHit(point);

        Object.assign(this._target, {
            instance: target,
            link: targetLink, 
            isInstanceDirty: target === this._target.instance,
            isLinkDirty: targetLink === this._target.link,
        });
        Object.assign(this._target.cache, {
            stack,
            belongs,
            point,
        })
        Object.assign(this._target.meta, {
            x: offsetPoint[0],
            y: offsetPoint[1],
        });

        if(!this._target.status.dragging && !this._target.status.dragovering) {
            let movingtarget = target;
            while (movingtarget && movingtarget._belongs.lock && movingtarget !== this) {
                movingtarget = movingtarget._belongs;
            }
            if(movingtarget === this) {
                movingtarget = target;
            }
            Object.assign(this._target, {
                moving: movingtarget,
                isMovingDirty: movingtarget === this._target.moving,
            })
        }
        return this._target;
    }

    _onDragover(event) {
        event.preventDefault();
        if(this._lastDragState.processing) return;
        this._lastDragState.processing = true;
        const { offsetX, offsetY } = event
        Object.assign(this._target.status, {
            dragovering: true,
        })
        this._targetLockOn([offsetX, offsetY])
        
        if(this._target.isLinkDirty || this._target.isInstanceDirty) {
            requestAnimationFrame(() => {
                this._render();    
                this._target.isLinkDirty = false; 
                this._target.isInstanceDirty = false;
                this._lastDragState.processing = false;
            })
        } else {
            this._lastDragState.processing = false;
        } 
    }

    _onDrop(event) {
        const { offsetX, offsetY, clientX, clientY } = event
        const payload = this.consumeMessage();
        const instance = payload.instance;

        const {
            link,
            instance: target,
        } = this._target;
        const {
            point, belongs
        } = this._target.cache;
        if(link) {   
            // 丢在线上
            instance.anchor = point;
            link.dispatchEvent(new JFlowEvent('drop', {
                event,
                instance,
                link,
                jflow: this,
                belongs,
                point
            }))
            // belongs.addInstanceToLink(link, instance)
        } else if(target) {
            // 丢在 instance 上
            target.bubbleEvent(new JFlowEvent('drop', {
                event,
                instance,
                jflow: this,
                target,
                point
            }))
        } else {
            // 丢在主图上
            // instance.anchor = point;
            // this.addToStack(instance);
            this.dispatchEvent(new JFlowEvent('drop', {
                event,
                instance,
                jflow: this,
                target,
                point,
                // reflowCallback: (jflowinstance) => {
                //     instance.anchor = point;
                //     this.recalculate();
                //     this.reflow();
                // }
            }))
        }
        
        requestAnimationFrame(() => {
            // this.recalculate();
            this._target.instance = null;
            this._target.link = null;
            Object.assign(this._target.status, {
               dragovering: false,
            })
            // this._render();
        })
    }

    _onZoom(event) {
        if(this._zooming) return;
        this._zooming = true;
        const { offsetX, offsetY, deltaY } = event
        const { width: p_width, height: p_height, x, y } = this.bounding_box;
        let newScale = this.scale;
        const amount = deltaY > 0 ? 1.1 : 1 / 1.1;
        newScale *= amount;

        if (this.maxZoom && newScale > this.maxZoom){
            // could just return but then won't stop exactly at maxZoom
            newScale = this.maxZoom;
        }

        if(this.minZoom && newScale < this.minZoom) {
            newScale = this.minZoom;
        }

        var deltaScale    = newScale - this.scale;
        var currentWidth  = p_width * this.scale;
        var currentHeight = p_height * this.scale;
        var deltaWidth    = p_width * deltaScale;
        var deltaHeight   = p_height * deltaScale;

        var tX = offsetX - this.position.x;
        var tY = offsetY - this.position.y;
        var pX = -tX / currentWidth;
        var pY = -tY / currentHeight;

        this.scale = newScale;
        this.position.x += pX * deltaWidth;
		this.position.y += pY * deltaHeight;
        this.position.offsetX = this.position.x; // - x * newScale;
        this.position.offsetY = this.position.y; // - y * newScale;
        requestAnimationFrame(() => {
            this._render();
            this._zooming = false;
        })
    }

    _onPressStart(event) { 
        const { offsetX, offsetY, deltaY, buttons } = event
        if(buttons !== 1) return;
        this._targetLockOn([offsetX, offsetY]);
        Object.assign(this._target.meta, {
            initialX: offsetX,
            initialY: offsetY,
        })
        Object.assign(this._target.status, {
            dragging: true,
            processing: false,
        });
        if(this._target.moving) {
            this._target.moving.dispatchEvent(new JFlowEvent('pressStart', {
                event,
                instance: this._target.moving,
                jflow: this,
            }))
        }
    }

    _onPressMove(event) {
        console.log('_onPressMove')
        const {
            dragging, processing
        } = this._target.status;
        const { x, y } = this._target.meta;

        const { offsetX, offsetY, clientX, clientY } = event
        if(!dragging && !processing) {
            const {
                link,
                instance
            } = this._targetLockOn([offsetX, offsetY]);
            if(instance || link) {
                this.canvas.style.cursor = 'move';
            } else {
                this.canvas.style.cursor = 'default';
            }
        }
        if(!dragging) return;
        if(processing) return;
        
        const movingtarget = this._target.moving;

        this._target.status.processing = true;
        const deltaX = offsetX - x;
        const deltaY = offsetY - y;

        if(movingtarget) {
            movingtarget.anchor[0] += deltaX / this.scale;
            movingtarget.anchor[1] += deltaY / this.scale;
        } else {
            this._recalculatePosition(deltaX, deltaY);    
        }
        this._targetLockOn([offsetX, offsetY])

        // this._target.meta.x = offsetX;
        // this._target.meta.y = offsetY;
        
        requestAnimationFrame(() => {
            this._render();
            this._target.isLinkDirty = false; 
            this._target.isInstanceDirty = false;
            this._target.status.processing = false;
        })
        
    }

    _onPressUp(event, isDocument) {
        console.log('_onPressUp')
        const meta = this._target.meta;
        if(meta.initialX === meta.x
            && meta.initialY === meta.y
            && this._target.instance && !isDocument) {
            const t = this._target.instance;
            t.bubbleEvent(new JFlowEvent('click', {
                event,
                target: t,
                jflow: this,
                bubbles: true,
            }))
            this._render();
        } else if(this._target.moving) {
            let checkresult = false;
            if(this._layout.static) {
                checkresult = this.staticCheck(this._target.moving);
            }

            if(!checkresult && this._target.link) {
                const {
                    point, belongs
                } = this._target.cache;
                const link = this._target.link;
                const instance = this._target.moving;
                // instance.anchor = point;
                // belongs.addInstanceToLink(this._target.link, instance);
                // belongs.dispatchEvent(new JFlowEvent('drop', {
                //     event,
                //     instance,
                //     link: ,
                //     jflow: this,
                //     target,
                // }))
                link.dispatchEvent(new JFlowEvent('drop', {
                    event,
                    instance,
                    link,
                    jflow: this,
                    belongs,
                    // reflowCallback: () => {
                    //     debugger
                    //     belongs.recalculate();
                    //     belongs.reflow();
                    //     this._render();
                    // }
                }));
                this._target.link = null;
                this._target.instance = null;
                // link.dispatchEvent(new JFlowEvent('dragover', {
                //     event,
                //     instance,
                //     link,
                //     jflow: this,
                //     belongs,
                // }))
                // this.recalculate();
            }
            if(this._target.moving) {
                if(this._target.instance) {
                    this._target.instance.bubbleEvent(new JFlowEvent('pressEnd', {
                        event,
                        instance: this._target.moving,
                        jflow: this,
                        target: this._target.instance,
                        bubbles: true
                    }));
                } else {
                    this.dispatchEvent(new JFlowEvent('pressEnd', {
                        event,
                        instance: this._target.moving,
                        jflow: this,
                    }))
                }
            }
            this._target.moving = null;
            this._target.isMovingDirty = false;
            this._render();
        }
        Object.assign(this._target.meta, {
            x: undefined,
            y: undefined,
            initialX: undefined,
            initialY: undefined, 
        })
        Object.assign(this._target.status, {
            dragging: false,
            processing: false,
        })
    }

    _onPressUpDocument(event) {
        this._onPressUp(event, true);
    }

    _onClick(event) {
        const { offsetX, offsetY } = event;
        const point = this._calculatePointBack([offsetX, offsetY]);
        const target = this._stack.checkHit(point);
        console.log(target)
    }

    _recalculatePosition(deltaX, deltaY, scale) {
        const { x, y } = this.bounding_box;
        if(scale === undefined) {
            scale = this.scale;
        }
        this.position.x += deltaX;
		this.position.y += deltaY;
        this.position.offsetX = this.position.x // - x * scale;
        this.position.offsetY = this.position.y // - y * scale;
    }

    calculateToRealWorld(p) {
        const scale = this.scale;
        const position = this.position;
        return [p[0] * scale + position.offsetX, p[1] * scale + position.offsetY]
    }

    _calculatePointBack(p) {
        const scale = this.scale;
        const position = this.position;
        return [(p[0] - position.offsetX)/scale, (p[1] - position.offsetY) / scale];
    }

    _calculateDistance(l) {
        const scale = this.scale;
        return scale * l;
    }

    _resetTransform() {
        const { width: c_width, height: c_height } = this.canvasMeta;
        const position = this.position;
        const scale = this.scale;
        const ctx = this.ctx;
        ctx.setTransform();
        ctx.clearRect(0, 0, c_width, c_height);
        ctx.scale(this.dpr, this.dpr);
        ctx.transform(scale, 0, 0, scale, position.offsetX, position.offsetY);
    }

    _render() {
        this._resetTransform();
        this._stack.forEach(instance => {
            instance._intersections = [];
        });
        let linkStack = this._linkStack;
        if(this._layout.alignLinkOrder) {
            const p = new InstanceStack();
            this._layout.alignLinkOrder(linkStack, p);
            linkStack = p;
        }
        linkStack.render(this.ctx);
        this._stack.render(this.ctx);
        
    }
}
Object.assign(JFlow.prototype, MessageMixin);
Object.assign(JFlow.prototype, StackMixin);
Object.assign(JFlow.prototype, LayoutMixin);

export default JFlow;
export { default as JFlowEvent } from '../events';
export { default as Point } from '../instance/point';
export { default as Rectangle } from '../instance/rectangle';
export { default as Group } from '../instance/group';
export { default as Text } from '../instance/text';
export { default as Icon } from '../instance/image';
export { default as Link } from '../instance/link';
export { default as PolylineLink } from '../instance/polyline-link';
export { default as BezierLink } from '../instance/bezier-link';
export { default as LinearLayout} from '../layout/linear-layout';
export { default as TreeLayout } from '../layout/tree-layout';
export { default as Lowcodelayout } from '../layout/low-code-layout';