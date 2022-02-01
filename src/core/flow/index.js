import { createCanvas } from '../utils/canvas';
import { bounding_box } from '../utils/functions';
import StackMixin from '../instance/stackMixin';
import InstanceStack from '../instance/stack';
import LayoutMixin from '../instance/layoutMixin';
import MessageMixin from '../instance/messageMixin';
import { setUniqueId, getUniqueId } from '../utils/functions';
import JFlowEvent from '../events';
/**
 * @typedef JflowConfigs
 * @type {object}
 * @property {Boolean} allowDrop      - 是否允许 dragdrop
 * @property {Object} layout          - 布局对象
 */

/** 
 * JFlow 对象
 * JFlow 是 canvas 上面封装的一个顶层对象，具有处理事件和绘制的功能
 * @mixes LayoutMixin
 * @mixes StackMixin
 * @mixes MessageMixin
 */
class JFlow extends EventTarget{
    /**
     * 创建一个JFlow对象
     * @param {JflowConfigs} configs - 配置项
     */
    constructor(configs) {
        super();
        this.uniqueName = 'jflow';
        this.initStack(configs);
        this.initLayout(configs);
        /**
         * @property {Context2d} ctx        - Context2d 对象
         * @property {Element} canvas       - canvas 元素
         * @property {number} dpr           - 设备DPR
         * @property {number} padding       - 内边距
         */
        // TODO 引入 plugin 拓展
        // this.plugins = [];
        this.ctx = null;
        this.canvas = null;
        this.dpr = 1;
        this.padding = 20;
        /**
         * for zoom and pinch
         * @property {Context2d} position       - 平移位置
         * @property {Element} scale            - 当前缩放比
         * @property {number} maxZoom           - 最大缩放比
         * @property {number} minZoom           - 最小缩放比
         */
        this.position = null;
		this.scale = null;
        this.maxZoom = configs.maxZoom || 3;
        this.minZoom = configs.minZoom || .5;
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
            // isMovingDirty: false, 
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

        this._focus = {
            instance: null,
        }

        this._dragOverTarget = null;
        // this.lock = configs.lock;

        // this._belongs = 
        this.allowDrop = configs.allowDrop;
        this._tempInstance = null;
    }

    // use(plugin) {
    //     this.plugins.push(plugin)
    // }

    /**
     * 设置当前拖动的 JFlow 对象
     * @param {Instance} instance - JFlow 对象
     */
    setTempDraggingInstance(instance) {
        instance._belongs = this;
        this._tempInstance = instance;
        Object.assign(this._target, {
            moving: [this._tempInstance],
            dragging: true,
        })
        // this.addToStack(instance);
    }

