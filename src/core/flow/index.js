import { createCanvas, resizeCanvas, listenOnDevicePixelRatio } from '../utils/canvas';
import { bounding_box, doOverlap, debounce } from '../utils/functions';
import { JFLOW_MODE } from '../utils/constance';
import GhostNode from '../instance/ghostNode';
import { NodeWeakMapMixin } from '../instance/nodeWeakMap';
import StackMixin from '../instance/stackMixin';
// import InstanceStack from '../instance/stack';
import LayoutMixin from '../instance/layoutMixin';
import MessageMixin from '../instance/messageMixin';
import AnimeMixin from '../anime/animeMixin';
import MiniMapMixin from '../miniMap/minimap-mixin';
import ScrollBarMixin from '../scrollbar/scrollbarMixin';
import ScheduleMixin from './schedule';
// import { setUniqueId, getUniqueId } from '../utils/functions';
import JFlowEvent from '../events';

import EventAdapter from '../events/adapter';

import GroupFactory from '../instance/groupFactory';
import Point from '../instance/shapes/point';
import Rectangle from '../instance/shapes/rectangle';
import Capsule from '../instance/shapes/capsule';
import CapsuleVertical from '../instance/shapes/capsule-vertical';
import Rhombus from '../instance/shapes/rhombus';
import Diamond from '../instance/shapes/diamond';
import DiamondVertical from '../instance/shapes/diamond-vertical';
/**
 * @funtion setInitialPosition
 * @param {Number} RealboxX - 内容映射到canvas上的 X
 * @param {Number} RealboxY - 内容映射到canvas上的 Y 
 * @param {Number} RealboxW - 内容映射到canvas上的宽度
 * @param {Number} RealboxH - 内容映射到canvas上的高度 
 * @param {Number} CanvasWidth  - 视窗宽度
 * @param {Number} CanvasHeight  - 视窗高度
 * @return {Object} - 初始位置 { x, y }
 */

/**
 * @funtion linkGen
 * @param {Node} from - 出发绘图节点
 * @param {Node} to - 临时节点，当前鼠标指的地方
 * @return {BaseeLink} - 连线对象
 */


/** 
 * @class Group
 * @classdesc 矩形组单元 由 {@link GroupFactory} 通过 {@link Rectangle} 生成
 * @groupfrom Rectangle
 * @augments GroupTemplate
 * @augments Rectangle
 * @param {(Rectangle~RectangleConfigs|GroupTemplate~GroupConfigs)} configs - 配置
 */
export const Group = GroupFactory(Rectangle);
/** 
 * @class CapsuleGroup
 * @classdesc 胶囊组单元 由 {@link GroupFactory} 通过 {@link Capsule} 生成
 * @groupfrom Capsule
 * @augments GroupTemplate
 * @augments Capsule
 * @param {(Capsule~CapsuleConfigs|GroupTemplate~GroupConfigs)} configs - 配置
 */
export const CapsuleGroup = GroupFactory(Capsule);
/** 
 * @class RhombusGroup
 * @classdesc 菱形组单元 由 {@link GroupFactory} 通过 {@link Rhombus} 生成
 * @augments GroupTemplate
 * @augments Rhombus
 * @groupfrom Rhombus
 * @param {(Rhombus~RhombusConfigs|GroupTemplate~GroupConfigs)} configs - 配置
 */
export const RhombusGroup = GroupFactory(Rhombus);
/** 
 * @class DiamondGroup
 * @classdesc 钻石形组单元 由 {@link GroupFactory} 通过 {@link Diamond} 生成
 * @groupfrom Diamond
 * @augments GroupTemplate
 * @augments Diamond
 * @param {(Diamond~DiamondConfigs|GroupTemplate~GroupConfigs)} configs - 配置
 */
export const DiamondGroup = GroupFactory(Diamond, {
    shapeShift(width, height) {
        return [width + height * 0.28865, height]
    }
});
/** 
 * @class DiamondVerticalGroup
 * @classdesc 垂直钻石形组单元 由 {@link GroupFactory} 通过 {@link DiamondVertical} 生成
 * @groupfrom DiamondVertical
 * @augments GroupTemplate
 * @augments DiamondVertical
 * @param {(Diamond~DiamondConfigs|GroupTemplate~GroupConfigs)} configs - 配置
 */
export const DiamondVerticalGroup = GroupFactory(DiamondVertical, {
    shapeShift(width, height) {
        return [width, height + width * 0.5773]
    }
});
/** 
 * @class CapsuleVerticalGroup
 * @classdesc 垂直钻石形组单元 由 {@link GroupFactory} 通过 {@link CapsuleVertical} 生成
 * @groupfrom CapsuleVertical
 * @augments GroupTemplate
 * @augments CapsuleVertical
 * @param {(Capsule~CapsuleConfigs|GroupTemplate~GroupConfigs)} configs - 配置
 */
export const CapsuleVerticalGroup = GroupFactory(CapsuleVertical);

export const PointGroup = GroupFactory(Point, {
    shapeShift(width, height, p) {
        const r = Math.ceil(Math.sqrt(width * width + height * height) / 2);
        p.radius = r;
        const w = r * 2;
        return [w, w];
    }
});
/**
 * @typedef JFlow~JFlowConfigs
 * @type {object}
 * @property {Boolean} allowDrop      - 是否允许 dragdrop
 * @property {Number} maxZoom         - 最大缩放
 * @property {Number} minZoom         - 最小缩放
 * @property {number} initialZoom     - 初始缩放比
 * @property {EventAdapter~pluginDef} eventAdapter
 */

/**
 * @typedef {JFlow~JFlowConfigs | LayoutMixin~LayoutConfigs} JFlow~JFlowLayoutConfigs
 */