    /**
     * 取消当前拖动的 JFlow 对象
     * @return {number[]} point - JFlow 坐标
     */
    removeTempDraggingInstance() {
        if(this._tempInstance) {
            // this.removeFromStack(this._tempInstance);
            const anchor = this._tempInstance.anchor;
            this._tempInstance = null;
            return anchor;
        }
    }
    /**
     * 在 Document 元素上初始化实例
     * @param {Element} dom 
     */
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
        this.DOMwrapper = dom;
        this.canvas = canvas;
        this.canvasMeta = {
            width: raw_width,
            height: raw_height,
            actual_width: c_width,
            actual_height: c_height
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
    // _resetPosition() {
    //     const padding = this.padding;
    //     const {
    //         c_width,
    //         c_height,
    //     } =  this.canvasMeta;
    //     const { width: p_width, height: p_height, x, y } = this.bounding_box;
    //     console.log(this.bounding_box)
    //     const contentBox = {
    //         x: padding,
    //         y: padding,
    //         width: c_width - padding * 2,
    //         height: c_height - padding * 2,
    //     }
    //     const position = { x: 0, y: 0, offsetX: 0, offsetY: 0 };
    //     const w_ratio = contentBox.width / p_width;
    //     const h_ratio = contentBox.height / p_height;
    //     const align = w_ratio <= h_ratio ? 'x' : 'y';
    //     const scaleRatio = Math.min(w_ratio, h_ratio);
    //     this.scale = scaleRatio;
    //     if(scaleRatio > this.maxZoom) {
    //         this.maxZoom = scaleRatio;
    //     }
    //     if(scaleRatio < this.minZoom) {
    //         this.minZoom = scaleRatio;
    //     }
    //     // this.initScale = scaleRatio;
    //     position.x = align === 'x' ? contentBox.x : (contentBox.width - p_width * scaleRatio) / 2 + padding
    //     position.y = align === 'y' ? contentBox.y : (contentBox.height - p_height * scaleRatio) / 2 + padding
    //     position.offsetX = position.x - x * scaleRatio;
    //     position.offsetY = position.y - y * scaleRatio;
    //     this.position = position;
    // }
    
    _getBoundingGroupRect() {
        const points = this._stack.getBoundingRectPoints();
        if(this.bounding_box) {
            this.bounding_box = bounding_box(points);
            const {
                x: nowx,
                y: nowy,
            } = this.bounding_box;
            const scale = this.scale;
            this.position.x = this.position.offsetX + nowx * scale;
            this.position.y = this.position.offsetY + nowy * scale;
        } else {
            this.bounding_box = bounding_box(points);
        }
    }

    // $setFocus(instance) {
    //     if(this._lastFocus.processing) return;
    //     this._lastFocus.processing = true;
    //     if(this._lastFocus.instance){
    //         this._lastFocus.instance.status.focus = false;
    //     }
        
    //     this._lastFocus.instance = instance;
    //     if(instance) {
    //         instance.status.focus = true;
    //         instance.bubbleEvent(new JFlowEvent('focus'))
    //     }

    //     requestAnimationFrame(() => {
    //         this._render();
    //         this._lastFocus.processing = false;
    //     })

    // }

    _createEventHandler() { 
        const canvas = this.canvas;
        const zoomHandler = this._onZoom.bind(this);
        const pressStartHandler = this._onPressStart.bind(this);
        const pressMoveHandler = this._onPressMove.bind(this);
        const pressUpHandler = this._onPressUp.bind(this);
        const pressUpDocument = this._onPressUpDocument.bind(this);
        const contextmenuHandler = this._onContextMenu.bind(this);
        canvas.addEventListener('wheel', zoomHandler );
        canvas.addEventListener('contextmenu', e => {
            e.preventDefault();
        });
        canvas.addEventListener('pointerdown', pressStartHandler );
        canvas.addEventListener('pointermove', pressMoveHandler );
        canvas.addEventListener('pointerup', pressUpHandler );
        canvas.addEventListener('contextmenu', contextmenuHandler)
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

    _targetLockOn(offsetPoint, event) {
        let point = this._calculatePointBack(offsetPoint);
        const topLayerPoint = point;
        this._currentp = point;
        let stack = this._stack;
        const target = stack.checkHit(point, (instance) => {
            return this._target.status.dragging && (instance === this._getMovingTarget())
        });
        let linkStack = this._linkStack;
        let belongs = this;
        if(target) {
            linkStack = target._belongs._linkStack;
            point = target._belongs._currentp;
            stack = target._belongs._stack;
            belongs = target._belongs
        }
        const targetLink = linkStack.checkHit(point, (link) => {
            if(!this._target.status.dragging) {
                return false;
            }
            const movingtarget = this._getMovingTarget();
            return link.from === movingtarget || link.to === movingtarget;
        });

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
            topLayerPoint,
        })
        Object.assign(this._target.meta, {
            x: offsetPoint[0],
            y: offsetPoint[1],
        });

        if(event === 'pressStart' && !this._target.status.dragging && !this._target.status.dragovering) {
            let movingtarget = target;
            while (movingtarget && movingtarget._belongs.lock && movingtarget !== this) {
                movingtarget = movingtarget._belongs;
            }
            // if(movingtarget === this) {
            //     movingtarget = undefined;
            // }
            if(movingtarget) {
                if(movingtarget._layoutNode) {
                    if(movingtarget._layoutNode.isLocked) {
                        movingtarget = movingtarget._layoutNode.getNodes()
                    } else if(!movingtarget._layoutNode.isDraggable) {
                        movingtarget = undefined;
                    } else {
                        movingtarget = [movingtarget];
                    }
                } else {
                    movingtarget = [movingtarget];
                }
            } 
            Object.assign(this._target, {
                moving: movingtarget,
                // isMovingDirty: movingtarget[0] === this._target.moving[0],
            })
        }
        return this._target;
    }

    _getMovingTarget() {
        return this._target.moving && this._target.moving[0];
    }

    _processDragOver(instance) {
        if(this._dragOverTarget !== instance) {
            const target = this.readMessage()?.instance;
            if(instance) {
                /**
                * dragover 进入事件
                * @event Instance#dragover
                * @type {object}
                * @property {Event} event           - 原始事件 
                * @property {Object} instance       - dragover的对象 
                * @property {target} target         - drag 携带的对象（特指从外面拖进canvas的对象） 
                */
                instance.dispatchEvent(new JFlowEvent('dragover', {
                    event,
                    instance,
                    target,
                }));
            }
            if(this._dragOverTarget) {
                const oldIns = this._dragOverTarget;
                /**
                * dragover 退出事件
                * @event Instance#dragoverend
                * @type {object}
                * @property {Event} event           - 原始事件 
                * @property {Object} instance       - dragover的对象 
                * @property {target} target         - drag 携带的对象（特指从外面拖进canvas的对象） 
                */
                oldIns.dispatchEvent(new JFlowEvent('dragoverend', {
                    event,
                    instance: oldIns,
                    target
                }));
            }
            this._dragOverTarget = instance;
        }
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
        const instance = this._target.instance || this._target.link;
        this._processDragOver(instance);
        // if(this._dragOverTarget !== instance) {
        //     if(instance) {
        //         instance.dispatchEvent(new JFlowEvent('dragover', {
        //             event,
        //             instance,
        //         }));
        //     }
        //     if(this._dragOverTarget) {
        //         const oldIns = this._dragOverTarget;
        //         oldIns.dispatchEvent(new JFlowEvent('dragoverend', {
        //             event,
        //             instance: oldIns,
        //         }));
        //     }
        //     this._dragOverTarget = instance;
        // }
        
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
        if(this._dragOverTarget) {
            const oldIns = this._dragOverTarget;
            oldIns.dispatchEvent(new JFlowEvent('dragoverend', {
                event,
                instance: oldIns,
            }));
            this._dragOverTarget = null;
        }
        const {
            link,
            instance: target,
        } = this._target;
        const {
            point, belongs
        } = this._target.cache;
        if(link) {   
            /**
             * 丢在线上事件
             *
             * @event BaseLink#drop
             * @type {object}
             * @property {Event} event           - 原始事件 
             * @property {Object} instance       - 拖动的对象 
             * @property {BaseLink} link         - 目标连线 
             * @property {JFlow} jflow           - 当前JFlow对象 
             * @property {Group|JFlow} belongs   - 连线所在的绘图栈的对象
             * @property {number[]} point        - 已经计算到绘图栈对应坐标系下的坐标
             */
            instance.anchor = point;
            link.dispatchEvent(new JFlowEvent('drop', {
                event,
                instance,
                link,
                jflow: this,
                belongs,
                point
            }))
        } else if(target) {
            /**
             * 丢在节点上事件
             *
             * @event Node#drop
             * @type {object}
             * @property {Event} event           - 原始事件 
             * @property {Object} instance       - 拖动的对象 
             * @property {JFlow} jflow           - 当前JFlow对象 
             * @property {Node} target           - 目标节点
             * @property {number[]} point        - 已经计算到绘图栈对应坐标系下的坐标
             */
            target.dispatchEvent(new JFlowEvent('drop', {
                event,
                instance,
                jflow: this,
                target,
                point
            }));
        } else {
            /**
            * 丢在主图上事件
            *
            * @event JFlow#drop
            * @type {object}
            * @property {Event} event           - 原始事件 
            * @property {Object} instance       - 拖动的对象 
            * @property {JFlow} jflow           - 当前JFlow对象 
            * @property {number[]} point        - 已经计算到绘图栈对应坐标系下的坐标
            */
            this.dispatchEvent(new JFlowEvent('drop', {
                event,
                instance,
                jflow: this,
                target,
                point,
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
        event.preventDefault();
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
        this.position.offsetX = this.position.x - x * newScale;
        this.position.offsetY = this.position.y - y * newScale;
        /**
         * 缩放平移事件
         *
         * @event JFlow#zoompan
        */
        this.dispatchEvent(new JFlowEvent('zoompan'));
        requestAnimationFrame(() => {
            this._render();
            this._zooming = false;
        })
    }

    _onPressStart(event) { 
        const { offsetX, offsetY, deltaY, button } = event
        if(button !== 0) return;
        this._targetLockOn([offsetX, offsetY], 'pressStart');
        Object.assign(this._target.meta, {
            initialX: offsetX,
            initialY: offsetY,
        })
        Object.assign(this._target.status, {
            dragging: true,
            processing: false,
        });
        if(this._target.moving) {
            const moving = this._getMovingTarget();
            /**
             * 开始拖动组的事件（特指lock的顶层组）
             *
             * @event Node#pressStart
             * @type {object}
             * @property {Event} event           - 原始事件 
             * @property {Node} instance       - 拖动的对象 
             * @property {JFlow} jflow           - 当前JFlow对象 
             */
            moving.dispatchEvent(new JFlowEvent('pressStart', {
                event,
                instance: moving,
                jflow: this,
            }))
        }

        if(this._target.instance) {
            /**
             * 开始拖动对象事件（就是目标对象的拖动事件，事件支持冒泡）
             *
             * @event Node#instancePressStart
             * @type {object}
             * @property {Event} event           - 原始事件 
             * @property {Node} instance     - 拖动的对象 
             * @property {JFlow} jflow           - 当前JFlow对象 
             * @property {Boolean} bubbles       - 冒泡
             */
            const t = this._target.instance;
            t.bubbleEvent(new JFlowEvent('instancePressStart', {
                event,
                target: t,
                jflow: this,
                bubbles: true,
            }))
        }

    }

    _onPressMove(event) {
        // console.log('_onPressMove')
        const {
            dragging, processing
        } = this._target.status;
        const { x, y } = this._target.meta;

        const { offsetX, offsetY, clientX, clientY } = event
        /**
         * canvas pressmove 原生事件
         *
         * @event JFlow#canvasmousemove
         * @type {object}
         * @property {Event} event           - 原始事件
         * @property {JFlow} jflow           - 当前JFlow对象 
         */
        this.dispatchEvent(new JFlowEvent('canvasmousemove', {
            event,
            jflow: this,
        }))

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
        
        const movingtarget = this._target.moving;// this._tempInstance ? [this._tempInstance] : this._target.moving;

        this._target.status.processing = true;
        const deltaX = offsetX - x;
        const deltaY = offsetY - y;

        if(movingtarget) {
            movingtarget.forEach(t => {
                t.anchor[0] += deltaX / this.scale;
                t.anchor[1] += deltaY / this.scale;
            })
        } else {
            this._recalculatePosition(deltaX, deltaY);    
            this.dispatchEvent(new JFlowEvent('zoompan'));
        }
        const { instance, link } = this._targetLockOn([offsetX, offsetY]);
        // console.log(instance);
        this._processDragOver(instance || link);
            
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
        event.preventDefault();
        event.stopPropagation();
        const { button } = event
        if(button !== 0) return;
        const meta = this._target.meta;
        // if(meta.initialX === undefined && isDocument) {
        //     this.dispatchEvent(new JFlowEvent('click', {
        //         event,
        //         jflow: this,
        //     }));
        //     return;
        // }
        
        // if(this._tempInstance) {
        //     this.dispatchEvent(new JFlowEvent('canvasmouseup', {
        //         event,
        //         jflow: this,
        //     }));
        //     this._clearTarget();
        //     return;
        // } else {
        //     // 没有设置也需要触发事件
        //     this.dispatchEvent(new JFlowEvent('canvasmouseup', {
        //         event,
        //         jflow: this,
        //     }));
        // }
        
        
        if(meta.initialX === meta.x
            && meta.initialY === meta.y) {
                if(event.target !== this.canvas){
                    this._clearTarget();
                    return;
                }
                if(this._target.instance && !isDocument) {
                    const t = this._target.instance;
                    /**
                    * 点击事件（冒泡）
                    *
                    * @event Node#click
                    * @type {object}
                    * @property {Event} event          - 原始事件 
                    * @property {Instance} target      - 点击的对象 
                    * @property {JFlow} jflow          - 当前JFlow对象 
                    * @property {Boolean} bubbles      - 冒泡
                    */
                    t.bubbleEvent(new JFlowEvent('click', {
                        event,
                        target: t,
                        jflow: this,
                        bubbles: true,
                    }))
                    this._clearTarget();
                    this._render();
                    return;
                } else {
                    /**
                    * 点击事件
                    *
                    * @event JFlow#click
                    * @type {object}
                    * @property {Event} event          - 原始事件 
                    * @property {JFlow} jflow          - 当前JFlow对象 
                    */
                    this.dispatchEvent(new JFlowEvent('click', {
                        event,
                        jflow: this,
                    }));
                    this._clearTarget();
                    this._render();
                    return
                }
            
        } else if(this._target.moving) {
            let checkresult = false;
            if(this._layout.static) {
                checkresult = this.staticCheck(this._getMovingTarget());
            }

            if(!checkresult && this._target.link) {
                const {
                    point, belongs
                } = this._target.cache;
                const link = this._target.link;
                const instance = this._getMovingTarget();
                // instance.anchor = point;
                // belongs.addInstanceToLink(this._target.link, instance);
                // belongs.dispatchEvent(new JFlowEvent('drop', {
                //     event,
                //     instance,
                //     link: ,
                //     jflow: this,
                //     target,
                // }))
                /**
                 * 拖动到线上事件
                 *
                 * @event BaseLink#drop
                 * @type {object}
                 * @property {Event} event           - 原始事件 
                 * @property {Object} instance     - 拖动的对象 
                 * @property {BaseLink} link         - 目标连线 
                 * @property {JFlow} jflow           - 当前JFlow对象 
                 * @property {Group|JFlow} belongs   - 连线所在的绘图栈的对象
                 */
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
                    /**
                     * 拖动后放置到 Instance 上的事件
                     *
                     * @event Instance#pressEnd
                     * @type {object}
                     * @property {Event} event           - 原始事件 
                     * @property {Instance} instance     - 拖动的对象 
                     * @property {JFlow} jflow           - 当前JFlow对象 
                     * @property {Instance} target       - 拖动到的对象
                     * @property {boolean} bubbles       - 冒泡
                     */
                     console.log('pressEnd', this._target.instance)
                    this._target.instance.bubbleEvent(new JFlowEvent('pressEnd', {
                        event,
                        instance: this._getMovingTarget(),
                        jflow: this,
                        target: this._target.instance,
                        bubbles: true
                    }));
                } else {
                    /**
                     * 拖动后放置到主图上的事件
                     *
                     * @event JFlow#pressEnd
                     * @type {object}
                     * @property {Event} event           - 原始事件 
                     * @property {Instance} instance       - 拖动的对象 
                     * @property {JFlow} jflow           - 当前JFlow对象 
                     */
                    this.dispatchEvent(new JFlowEvent('pressEnd', {
                        event,
                        instance: this._getMovingTarget(),
                        jflow: this,
                    }))
                }
            }
            this._target.moving = null;
            this.removeTempDraggingInstance()
            // this._target.isMovingDirty = false;
            this._render();
        }
        this._clearTarget();
    }

    _clearTarget(){
        Object.assign(this._target.meta, {
            x: undefined,
            y: undefined,
            initialX: undefined,
            initialY: undefined, 
        })
        Object.assign(this._target.status, {
            dragging: false,
            processing: false,
        });
        Object.assign(this._target, {
            instance: null,
            link: null,
            moving: null,
        });
    }

    _onPressUpDocument(event) {
        this._onPressUp(event, true);
    }

    _onClick(event) {
        const { offsetX, offsetY } = event;
        const point = this._calculatePointBack([offsetX, offsetY]);
        const target = this._stack.checkHit(point);
    }

    _onContextMenu(event) {
        event.preventDefault();
        event.stopPropagation();
        const { offsetX, offsetY } = event;
        const {
            link,
            instance
        } = this._targetLockOn([offsetX, offsetY]);
        const { topLayerPoint } = this._target.cache
        if(instance || link) {
            const target = (instance || link);
            /**
             * 右键事件（冒泡）
             *
             * @event instance#contextclick
             * @type {object}
             * @property {Event} event           - 原始事件 
             * @property {Instance} target       - 右键对象 
             * @property {JFlow} jflow           - 当前JFlow对象
             * @property {number[]} topLayerPoint  - jflow坐标系上的位置
             * @property {Boolean} bubbles       - 冒泡
             */
            target.bubbleEvent(new JFlowEvent('contextclick', {
                event,
                jflow: this,
                target,
                topLayerPoint,
                bubbles: true
            }));
        } else {
            /**
             * 右键事件
             *
             * @event JFlow#contextclick
             * @type {object}
             * @property {Event} event           - 原始事件 
             * @property {JFlow} jflow           - 当前JFlow对象
             * @property {number[]} topLayerPoint  - jflow坐标系上的位置
             */
            this.dispatchEvent(new JFlowEvent('contextclick', {
                event,
                jflow: this,
                topLayerPoint,
            }));
        }
    }

    _recalculatePosition(deltaX, deltaY, scale) {
        const { x, y } = this.bounding_box;
        if(scale === undefined) {
            scale = this.scale;
        }
        this.position.x += deltaX;
		this.position.y += deltaY;
        this.position.offsetX = this.position.x - x * scale;
        this.position.offsetY = this.position.y - y * scale;
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
     /**
     * 绘制画布
     */
    _render() {
        this._resetTransform();
        // this._stack.forEach(instance => {
        //     instance._intersections = [];
        // });
        // let linkStack = this._linkStack;
        // if(this._layout.alignLinkOrder) {
        //     const p = new InstanceStack();
        //     this._layout.alignLinkOrder(linkStack, p);
        //     linkStack = p;
        // }
        const ctx = this.ctx;
        
        this._stack.render(ctx);
        this._linkStack.render(ctx);
        if(this._tempInstance) {
            ctx.save();
            this._tempInstance.render(ctx)
            ctx.restore();
        }
        
    }
}
Object.assign(JFlow.prototype, MessageMixin);
Object.assign(JFlow.prototype, StackMixin);
Object.assign(JFlow.prototype, LayoutMixin);

export default JFlow;
export { default as JFlowEvent } from '../events';
export { default as Instance } from '../instance/instance';
export { default as Node } from '../instance/node';
export { default as BaseLink } from '../instance/base-link';
export { default as Point } from '../instance/shapes/point';
export { default as Rectangle } from '../instance/shapes/rectangle';
export { default as Group } from '../instance/shapes/rectangle-group';
export { default as Capsule } from '../instance/shapes/capsule';
export { default as CapsuleGroup } from '../instance/shapes/capsule-group';
export { default as Diamond } from '../instance/shapes/diamond';
export { default as DiamondGroup } from '../instance/shapes/diamond-group';
export { default as Text } from '../instance/text';
export { default as Icon } from '../instance/image';
export { default as Link } from '../instance/link';
export { default as PolylineLink } from '../instance/polyline-link';
export { default as BezierLink } from '../instance/bezier-link';
export { default as LinearLayout} from '../layout/linear-layout';
// export { default as TreeLayout } from '../ler-layouta;yout/tree-layout';
export { default as Lowcodelayout } from '../layout/low-code-layout';
export { default as ERLayout } from '../layout/er-layout/er-layout';