/** 
 * JFlow 对象
 * JFlow 是 canvas 上面封装的一个顶层对象，具有处理事件和绘制的功能
 * @constructor JFlow
 * @param {JFlow~JFlowLayoutConfigs} configs - 配置项
 * @mixes LayoutMixin
 * @mixes StackMixin
 * @mixes MessageMixin
 */
class JFlow extends EventTarget{
    constructor(configs) {
        super();
        this.uniqueName = 'jflow';
        /**
         * @member {EventAdapter} eventAdapter    - eventAdapter 对象
         **/
        this.eventAdapter = new EventAdapter(configs.eventAdapter);
        this.initNodeWeakMap();
        this.initAnime();
        this.initStack(configs);
        this.initLayout(configs);
        /** @member {Context2d}     - Context2d 对象 */
        this.ctx = null;
        /** @member {Element}       - canvas 元素 */
        this.canvas = null;
        /** @member {number}       - 设备DPR */
        this.dpr = 1;
        /** @member {number}       - 内边距 */
        this.padding = 20;
        this.position = null;
        /** @member {number}     - 缩放 */
		this.scale = null;
        /** @member {number}     - 初始缩放 */
        this.initialZoom = configs.initialZoom;
        /** @member {setInitialPosition} - 初始位置计算 */
        this.initialPosition = configs.setInitialPosition;
        /** @member {number}     - 最大缩放 */
        this.maxZoom = configs.maxZoom || 3;
        /** @member {number}     - 最小缩放 */
        this.minZoom = configs.minZoom || .5;
        
        this.NodeRenderTop = !!configs.NodeRenderTop

        this.worldMargin = configs.worldMargin;

        this.draggingbehavior = Object.assign({
            panInBorder: {
                enable: true,
                padding: 20,
                deltamovement: 8,
                allowMovingTargetInPan: true,
            },
        }, configs.draggingbehavior || {});
        this.scrollBarBehavior = Object.assign({
            enable: true,
        }, configs.scrollBarBehavior || {})
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
                movingState: false,
            }
        }

        this._focus = {
            instance: null,
        }

        this._dragOverTarget = null;
        // this.lock = configs.lock;

        this.allowDrop = configs.allowDrop;
        // 临时绘制的对象
        this._tempNode = null;
        this._tempLink = null;

        this.mode = JFLOW_MODE.DEFAULT;

        this._allowMovingTarget = true;

        // this._allowZoom = true;
    }

    // allowZoom() {
    //     this._allowZoom = true;
    // }

    // abandonZoom() {
    //     this._allowZoom = false;
    // }
    /**
     * 设置当前拖动的 JFlow 对象
     * @param {Object[]} targets - 具有 anchor 属性的对象
     */
    setMovingTargets(targets) {
        Object.assign(this._target, {
            moving: targets,       
        })
    }

    /**
     * 设置当前拖动的 JFlow 对象
     * @param {Instance} instance - JFlow 对象
     */
    setTempDraggingInstance(instance) {
        instance._belongs = this;
        this._tempNode = instance;
        Object.assign(this._target, {
            moving: [this._tempNode],
            dragging: true,
        })
    }

    /**
     * 取消当前拖动的 JFlow 对象
     * @return {number[]} point - JFlow 坐标
     */
    removeTempDraggingInstance() {
        if(this._tempNode) {
            // this.removeFromStack(this._tempNode);
            const anchor = this._tempNode.anchor;
            this._tempNode = null;
            return anchor;
        }
    }
    /**
     * 关闭默认对象拖动效果
     */
    preventDefaultDragging() {
        this._allowMovingTarget = false;
    }
    /**
     * 开启默认对象拖动效果
     */
    allowDefaultDragging() {
        this._allowMovingTarget = true;
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
        this.canvas.setAttribute('data-jflow', true);
        this.canvas.$jflow = this;
        this.canvasMeta = {
            width: raw_width,
            height: raw_height,
            actual_width: c_width,
            actual_height: c_height
        }
        this.dpr = dpr;
        
        this._getBoundingGroupRect();

        const padding = this.padding;
        const { width: p_width, height: p_height, x: p_x, y: p_y } = this.bounding_box;
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
        let scaleRatio;
        if(this.initialZoom) {
            scaleRatio = this.initialZoom;
        } else {
            scaleRatio = Math.min(w_ratio, h_ratio);
        }
       
        this.scale = scaleRatio;
        if(scaleRatio > this.maxZoom) {
            this.maxZoom = scaleRatio;
        }
        if(scaleRatio < this.minZoom) {
            this.minZoom = scaleRatio;
        }
        const realboxX = p_x * scaleRatio;
        const realboxY = p_y * scaleRatio;
        const realboxW = contentBox.width;
        const realboxH = contentBox.height;
        if(this.initialPosition) {
            const { x, y } = this.initialPosition(realboxX, realboxY, realboxW, realboxH, contentBox.x, contentBox.y, c_width, c_height, p_x, p_y, p_width, p_height);
            position.x = x;
            position.y = y;
        } else {
            position.x = align === 'x' ? contentBox.x : (realboxW - p_width * scaleRatio) / 2 + padding
            position.y = align === 'y' ? contentBox.y : (realboxH - p_height * scaleRatio) / 2 + padding
        }
        
        position.offsetX = position.x - realboxX;
        position.offsetY = position.y - realboxY;
        this.position = position;
        this._readyToRender = true;
        if(this.scrollBarBehavior.enable) {
            this.initScrollBar(this.scrollBarBehavior);
        }
        this.scheduleRender(() => {
            this._createEventHandler();
        });
        
        listenOnDevicePixelRatio((dpr) => {
            this.dpr = dpr;
            this.scheduleRender();
        })
    }

    /**
     * 设置Jflow进入连线模式
     * @param {Object} source - 当前连线的出发原始数据
     * @param {linkGen} linkGen - 生成连线单元的方法
     */
    setLinkingMode(source, linkGen, isTail) {
        const renderNode = this.getRenderNodeBySource(source)
        this._tempNode = new GhostNode();
        if(isTail) {
            this._tempLink = linkGen({
                from: this._tempNode,
                to: renderNode,
            })
        } else {
            this._tempLink = linkGen({
                from: renderNode,
                to: this._tempNode,
            })
        }
        
        this.sendMessage({
            instance: source
        });
        this.mode = JFLOW_MODE.LINKING;
    }

    isInLinkingMode() {
        return this.mode === JFLOW_MODE.LINKING;
    }

    /**
     * 连线模式下，设置当前临时连线的属性
     * @param {BaseLink~Configs} configs - 当前连线的出发原始数据
     */
    setLinkingLink(configs) {
        if(this.mode === JFLOW_MODE.LINKING) {
            this._tempLink.setConfig(configs);
        }
    }
    /**
     * 连线模式下，重连回临时鼠标节点
     */
    resetLinkingLink() {
        if(this.mode === JFLOW_MODE.LINKING) {
            this._tempLink.setConfig({
                to: this._tempNode
            })
        }
    }

    clearTemp() {
        if(this._tempNode) {
            this._tempNode.destroy();
            this._tempNode = null;
        }
        if(this._tempLink) {
            this._tempLink.destroy();
            this._tempLink = null;
        }
        this._render();
    }

    preventClearTemp() {
        this._preventClearTemp = true;
    }

    /**
     * 外层容器大小变化后，调用此方法可以改变当前canvas的状态
     */
    resizeCanvas() {
        const {
            width: c_width, 
            height: c_height, 
            raw_width,
            raw_height,
        } = resizeCanvas(this.canvas, this.DOMwrapper);
        this.canvasMeta = {
            width: raw_width,
            height: raw_height,
            actual_width: c_width,
            actual_height: c_height
        }
    }

    setFocusInstance(node) {
        this._focus.instance = node;
    }

    /**
     * 移动画布到以目标绘图节点为中心的位置上
     * @param {Node} node - 绘图节点
     */
    focusOn(node) {
        const center = this._calculatePointBack([
            this.canvasMeta.actual_width/2,
            this.canvasMeta.actual_height/2
        ]);
        let offset = node.anchor;
        if(node._belongs.calculateToCoordination) {
            offset = node._belongs.calculateToCoordination(offset);
        }

        const deltaX = (center[0] - offset[0]) * this.scale;
        const deltaY = (center[1] - offset[1]) * this.scale;
        

        this._recalculatePosition(deltaX, deltaY)
        this._render();
    }
    
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

    _createEventHandler() { 
        const canvas = this.canvas;
        let destroyListener;
        this.eventAdapter.apply(this);
        const destroyPlainEventListener = () => {
            this.eventAdapter.unload(this);
        }
        destroyListener = destroyPlainEventListener;

        if(this.allowDrop) {
            const dragoverHandler = this._onDragover.bind(this);
            const dropHandler = this._onDrop.bind(this);
            const dragleaveHanlder = this._onDragLeave.bind(this);
            canvas.addEventListener('dragstart', (e) => {
                e.preventDefault()
            })
            canvas.addEventListener('dragover', dragoverHandler);
            canvas.addEventListener('drop', dropHandler);
            canvas.addEventListener('dragleave', dragleaveHanlder);
            destroyListener = () => {
                destroyPlainEventListener();
                canvas.removeEventListener('dragover', dragoverHandler);
                canvas.removeEventListener('drop', dropHandler);
                canvas.removeEventListener('dragleave', dragleaveHanlder);
            }
        } 
        this.destroy = destroyListener;
    }

    _targetLockOn(offsetPoint, event) {
        let point = this._calculatePointBack(offsetPoint);
        const topLayerPoint = point;
        this._currentp = point;
        let stack = this._stack;
        const br = this._getViewBox();
        const target = stack.checkHit(
            point, 
            // 应用于所有
            (instance) => {
                return (this._target.status.dragging 
                    && (instance === this._getMovingTarget()))
            },
            // 仅对于本层过滤
            (instance) => {
                return doOverlap(br, instance.getBoundingRect())
            });
        let linkStack = this._linkStack;
        let belongs = this;
        /*
        if(target) {
            linkStack = target._belongs._linkStack;
            point = target._belongs._currentp;
            stack = target._belongs._stack;
            belongs = target._belongs
        }*/
        // 暂时设定只有顶层有连线
        let targetLink;
        if(!target || target._belongs === this) {
            targetLink = linkStack.checkHit(point, (link) => {
                if(!this._target.status.dragging) {
                    return false;
                }
                const movingtarget = this._getMovingTarget();
                return link.from === movingtarget || link.to === movingtarget;
            });
        }
        if(!targetLink) {
            targetLink = linkStack.checkHit(point, (link) => {
                return !link.ON_TOP;
            });
        }
        
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
            this.setMovingTargets(movingtarget && [ movingtarget ])
            if(movingtarget) {
                /**
                 * 
                 * 开始拖拽时，拖拽对象设置之前
                 * @event Node#afterResolveMovingTarget
                 * @type {object}
                 * @property {Event} event           - 原始事件 
                 * @property {JFlow} jflow           - 当前JFlow对象 
                 * @property {Node} target           - 目标节点
                 */
                target.bubbleEvent(new JFlowEvent('afterResolveMovingTarget', {
                    event,
                    target: movingtarget,
                    jflow: this,
                    bubbles: true,
                }))
            }
        }
        
        if(['pressStart', 'click', 'dblclick', 'contextclick'].includes(event)) {
            if(this._focus.instance && this._focus.instance !== target) {
                this._focus.instance.dispatchEvent(new JFlowEvent('blur', {
                    relatedTarget: target,
                }));
                this._focus.instance = null;
            }   
        }
        return this._target;
    }

    _getMovingTarget() {
        return this._target.moving && this._target.moving[0];
    }

    _processDragOver(instance, event) {
        if(this._dragOverTarget !== instance) {
            const target = this.readMessage()?.instance;
            this._dragCurrentData = target;
            const { point } = this._target.cache;
            // console.log('_processDragOver', this._dragOverTarget)
            if(this._dragOverTarget) {
                const oldIns = this._dragOverTarget;
                /**
                * dragleave 退出事件
                * @event Instance#dragleave
                * @type {object}
                * @property {Event} event           - 原始事件 
                * @property {Object} instance       - dragleave的对象 
                * @property {target} target         - drag 携带的对象（特指从外面拖进canvas的对象） 
                */
                oldIns.dispatchEvent(new JFlowEvent('dragleave', {
                    event,
                    instance: oldIns,
                    target,
                    jflow: this,
                    point,
                }));
            }
            if(instance) {
                /**
                * dragenter 进入事件
                * @event Instance#dragenter
                * @type {object}
                * @property {Event} event           - 原始事件 
                * @property {Object} instance       - dragenter的对象 
                * @property {target} target         - drag 携带的对象（特指从外面拖进canvas的对象） 
                */
                instance.dispatchEvent(new JFlowEvent('dragenter', {
                    event,
                    instance,
                    target,
                    jflow: this,
                    point
                }));
            }
            this._dragOverTarget = instance;
        } else if(this._dragOverTarget){
            /**
            * dragover 进入事件
            * @event Instance#dragover
            * @type {object}
            * @property {Event} event           - 原始事件 
            * @property {Object} instance       - dragover的对象 
            * @property {target} target         - drag 携带的对象（特指从外面拖进canvas的对象） 
            */
            this._dragOverTarget.dispatchEvent(new JFlowEvent('dragover', {
                event,
                instance,
                jflow: this,
                target: this._dragCurrentData,
            }));
        }

        this._processPanInBorder();
    }

    _processPanInBorder() {
        if(this.draggingbehavior?.panInBorder?.enable) {
            if(!this.draggingbehavior.panInBorder.timer) {
                this.draggingbehavior.panInBorder.timer = Date.now();
            }
            if(Date.now() - this.draggingbehavior.panInBorder.timer > 500) {
                const [x, y, w, h] = this._cacheViewBox;
                const [px, py] = this._currentp;
                const {
                    padding,
                    deltamovement
                } = this.draggingbehavior.panInBorder;
                let deltaX = 0;
                let deltaY = 0;
                if(px < x + padding) {
                    deltaX = deltamovement;
                } 
                if(px > w - padding) {
                    deltaX = -deltamovement;
                } 
                if(py < y + padding) {
                    deltaY = deltamovement;
                } 
                if(py > h - padding) {
                    deltaY = -deltamovement;
                } 
                if(this.__processOverAnime) {
                    this.__processOverAnime.cancel();
                }
                if(deltaX || deltaY) {
                    this.__processOverAnime = this.requestJFlowAnime(() => {
                        this.panHandler(deltaX, deltaY);
                    }) 
                } else {
                    this.draggingbehavior.panInBorder.timer = null;
                }
            }
        }
    }

    _onDragover(event) {
        // console.log(event);
        event.preventDefault();
        event.stopPropagation();
        if(this._lastDragState.processing) return;
        this._lastDragState.processing = true;
        const { offsetX, offsetY } = event
        Object.assign(this._target.status, {
            dragovering: true,
        })
        this._targetLockOn([offsetX, offsetY])
        const instance = this._target.instance || this._target.link;
        this._processDragOver(instance, event);
        if(this._target.isLinkDirty || this._target.isInstanceDirty) {
            Promise.resolve().then(() => {
                this._render();    
                this._target.isLinkDirty = false; 
                this._target.isInstanceDirty = false;
                this._lastDragState.processing = false;
            })
        } else {
            this._lastDragState.processing = false;
        } 
    }

    _cancelPanInBorder() {
        if(this.__processOverAnime) {
            this.__processOverAnime.cancel();
        }
        if(this.draggingbehavior?.panInBorder) {
            this.draggingbehavior.panInBorder.timer = null;
        }
    }

    _onDragLeave() {
        this._cancelPanInBorder();
    }

    _onDrop(event) {
        this._cancelPanInBorder();
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
            // instance.anchor = point;
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
            target.bubbleEvent(new JFlowEvent('drop', {
                event,
                instance,
                jflow: this,
                target,
                point,
                bubbles: true,
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
            this.cancelDrop();
        })
    }
    cancelDrop() {
        this._target.instance = null;
        this._target.link = null;
        Object.assign(this._target.status, {
            dragovering: false,
        })
    }
    
    /**
     * 缩放操作处理函数
     * @param {Number} offsetX - 事件对象与canvas的内填充边（padding edge）在 X 轴方向上的偏移量。
     * @param {Number} offsetY - 事件对象与canvas的内填充边（padding edge）在 Y 轴方向上的偏移量。 
     * @param {Number} deltaX  - 水平滚动量
     * @param {Number} deltaY  - 垂直滚动量
     * @param {Number} event - 原生事件
     */
    zoomHandler(offsetX, offsetY, deltaX, deltaY, event) {
        // if(!this._allowZoom) return;
        if(this._zooming) return;
        this._zooming = true;
        const { width: p_width, height: p_height, x, y } = this.bounding_box;
        const { actual_width: cw, actual_height: ch } = this.canvasMeta;
        let minZoom = this.minZoom;
        if(this.worldMargin) {
            const m = this.worldMargin;
            const maxWidth = p_width + m * 2;
            const maxHeight = p_height + m * 2;
            minZoom = Math.max(minZoom, Math.max(cw / maxWidth, ch / maxHeight));
        }
        let newScale = this.scale;
        const amount = deltaY > 0 ? 1.1 : 1 / 1.1;
        newScale *= amount;
        newScale = Math.min(this.maxZoom, Math.max(minZoom, newScale))
        // console.log(newScale);
        // if (this.maxZoom && newScale > this.maxZoom){
        //     // could just return but then won't stop exactly at maxZoom
        //     newScale = this.maxZoom;
        // }

        // if(this.minZoom && newScale < this.minZoom) {
        //     newScale = this.minZoom;
        // }

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
        this._recalculatePosition(pX * deltaWidth, pY * deltaHeight);
        
        // this.position.x += pX * deltaWidth;
        // this.position.y += pY * deltaHeight;
        // this.position.offsetX = this.position.x - x * newScale;
        // this.position.offsetY = this.position.y - y * newScale;
        this.dispatchEvent(new JFlowEvent('zoompan', {
             deltaX: 0, deltaY: 0
        }));
        // this.setAnimeClock()
        this.scheduleRender(() => {
            this._zooming = false;
        })
        // requestAnimationFrame((timestamp) => {
        //     this.setAnimeClock(timestamp);
        //     this._render();
        //     this._zooming = false;
        // })
    }
    /**
     * 平移画布操作处理函数
     * @param {Number} deltaX  - 水平滚动量
     * @param {Number} deltaY  - 垂直滚动量
     * @param {Number} event - 原生事件
     */
    panHandler(deltaX, deltaY, event) {
        if(this._panning) return;
        this._panning = true;
        const {
            dragging,
        } = this._target.status;
        if(dragging) {
            // const { x, y } = this._target.meta;
            const movingtarget = this._target.moving;// this._tempNode ? [this._tempNode] : this._target.moving;
            // this._target.status.movingState = true
            // this._target.status.processing = true;
            if(movingtarget) {
                if(this.draggingbehavior.panInBorder.allowMovingTargetInPan) {
                    movingtarget.forEach(t => {
                        t.anchor[0] += -deltaX / this.scale;
                        t.anchor[1] += -deltaY / this.scale;
                    })
                }
            }
            // this._targetLockOn([offsetX, offsetY]);
        }

        this._recalculatePosition(deltaX, deltaY);
        /**
         * 缩放平移事件
         *
         * @event JFlow#zoompan
        */
        this.dispatchEvent(new JFlowEvent('zoompan', {
            deltaX,
            deltaY
        }));
        this.scheduleRender(() => {
            this._panning = false;
        })
        // requestAnimationFrame((timestamp) => {
        //     this.setAnimeClock(timestamp);
        //     this._render();
        //     this._panning = false;
        // })
    }
    /**
     * 开始按压处理函数
     * @param {Number} offsetX - 事件对象与canvas的内填充边（padding edge）在 X 轴方向上的偏移量。
     * @param {Number} offsetY - 事件对象与canvas的内填充边（padding edge）在 Y 轴方向上的偏移量。 
     * @param {Number} event - 原生事件
     */
    pressStartHandler(offsetX, offsetY, event) {
        if(this.checkScrollDragging()) {
            return;
        }
        Object.assign(this._target.meta, {
            initialX: offsetX,
            initialY: offsetY,
        })
        const {
            link,
            instance
        } = this._targetLockOn([offsetX, offsetY], 'pressStart');
        // 后续只支持 click 动作
        if(this.mode === JFLOW_MODE.LINKING) return;
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
        const t = this._resolveLockOnTarget(link, instance)
        if(t) {
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
            // const t = this._target.instance;
            t.bubbleEvent(new JFlowEvent('instancePressStart', {
                event,
                target: t,
                jflow: this,
                bubbles: true,
            }))
        }

        this.dispatchEvent(new JFlowEvent('jflowPressStart', {
            event,
            jflow: this,
        }));
    }
    /**
     * 按压中处理函数
     * @param {Number} offsetX - 事件对象与canvas的内填充边（padding edge）在 X 轴方向上的偏移量。
     * @param {Number} offsetY - 事件对象与canvas的内填充边（padding edge）在 Y 轴方向上的偏移量。 
     * @param {Number} event - 原生事件
     */
    pressMoveHandler(offsetX, offsetY, event) {
        if(this.checkScrollDragging()) {
            return;
        }
        const {
            dragging, processing
        } = this._target.status;
        const { x, y } = this._target.meta;
        // this.canvas.style.cursor = 'default';
        if(!dragging) {
            if(this.checkScrollBarHover(offsetX, offsetY)) {
                return;
            } else {
                this.resetScrollBarHover();
            }
            
        }

        if(!dragging && !processing) {
            const {
                link,
                instance
            } = this._targetLockOn([offsetX, offsetY]);
            const t = this._resolveLockOnTarget(link, instance);
            if(t) {
                
                /**
                * instance mousemove 原生事件，仅在无拖拽时触发
                *
                * @event Node#instancemousemove
                * @type {object}
                * @property {Event} event           - 原始事件
                * @property {Node} instance           - 原始事件
                * @property {JFlow} jflow           - 当前JFlow对象 
                */
                // instance.dispatchEvent(new JFlowEvent('instancemousemove', {
                //     event,
                //     instance,
                //     jflow: this,
                // }))
                t.bubbleEvent(new JFlowEvent('instancemousemove', {
                    event,
                    instance: t,
                    jflow: this,
                    bubbles: true
                }));
            } else {
                this.dispatchEvent(new JFlowEvent('instancemousemove', {
                    event,
                    instance: null,
                    jflow: this,
                }));
            }
            

            if(this.mode === JFLOW_MODE.LINKING) {
                // if(instance) {
                //     instance.bubbleEvent(new JFlowEvent('linking', {
                //         event,
                //         target: instance,
                //         jflow: this,
                //         bubbles: true,
                //         callback: (p) => {
                //             this._currentp = p;
                //         }
                //     }))
                // }
                

                this._tempNode.anchor = this._currentp;
                
                this.scheduleRender(() => {
                    this._target.isLinkDirty = false; 
                    this._target.isInstanceDirty = false;
                    this._target.status.processing = false;
                })
                this._processPanInBorder();
                // requestAnimationFrame((timestamp) => {
                //     this.setAnimeClock(timestamp);
                //     this._render();
                //     this._target.isLinkDirty = false; 
                //     this._target.isInstanceDirty = false;
                //     this._target.status.processing = false;
                // })
                return;
            }
        }

        
        /**
         * canvas mousemove 原生事件
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

        
        
        if(!dragging) return;
        // this.canvas.style.cursor = 'grabbing';
        if(processing) return;
        
        const movingtarget = this._target.moving;// this._tempNode ? [this._tempNode] : this._target.moving;
        this._target.status.movingState = true
        this._target.status.processing = true;
        const deltaX = offsetX - x;
        const deltaY = offsetY - y;
        if(movingtarget) {
            if(this._allowMovingTarget) {
                movingtarget.forEach(t => {
                    t.anchor[0] += deltaX / this.scale;
                    t.anchor[1] += deltaY / this.scale;
                })
            }
        } else {
            this._recalculatePosition(deltaX, deltaY);    
            this.dispatchEvent(new JFlowEvent('zoompan', {
                deltaX, deltaY
            }));
        }
        const { instance, link } = this._targetLockOn([offsetX, offsetY]);

        this._processDragOver(instance || link, event);
        
        this.scheduleRender(() => {
            this._target.isLinkDirty = false; 
            this._target.isInstanceDirty = false;
            this._target.status.processing = false;
        })
        // requestAnimationFrame((timestamp) => {
        //     this._render();
        //     this._target.isLinkDirty = false; 
        //     this._target.isInstanceDirty = false;
        //     this._target.status.processing = false;
        // })
    }
    /**
     * 按压结束处理函数
     * @param {Boolean} isDocument - 是否为 document 触发
     * @param {Number} event - 原生事件
     */
    pressUpHanlder(isDocument, event) {
        if(this.__processOverAnime) {
            this.__processOverAnime.cancel();
        }
        this._cancelPanInBorder();
        // this.resetScollBarStatus();
        const meta = this._target.meta;
        if(this.mode === JFLOW_MODE.LINKING) {
            const t = this._target.instance;
            const payload = this.consumeMessage();
            // console.log(payload)
            if(t) {
                /**
                 * canvas mousemove 原生事件
                 *
                 * @event Node#link
                 * @type {object}
                 * @property {Event} event           - 原始事件
                 * @property {Node} target           - 原始事件
                 * @property {object} payload        - 传入的消息
                 * @property {JFlow} jflow           - 当前JFlow对象       - 当前JFlow对象 
                 */
                t.bubbleEvent(new JFlowEvent('link', {
                    event,
                    target: t,
                    jflow: this,
                    payload,
                    bubbles: true,
                    link: this._tempLink
                }))        
            } else {
                const { offsetX, offsetY } = event
                this.dispatchEvent(new JFlowEvent('link', {
                    event,
                    jflow: this,
                    payload,
                    anchor: this._calculatePointBack([offsetX, offsetY]),
                    link: this._tempLink
                }));
            }
            this._clearTarget();
            if(!this._preventClearTemp) {
                if(this._tempNode) {
                    this._tempNode.destroy();
                    this._tempNode = null;
                }
                if(this._tempLink) {
                    this._tempLink.destroy();
                    this._tempLink = null;
                }
            }
            this._preventClearTemp = false
            this.mode = JFLOW_MODE.DEFAULT;
            this._render();
            return;
        }
        
        if(this._target.moving) {
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
                }));
                this._target.link = null;
                this._target.instance = null;
            }
            if(this._target.moving) {
                if(this._target.instance) {
                    /**
                     * 拖动后放置到 Instance 上的事件，由被拖动到的对象触发
                     *
                     * @event Node#pressEnd
                     * @type {object}
                     * @property {Event} event           - 原始事件 
                     * @property {Node} instance         - 拖动的对象 
                     * @property {JFlow} jflow           - 当前JFlow对象 
                     * @property {Instance} target       - 拖动到的对象
                     * @property {boolean} bubbles       - 冒泡
                     */
                    //  console.log('pressEnd', this._target.instance)
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
     /**
     * 菜单弹出处理函数
     * @param {Number} offsetX - 事件对象与canvas的内填充边（padding edge）在 X 轴方向上的偏移量。
     * @param {Number} offsetY - 事件对象与canvas的内填充边（padding edge）在 Y 轴方向上的偏移量。 
     * @param {Number} event - 原生事件
     */
    clickHanlder(offsetX, offsetY, event) {
        const {
            link,
            instance,
            meta
        } = this._targetLockOn([offsetX, offsetY], 'click');
        if(Math.abs(meta.initialX - meta.x) < 1
            && Math.abs(meta.initialY - meta.y) < 1) { 
                if(event.target !== this.canvas){
                    this._clearTarget();
                    Object.assign(this._target.meta, {
                        initialX: undefined,
                        initialY: undefined, 
                    });
                    return;
                }
                const { topLayerPoint } = this._target.cache
                const t = this._resolveLockOnTarget(link, instance);
                if(t) {
                    const target = t;
                    /**
                     * 点击事件（冒泡）
                     *
                     * @event Instance#contextclick
                     * @type {object}
                     * @property {Event} event           - 原始事件 
                     * @property {Instance} target       - 右键对象 
                     * @property {JFlow} jflow           - 当前JFlow对象
                     * @property {number[]} topLayerPoint  - jflow坐标系上的位置
                     * @property {Boolean} bubbles       - 冒泡
                     */
                    target.bubbleEvent(new JFlowEvent('click', {
                        event,
                        jflow: this,
                        target,
                        topLayerPoint,
                        bubbles: true
                    }));
                } else {
                    /**
                     * 点击事件
                     *
                     * @event JFlow#contextclick
                     * @type {object}
                     * @property {Event} event           - 原始事件 
                     * @property {JFlow} jflow           - 当前JFlow对象
                     * @property {number[]} topLayerPoint  - jflow坐标系上的位置
                     */
                    this.dispatchEvent(new JFlowEvent('click', {
                        event,
                        jflow: this,
                        topLayerPoint,
                    }));
                }
                this._clearTarget();
                Object.assign(this._target.meta, {
                    initialX: undefined,
                    initialY: undefined, 
                });
            }
    }
    /**
     * 菜单弹出处理函数
     * @param {Number} offsetX - 事件对象与canvas的内填充边（padding edge）在 X 轴方向上的偏移量。
     * @param {Number} offsetY - 事件对象与canvas的内填充边（padding edge）在 Y 轴方向上的偏移量。 
     * @param {Number} event - 原生事件
     */
    contextMenuHanlder(offsetX, offsetY, event) {
        const {
            link,
            instance
        } = this._targetLockOn([offsetX, offsetY], 'contextclick');
        const { topLayerPoint } = this._target.cache
        const t = this._resolveLockOnTarget(link, instance);
        if(t) {
            const target = t;
            /**
             * 右键事件（冒泡）
             *
             * @event Instance#contextclick
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

    dblclickHandler(offsetX, offsetY, event) {
        const {
            link,
            instance
        } = this._targetLockOn([offsetX, offsetY], 'dblclick');
        const { topLayerPoint } = this._target.cache
        const t = this._resolveLockOnTarget(link, instance);
        if(t) {
            const target = t;
            /**
             * 右键事件
             *
             * @event Instance#dblclick
             * @type {object}
             * @property {Event} event           - 原始事件 
             * @property {Instance} target       - 右键对象 
             * @property {JFlow} jflow           - 当前JFlow对象
             * @property {number[]} topLayerPoint  - jflow坐标系上的位置
             * @property {Boolean} bubbles       - 冒泡
             */
            target.bubbleEvent(new JFlowEvent('dblclick', {
                event,
                jflow: this,
                target,
                topLayerPoint,
                bubbles: true
            }));
        } else {
            this.dispatchEvent(new JFlowEvent('dblclick', {
                event,
                jflow: this,
                topLayerPoint,
            }));
        }
    }

    /*_onZoom(event) {
        event.preventDefault();
        let { offsetX, offsetY, deltaX, deltaY } = event
        if(event.ctrlKey) { 
            deltaY = -deltaY;
            this.zoomHandler(offsetX, offsetY, deltaX, deltaY);
        } else {
            this.panHandler(-deltaX, -deltaY);
        }
    }

    _onPressStart(event) { 
        const { offsetX, offsetY, deltaY, button } = event
        if(button !== 0) return;
        this.pressStartHandler(offsetX, offsetY);
    }

    _onPressMove(event) {
        const { offsetX, offsetY } = event
        this.pressMoveHandler(offsetX, offsetY);
    }

    _onPressUp(event, isDocument) {
        event.preventDefault();
        event.stopPropagation();
        const { button } = event
        if(button !== 0) return;
        this.pressUpHanlder(isDocument)
    }

    _onPressUpDocument(event) {
        this._onPressUp(event, true);
    }

    _onContextMenu(event) {
        event.preventDefault();
        event.stopPropagation();
        const { offsetX, offsetY } = event;
        this.contextMenuHanlder(offsetX, offsetY);
    }*/
    _resolveLockOnTarget(link, instance) {
        return link?.ON_TOP ? link : (instance || link);
    }

    _clearTarget(){
        Object.assign(this._target.meta, {
            x: undefined,
            y: undefined,
            // initialX: undefined,
            // initialY: undefined, 
        })
        Object.assign(this._target.status, {
            dragging: false,
            processing: false,
            movingState: false,
        });
        Object.assign(this._target, {
            instance: null,
            link: null,
            moving: null,
        });
    }

    _recalculatePosition(deltaX, deltaY, scale) {
        const { x, y, width, height } = this.bounding_box;
        const { actual_width: cw, actual_height: ch } = this.canvasMeta;
        if(scale === undefined) {
            scale = this.scale;
        }
        

        if(this.worldMargin) {
            // console.log(scale)
            const m = this.worldMargin;
            const bx1 = (x + width + m)*scale - cw;
            const bx2 = (x - m)*scale;
            // console.log(bx1, bx2)
            const sx = x * scale;
            const px = this.position.x + deltaX;
            const cx = px - sx;
            this.position.offsetX = Math.min(Math.max(-bx1, cx), -bx2);
            // console.log(this.position.offsetX)
            // this.position.offsetX = Math.max(Math.min(-bx2, cx), -bx1);
            this.position.x = this.position.offsetX + sx;
            // console.log(this.position.x, deltaX)
            // console.log(this.position.offsetX)

            const by1 = (y + height + m)*scale - ch;
            const by2 = (y - m)*scale;
            // console.log(by1, by2)
            const sy = y * scale;
            const py = this.position.y + deltaY;
            const cy = py - sy;
            this.position.offsetY = Math.min(Math.max(-by1, cy), -by2);
            // this.position.offsetY = Math.max(Math.min(-by2, cy), -by1);
            this.position.y = this.position.offsetY + sy;
        } else {
            this.position.x += deltaX;
            this.position.y += deltaY; 
            this.position.offsetX = this.position.x - x * scale;
            this.position.offsetY = this.position.y - y * scale;
        }
        
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

    resetTransform(ctx) {
        const position = this.position;
        const scale = this.scale;
        ctx.setTransform();
        ctx.scale(this.dpr, this.dpr);
        ctx.transform(scale, 0, 0, scale, position.offsetX, position.offsetY);
    }

    _getViewBox() {
        const cacheViewBox = [
            ...this._calculatePointBack([0,0]),
            ...this._calculatePointBack([this.canvasMeta.actual_width,this.canvasMeta.actual_height]),
        ];
        this._cacheViewBox = cacheViewBox;
        return cacheViewBox;
    }

    setNodeToTopLayer(node) {
        const index = this._stack.findIndex(n => n === node);
        if(index !== -1) {
            const [renderNode] = this._stack.splice(index, 1);
            this._stack.push(renderNode);
        }
    }

    getCacheViewBox() {
        return this._cacheViewBox;
    }

    
    _render() {
        this.scheduleRender();
    }

     /**
     * 绘制画布
     */
    __render() {
        if(!this._readyToRender) return;
        // if(this.hasAnimeAndFrameRendered()) return;
        this.runAnimeFrame();
        this._resetTransform();
        const ctx = this.ctx;
        this.dispatchEvent(new JFlowEvent('beforeJflowRender', {
            ctx
        }));
        const br = this._getViewBox();
        this._viewBox = br;
        // console.log(this._viewBox)
        if(this.NodeRenderTop) {
            this._linkStack.render(ctx, (link) => !link.ON_TOP && link.isInViewBox(br));
            this._stack.render(ctx, (instance) => {
                const result = doOverlap(br, instance.getBoundingRect());
                // console.log(instance._layoutNode.type, result)
                instance._isInViewBox = result;
                return result;
            });
            this._linkStack.render(ctx, (link) => link.ON_TOP && link.isInViewBox(br));
        } else {
            this._stack.render(ctx, (instance) => {
                const result = doOverlap(br, instance.getBoundingRect());
                // console.log(instance._layoutNode.type, result)
                instance._isInViewBox = result;
                return result;
            });
            this._linkStack.render(ctx, (link) => link.isInViewBox(br));
        }

        if(this._tempNode) {
            ctx.save();
            this._tempNode.render(ctx)
            ctx.restore();
        }
        if(this._tempLink) {
            ctx.save();
            this._tempLink.isInViewBox(br)
            this._tempLink.render(ctx)
            ctx.restore();
        }

        this.dispatchEvent(new JFlowEvent('afterJflowRender', {
            ctx
        }));
        this.renderScrollBar(ctx);
        // this.setFrameRendered();
    }
}
Object.assign(JFlow.prototype, MessageMixin);
Object.assign(JFlow.prototype, StackMixin);
Object.assign(JFlow.prototype, LayoutMixin);
Object.assign(JFlow.prototype, NodeWeakMapMixin);
Object.assign(JFlow.prototype, AnimeMixin);
Object.assign(JFlow.prototype, MiniMapMixin);
Object.assign(JFlow.prototype, ScheduleMixin);
Object.assign(JFlow.prototype, ScrollBarMixin);

export default JFlow;
export { JFLOW_MODE } from '../utils/constance';
export { default as JFlowEvent } from '../events';
export { default as commonEventAdapter } from '../events/commonAdapter';
export { default as Instance } from '../instance/instance';
export { default as Node } from '../instance/node';
export { default as BaseLink } from '../instance/base-link';
export { default as Point } from '../instance/shapes/point';
export { default as Rectangle } from '../instance/shapes/rectangle';
// export { default as Group } from '../instance/shapes/rectangle-group';
export { default as Capsule } from '../instance/shapes/capsule';
export { default as CapsuleVertical } from '../instance/shapes/capsule-vertical';
// export { default as CapsuleGroup } from '../instance/shapes/capsule-group';
// export { default as CapsuleVerticalGroup } from '../instance/shapes/capsule-vertical-group';
export { default as Diamond } from '../instance/shapes/diamond';
// export { default as DiamondGroup } from '../instance/shapes/diamond-group';
// export { default as DiamondVerticalGroup } from '../instance/shapes/diamond-vertical-group';
export { default as Rhombus } from '../instance/shapes/rhombus';
// export { default as RhombusGroup } from '../instance/shapes/rhombus-group';
export { default as Text } from '../instance/text';
export { default as Icon } from '../instance/image';
export { default as ShadowDom } from '../instance/shadowDom';
export { default as GroupFactory } from '../instance/groupFactory';
export { default as Link } from '../instance/link';
export { default as PolyLink } from '../instance/poly-link';
export { default as BezierLink } from '../instance/bezier-link';
export { default as LinearLayout} from '../layout/linear-layout';
// export { default as TreeLayout } from '../ler-layouta;yout/tree-layout';
export { default as Lowcodelayout } from '../layout/low-code-layout';
export { default as ERLayout } from '../layout/er-layout/er-layout';
// export { default as Orange } from '../instance/nodeWrapper/orange/orange'
// export { default as TextEditor } from '../instance/text-editor';
export { default as TextGroup} from '../instance/text-group';
export { TextElement } from '../instance/text-group';