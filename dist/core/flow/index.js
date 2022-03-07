"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "BaseLink", {
  enumerable: true,
  get: function get() {
    return _baseLink["default"];
  }
});
Object.defineProperty(exports, "BezierLink", {
  enumerable: true,
  get: function get() {
    return _bezierLink["default"];
  }
});
Object.defineProperty(exports, "Capsule", {
  enumerable: true,
  get: function get() {
    return _capsule["default"];
  }
});
Object.defineProperty(exports, "CapsuleGroup", {
  enumerable: true,
  get: function get() {
    return _capsuleGroup["default"];
  }
});
Object.defineProperty(exports, "CapsuleVerticalGroup", {
  enumerable: true,
  get: function get() {
    return _capsuleVerticalGroup["default"];
  }
});
Object.defineProperty(exports, "Diamond", {
  enumerable: true,
  get: function get() {
    return _diamond["default"];
  }
});
Object.defineProperty(exports, "DiamondGroup", {
  enumerable: true,
  get: function get() {
    return _diamondGroup["default"];
  }
});
Object.defineProperty(exports, "DiamondVerticalGroup", {
  enumerable: true,
  get: function get() {
    return _diamondVerticalGroup["default"];
  }
});
Object.defineProperty(exports, "ERLayout", {
  enumerable: true,
  get: function get() {
    return _erLayout["default"];
  }
});
Object.defineProperty(exports, "Group", {
  enumerable: true,
  get: function get() {
    return _rectangleGroup["default"];
  }
});
Object.defineProperty(exports, "Icon", {
  enumerable: true,
  get: function get() {
    return _image["default"];
  }
});
Object.defineProperty(exports, "Instance", {
  enumerable: true,
  get: function get() {
    return _instance2["default"];
  }
});
Object.defineProperty(exports, "JFlowEvent", {
  enumerable: true,
  get: function get() {
    return _events["default"];
  }
});
Object.defineProperty(exports, "LinearLayout", {
  enumerable: true,
  get: function get() {
    return _linearLayout["default"];
  }
});
Object.defineProperty(exports, "Link", {
  enumerable: true,
  get: function get() {
    return _link2["default"];
  }
});
Object.defineProperty(exports, "Lowcodelayout", {
  enumerable: true,
  get: function get() {
    return _lowCodeLayout["default"];
  }
});
Object.defineProperty(exports, "Node", {
  enumerable: true,
  get: function get() {
    return _node["default"];
  }
});
Object.defineProperty(exports, "Point", {
  enumerable: true,
  get: function get() {
    return _point["default"];
  }
});
Object.defineProperty(exports, "PolyLink", {
  enumerable: true,
  get: function get() {
    return _polyLink["default"];
  }
});
Object.defineProperty(exports, "Rectangle", {
  enumerable: true,
  get: function get() {
    return _rectangle["default"];
  }
});
Object.defineProperty(exports, "Rhombus", {
  enumerable: true,
  get: function get() {
    return _rhombus["default"];
  }
});
Object.defineProperty(exports, "RhombusGroup", {
  enumerable: true,
  get: function get() {
    return _rhombusGroup["default"];
  }
});
Object.defineProperty(exports, "Text", {
  enumerable: true,
  get: function get() {
    return _text["default"];
  }
});
Object.defineProperty(exports, "commonEventAdapter", {
  enumerable: true,
  get: function get() {
    return _commonAdapter["default"];
  }
});
exports["default"] = void 0;

var _canvas = require("../utils/canvas");

var _functions = require("../utils/functions");

var _stackMixin = _interopRequireDefault(require("../instance/stackMixin"));

var _stack = _interopRequireDefault(require("../instance/stack"));

var _layoutMixin = _interopRequireDefault(require("../instance/layoutMixin"));

var _messageMixin = _interopRequireDefault(require("../instance/messageMixin"));

var _events = _interopRequireDefault(require("../events"));

var _adapter = _interopRequireDefault(require("../events/adapter"));

var _commonAdapter = _interopRequireDefault(require("../events/commonAdapter"));

var _instance2 = _interopRequireDefault(require("../instance/instance"));

var _node = _interopRequireDefault(require("../instance/node"));

var _baseLink = _interopRequireDefault(require("../instance/base-link"));

var _point = _interopRequireDefault(require("../instance/shapes/point"));

var _rectangle = _interopRequireDefault(require("../instance/shapes/rectangle"));

var _rectangleGroup = _interopRequireDefault(require("../instance/shapes/rectangle-group"));

var _capsule = _interopRequireDefault(require("../instance/shapes/capsule"));

var _capsuleGroup = _interopRequireDefault(require("../instance/shapes/capsule-group"));

var _capsuleVerticalGroup = _interopRequireDefault(require("../instance/shapes/capsule-vertical-group"));

var _diamond = _interopRequireDefault(require("../instance/shapes/diamond"));

var _diamondGroup = _interopRequireDefault(require("../instance/shapes/diamond-group"));

var _diamondVerticalGroup = _interopRequireDefault(require("../instance/shapes/diamond-vertical-group"));

var _rhombus = _interopRequireDefault(require("../instance/shapes/rhombus"));

var _rhombusGroup = _interopRequireDefault(require("../instance/shapes/rhombus-group"));

var _text = _interopRequireDefault(require("../instance/text"));

var _image = _interopRequireDefault(require("../instance/image"));

var _link2 = _interopRequireDefault(require("../instance/link"));

var _polyLink = _interopRequireDefault(require("../instance/poly-link"));

var _bezierLink = _interopRequireDefault(require("../instance/bezier-link"));

var _linearLayout = _interopRequireDefault(require("../layout/linear-layout"));

var _lowCodeLayout = _interopRequireDefault(require("../layout/low-code-layout"));

var _erLayout = _interopRequireDefault(require("../layout/er-layout/er-layout"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

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
 * @typedef {JFlowConfigs | LayoutMixin~LayoutConfigs} JFlow~JFlowLayoutConfigs
 */

/** 
 * JFlow 对象
 * JFlow 是 canvas 上面封装的一个顶层对象，具有处理事件和绘制的功能
 * @constructor JFlow
 * @mixes LayoutMixin
 * @mixes StackMixin
 * @mixes MessageMixin
 */
var JFlow = /*#__PURE__*/function (_EventTarget) {
  _inherits(JFlow, _EventTarget);

  var _super = _createSuper(JFlow);

  /**
   * 创建一个JFlow对象
   * @param {JFlowLayoutConfigs} configs - 配置项
   */
  function JFlow(configs) {
    var _this;

    _classCallCheck(this, JFlow);

    _this = _super.call(this);
    _this.uniqueName = 'jflow';
    /**
     * @member {EventAdapter} eventAdapter    - eventAdapter 对象
     **/

    _this.eventAdapter = new _adapter["default"](configs.eventAdapter);

    _this.initStack(configs);

    _this.initLayout(configs);
    /**
     * @member {Context2d} ctx        - Context2d 对象
     * @member {Element} canvas       - canvas 元素
     * @member {number} dpr           - 设备DPR
     * @member {number} padding       - 内边距
     */


    _this.ctx = null;
    _this.canvas = null;
    _this.dpr = 1;
    _this.padding = 20;
    /**
     * for zoom and pinch
     * @member {Context2d} position       - 平移位置
     * @member {Element} scale            - 当前缩放比
     * @member {number} maxZoom           - 最大缩放比
     * @member {number} minZoom           - 最小缩放比
     */

    _this.position = null;
    _this.scale = null;
    _this.initialZoom = configs.initialZoom;
    _this.maxZoom = configs.maxZoom || 3;
    _this.minZoom = configs.minZoom || .5; // this.initScale = 1;
    // this.initPosition = null

    _this.offeset = null;
    _this._lastState = {
      x: null,
      y: null,
      dragging: false,
      processing: false
    };
    _this._lastDragState = {
      target: null,
      targetLink: null,
      processing: false
    };
    _this._target = {
      instance: null,
      link: null,
      moving: null,
      isInstanceDirty: false,
      isLinkDirty: false,
      // isMovingDirty: false, 
      cache: {
        stack: null,
        belongs: null,
        point: null
      },
      meta: {
        x: undefined,
        y: undefined,
        initialX: undefined,
        initialY: undefined
      },
      status: {
        dragovering: false,
        dragging: false,
        processing: false
      }
    };
    _this._focus = {
      instance: null
    };
    _this._dragOverTarget = null; // this.lock = configs.lock;
    // this._belongs = 

    _this.allowDrop = configs.allowDrop;
    _this._tempInstance = null;
    return _this;
  }
  /**
   * 设置当前拖动的 JFlow 对象
   * @param {Instance} instance - JFlow 对象
   */


  _createClass(JFlow, [{
    key: "setTempDraggingInstance",
    value: function setTempDraggingInstance(instance) {
      instance._belongs = this;
      this._tempInstance = instance;
      Object.assign(this._target, {
        moving: [this._tempInstance],
        dragging: true
      });
    }
    /**
     * 取消当前拖动的 JFlow 对象
     * @return {number[]} point - JFlow 坐标
     */

  }, {
    key: "removeTempDraggingInstance",
    value: function removeTempDraggingInstance() {
      if (this._tempInstance) {
        // this.removeFromStack(this._tempInstance);
        var anchor = this._tempInstance.anchor;
        this._tempInstance = null;
        return anchor;
      }
    }
    /**
     * 在 Document 元素上初始化实例
     * @param {Element} dom 
     */

  }, {
    key: "$mount",
    value: function $mount(dom) {
      var _createCanvas = (0, _canvas.createCanvas)(dom),
          canvas = _createCanvas.canvas,
          ctx = _createCanvas.ctx,
          dpr = _createCanvas.scale,
          c_width = _createCanvas.width,
          c_height = _createCanvas.height,
          raw_width = _createCanvas.raw_width,
          raw_height = _createCanvas.raw_height,
          left = _createCanvas.left,
          top = _createCanvas.top;

      this.reflow();
      this.ctx = ctx;
      this.DOMwrapper = dom;
      this.canvas = canvas;
      this.canvasMeta = {
        width: raw_width,
        height: raw_height,
        actual_width: c_width,
        actual_height: c_height
      };
      this.dpr = dpr;

      this._createEventHandler();

      this._getBoundingGroupRect();

      var padding = this.padding;
      var _this$bounding_box = this.bounding_box,
          p_width = _this$bounding_box.width,
          p_height = _this$bounding_box.height,
          x = _this$bounding_box.x,
          y = _this$bounding_box.y;
      var contentBox = {
        x: padding,
        y: padding,
        width: c_width - padding * 2,
        height: c_height - padding * 2
      };
      var position = {
        x: 0,
        y: 0,
        offsetX: 0,
        offsetY: 0
      };
      var w_ratio = contentBox.width / p_width;
      var h_ratio = contentBox.height / p_height;
      var align = w_ratio <= h_ratio ? 'x' : 'y';
      var scaleRatio;

      if (this.initialZoom) {
        scaleRatio = this.initialZoom;
      } else {
        scaleRatio = Math.min(w_ratio, h_ratio);
      }

      this.scale = scaleRatio;

      if (scaleRatio > this.maxZoom) {
        this.maxZoom = scaleRatio;
      }

      if (scaleRatio < this.minZoom) {
        this.minZoom = scaleRatio;
      }

      position.x = align === 'x' ? contentBox.x : (contentBox.width - p_width * scaleRatio) / 2 + padding;
      position.y = align === 'y' ? contentBox.y : (contentBox.height - p_height * scaleRatio) / 2 + padding;
      position.offsetX = position.x - x * scaleRatio;
      position.offsetY = position.y - y * scaleRatio;
      this.position = position;

      this._render();
    }
  }, {
    key: "_getBoundingGroupRect",
    value: function _getBoundingGroupRect() {
      var points = this._stack.getBoundingRectPoints();

      if (this.bounding_box) {
        this.bounding_box = (0, _functions.bounding_box)(points);
        var _this$bounding_box2 = this.bounding_box,
            nowx = _this$bounding_box2.x,
            nowy = _this$bounding_box2.y;
        var scale = this.scale;
        this.position.x = this.position.offsetX + nowx * scale;
        this.position.y = this.position.offsetY + nowy * scale;
      } else {
        this.bounding_box = (0, _functions.bounding_box)(points);
      }
    }
  }, {
    key: "_createEventHandler",
    value: function _createEventHandler() {
      var _this2 = this;

      var canvas = this.canvas;
      var destroyListener;
      this.eventAdapter.apply(this);

      var destroyPlainEventListener = function destroyPlainEventListener() {
        _this2.eventAdapter.unload(_this2);
      };

      destroyListener = destroyPlainEventListener;

      if (this.allowDrop) {
        var dragoverHandler = this._onDragover.bind(this);

        var dropHandler = this._onDrop.bind(this);

        canvas.addEventListener('dragover', dragoverHandler);
        canvas.addEventListener('drop', dropHandler);

        destroyListener = function destroyListener() {
          destroyPlainEventListener();
          canvas.removeEventListener('dragover', dragoverHandler);
          canvas.removeEventListener('drop', dropHandler);
        };
      }

      this.destroy = destroyListener;
    }
  }, {
    key: "_targetLockOn",
    value: function _targetLockOn(offsetPoint, event) {
      var _this3 = this;

      var point = this._calculatePointBack(offsetPoint);

      var topLayerPoint = point;
      this._currentp = point;
      var stack = this._stack;
      var target = stack.checkHit(point, function (instance) {
        return _this3._target.status.dragging && instance === _this3._getMovingTarget();
      });
      var linkStack = this._linkStack;
      var belongs = this;

      if (target) {
        linkStack = target._belongs._linkStack;
        point = target._belongs._currentp;
        stack = target._belongs._stack;
        belongs = target._belongs;
      }

      var targetLink = linkStack.checkHit(point, function (link) {
        if (!_this3._target.status.dragging) {
          return false;
        }

        var movingtarget = _this3._getMovingTarget();

        return link.from === movingtarget || link.to === movingtarget;
      });
      Object.assign(this._target, {
        instance: target,
        link: targetLink,
        isInstanceDirty: target === this._target.instance,
        isLinkDirty: targetLink === this._target.link
      });
      Object.assign(this._target.cache, {
        stack: stack,
        belongs: belongs,
        point: point,
        topLayerPoint: topLayerPoint
      });
      Object.assign(this._target.meta, {
        x: offsetPoint[0],
        y: offsetPoint[1]
      });

      if (event === 'pressStart' && !this._target.status.dragging && !this._target.status.dragovering) {
        var movingtarget = target;

        while (movingtarget && movingtarget._belongs.lock && movingtarget !== this) {
          movingtarget = movingtarget._belongs;
        } // if(movingtarget === this) {
        //     movingtarget = undefined;
        // }


        if (movingtarget) {
          if (movingtarget._layoutNode) {
            if (movingtarget._layoutNode.isLocked) {
              movingtarget = movingtarget._layoutNode.getNodes();
            } else if (!movingtarget._layoutNode.isDraggable) {
              movingtarget = undefined;
            } else {
              movingtarget = [movingtarget];
            }
          } else {
            movingtarget = [movingtarget];
          }
        }

        Object.assign(this._target, {
          moving: movingtarget // isMovingDirty: movingtarget[0] === this._target.moving[0],

        });
      }

      return this._target;
    }
  }, {
    key: "_getMovingTarget",
    value: function _getMovingTarget() {
      return this._target.moving && this._target.moving[0];
    }
  }, {
    key: "_processDragOver",
    value: function _processDragOver(instance, event) {
      if (this._dragOverTarget !== instance) {
        var _this$readMessage;

        var target = (_this$readMessage = this.readMessage()) === null || _this$readMessage === void 0 ? void 0 : _this$readMessage.instance;
        this._dragCurrentData = target;

        if (this._dragOverTarget) {
          var oldIns = this._dragOverTarget;
          /**
          * dragleave 退出事件
          * @event Instance#dragleave
          * @type {object}
          * @property {Event} event           - 原始事件 
          * @property {Object} instance       - dragleave的对象 
          * @property {target} target         - drag 携带的对象（特指从外面拖进canvas的对象） 
          */

          oldIns.dispatchEvent(new _events["default"]('dragleave', {
            event: event,
            instance: oldIns,
            target: target
          }));
        }

        if (instance) {
          /**
          * dragenter 进入事件
          * @event Instance#dragenter
          * @type {object}
          * @property {Event} event           - 原始事件 
          * @property {Object} instance       - dragenter的对象 
          * @property {target} target         - drag 携带的对象（特指从外面拖进canvas的对象） 
          */
          instance.dispatchEvent(new _events["default"]('dragenter', {
            event: event,
            instance: instance,
            target: target
          }));
        }

        this._dragOverTarget = instance;
      } else if (this._dragOverTarget) {
        /**
        * dragover 进入事件
        * @event Instance#dragover
        * @type {object}
        * @property {Event} event           - 原始事件 
        * @property {Object} instance       - dragover的对象 
        * @property {target} target         - drag 携带的对象（特指从外面拖进canvas的对象） 
        */
        this._dragOverTarget.dispatchEvent(new _events["default"]('dragover', {
          event: event,
          instance: instance,
          target: this._dragCurrentData
        }));
      }
    }
  }, {
    key: "_onDragover",
    value: function _onDragover(event) {
      var _this4 = this;

      // console.log(event);
      event.preventDefault();
      event.stopPropagation();
      if (this._lastDragState.processing) return;
      this._lastDragState.processing = true;
      var offsetX = event.offsetX,
          offsetY = event.offsetY;
      Object.assign(this._target.status, {
        dragovering: true
      });

      this._targetLockOn([offsetX, offsetY]);

      var instance = this._target.instance || this._target.link;

      this._processDragOver(instance, event);

      if (this._target.isLinkDirty || this._target.isInstanceDirty) {
        Promise.resolve().then(function () {
          _this4._render();

          _this4._target.isLinkDirty = false;
          _this4._target.isInstanceDirty = false;
          _this4._lastDragState.processing = false;
        });
      } else {
        this._lastDragState.processing = false;
      }
    }
  }, {
    key: "_onDrop",
    value: function _onDrop(event) {
      var _this5 = this;

      var offsetX = event.offsetX,
          offsetY = event.offsetY,
          clientX = event.clientX,
          clientY = event.clientY;
      var payload = this.consumeMessage();
      var instance = payload.instance;

      if (this._dragOverTarget) {
        var oldIns = this._dragOverTarget;
        oldIns.dispatchEvent(new _events["default"]('dragoverend', {
          event: event,
          instance: oldIns
        }));
        this._dragOverTarget = null;
      }

      var _this$_target = this._target,
          link = _this$_target.link,
          target = _this$_target.instance;
      var _this$_target$cache = this._target.cache,
          point = _this$_target$cache.point,
          belongs = _this$_target$cache.belongs;

      if (link) {
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
        link.dispatchEvent(new _events["default"]('drop', {
          event: event,
          instance: instance,
          link: link,
          jflow: this,
          belongs: belongs,
          point: point
        }));
      } else if (target) {
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
        target.dispatchEvent(new _events["default"]('drop', {
          event: event,
          instance: instance,
          jflow: this,
          target: target,
          point: point
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
        this.dispatchEvent(new _events["default"]('drop', {
          event: event,
          instance: instance,
          jflow: this,
          target: target,
          point: point
        }));
      }

      requestAnimationFrame(function () {
        _this5._target.instance = null;
        _this5._target.link = null;
        Object.assign(_this5._target.status, {
          dragovering: false
        });
      });
    }
    /**
     * 缩放操作处理函数
     * @param {Number} offsetX - 事件对象与canvas的内填充边（padding edge）在 X 轴方向上的偏移量。
     * @param {Number} offsetY - 事件对象与canvas的内填充边（padding edge）在 Y 轴方向上的偏移量。 
     * @param {Number} deltaX  - 水平滚动量
     * @param {Number} deltaY  - 垂直滚动量
     * @param {Number} event - 原生事件
     */

  }, {
    key: "zoomHandler",
    value: function zoomHandler(offsetX, offsetY, deltaX, deltaY, event) {
      var _this6 = this;

      if (this._zooming) return;
      this._zooming = true;
      var _this$bounding_box3 = this.bounding_box,
          p_width = _this$bounding_box3.width,
          p_height = _this$bounding_box3.height,
          x = _this$bounding_box3.x,
          y = _this$bounding_box3.y;
      var newScale = this.scale;
      var amount = deltaY > 0 ? 1.1 : 1 / 1.1;
      newScale *= amount;

      if (this.maxZoom && newScale > this.maxZoom) {
        // could just return but then won't stop exactly at maxZoom
        newScale = this.maxZoom;
      }

      if (this.minZoom && newScale < this.minZoom) {
        newScale = this.minZoom;
      }

      var deltaScale = newScale - this.scale;
      var currentWidth = p_width * this.scale;
      var currentHeight = p_height * this.scale;
      var deltaWidth = p_width * deltaScale;
      var deltaHeight = p_height * deltaScale;
      var tX = offsetX - this.position.x;
      var tY = offsetY - this.position.y;
      var pX = -tX / currentWidth;
      var pY = -tY / currentHeight;
      this.scale = newScale;
      this.position.x += pX * deltaWidth;
      this.position.y += pY * deltaHeight;
      this.position.offsetX = this.position.x - x * newScale;
      this.position.offsetY = this.position.y - y * newScale;
      this.dispatchEvent(new _events["default"]('zoompan'));
      requestAnimationFrame(function () {
        _this6._render();

        _this6._zooming = false;
      });
    }
    /**
     * 平移画布操作处理函数
     * @param {Number} deltaX  - 水平滚动量
     * @param {Number} deltaY  - 垂直滚动量
     * @param {Number} event - 原生事件
     */

  }, {
    key: "panHandler",
    value: function panHandler(deltaX, deltaY, event) {
      var _this7 = this;

      if (this._panning) return;
      this._panning = true;

      this._recalculatePosition(deltaX, deltaY);
      /**
       * 缩放平移事件
       *
       * @event JFlow#zoompan
      */


      this.dispatchEvent(new _events["default"]('zoompan'));
      requestAnimationFrame(function () {
        _this7._render();

        _this7._panning = false;
      });
    }
    /**
     * 开始按压处理函数
     * @param {Number} offsetX - 事件对象与canvas的内填充边（padding edge）在 X 轴方向上的偏移量。
     * @param {Number} offsetY - 事件对象与canvas的内填充边（padding edge）在 Y 轴方向上的偏移量。 
     * @param {Number} event - 原生事件
     */

  }, {
    key: "pressStartHandler",
    value: function pressStartHandler(offsetX, offsetY, event) {
      this._targetLockOn([offsetX, offsetY], 'pressStart');

      Object.assign(this._target.meta, {
        initialX: offsetX,
        initialY: offsetY
      });
      Object.assign(this._target.status, {
        dragging: true,
        processing: false
      });

      if (this._target.moving) {
        var moving = this._getMovingTarget();
        /**
         * 开始拖动组的事件（特指lock的顶层组）
         *
         * @event Node#pressStart
         * @type {object}
         * @property {Event} event           - 原始事件 
         * @property {Node} instance       - 拖动的对象 
         * @property {JFlow} jflow           - 当前JFlow对象 
         */


        moving.dispatchEvent(new _events["default"]('pressStart', {
          event: event,
          instance: moving,
          jflow: this
        }));
      }

      if (this._target.instance) {
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
        var t = this._target.instance;
        t.bubbleEvent(new _events["default"]('instancePressStart', {
          event: event,
          target: t,
          jflow: this,
          bubbles: true
        }));
      }
    }
    /**
     * 按压中处理函数
     * @param {Number} offsetX - 事件对象与canvas的内填充边（padding edge）在 X 轴方向上的偏移量。
     * @param {Number} offsetY - 事件对象与canvas的内填充边（padding edge）在 Y 轴方向上的偏移量。 
     * @param {Number} event - 原生事件
     */

  }, {
    key: "pressMoveHandler",
    value: function pressMoveHandler(offsetX, offsetY, event) {
      var _this8 = this;

      var _this$_target$status = this._target.status,
          dragging = _this$_target$status.dragging,
          processing = _this$_target$status.processing;
      var _this$_target$meta = this._target.meta,
          x = _this$_target$meta.x,
          y = _this$_target$meta.y;
      this.canvas.style.cursor = 'default';

      if (!dragging && !processing) {
        var _this$_targetLockOn = this._targetLockOn([offsetX, offsetY]),
            _link = _this$_targetLockOn.link,
            _instance = _this$_targetLockOn.instance;

        if (_instance) {
          /**
          * instance mousemove 原生事件
          *
          * @event JFlow#instancemousemove
          * @type {object}
          * @property {Event} event           - 原始事件
          * @property {Node} instance           - 原始事件
          * @property {JFlow} jflow           - 当前JFlow对象 
          */
          _instance.dispatchEvent(new _events["default"]('instancemousemove', {
            event: event,
            instance: _instance,
            jflow: this
          }));
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


      this.dispatchEvent(new _events["default"]('canvasmousemove', {
        event: event,
        jflow: this
      }));
      if (!dragging) return;
      this.canvas.style.cursor = 'grabbing';
      if (processing) return;
      var movingtarget = this._target.moving; // this._tempInstance ? [this._tempInstance] : this._target.moving;

      this._target.status.processing = true;
      var deltaX = offsetX - x;
      var deltaY = offsetY - y;

      if (movingtarget) {
        movingtarget.forEach(function (t) {
          t.anchor[0] += deltaX / _this8.scale;
          t.anchor[1] += deltaY / _this8.scale;
        });
      } else {
        this._recalculatePosition(deltaX, deltaY);

        this.dispatchEvent(new _events["default"]('zoompan'));
      }

      var _this$_targetLockOn2 = this._targetLockOn([offsetX, offsetY]),
          instance = _this$_targetLockOn2.instance,
          link = _this$_targetLockOn2.link;

      this._processDragOver(instance || link, event);

      requestAnimationFrame(function () {
        _this8._render();

        _this8._target.isLinkDirty = false;
        _this8._target.isInstanceDirty = false;
        _this8._target.status.processing = false;
      });
    }
    /**
     * 按压结束处理函数
     * @param {Boolean} isDocument - 是否为 document 触发
     * @param {Number} event - 原生事件
     */

  }, {
    key: "pressUpHanlder",
    value: function pressUpHanlder(isDocument, event) {
      var meta = this._target.meta;

      if (meta.initialX === meta.x && meta.initialY === meta.y) {
        if (event.target !== this.canvas) {
          this._clearTarget();

          return;
        }

        if (this._target.instance && !isDocument) {
          var t = this._target.instance;
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

          t.bubbleEvent(new _events["default"]('click', {
            event: event,
            target: t,
            jflow: this,
            bubbles: true
          }));

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
          this.dispatchEvent(new _events["default"]('click', {
            event: event,
            jflow: this
          }));

          this._clearTarget();

          this._render();

          return;
        }
      } else if (this._target.moving) {
        var checkresult = false;

        if (this._layout["static"]) {
          checkresult = this.staticCheck(this._getMovingTarget());
        }

        if (!checkresult && this._target.link) {
          var _this$_target$cache2 = this._target.cache,
              point = _this$_target$cache2.point,
              belongs = _this$_target$cache2.belongs;
          var link = this._target.link;

          var instance = this._getMovingTarget();
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


          link.dispatchEvent(new _events["default"]('drop', {
            event: event,
            instance: instance,
            link: link,
            jflow: this,
            belongs: belongs
          }));
          this._target.link = null;
          this._target.instance = null;
        }

        if (this._target.moving) {
          if (this._target.instance) {
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
            console.log('pressEnd', this._target.instance);

            this._target.instance.bubbleEvent(new _events["default"]('pressEnd', {
              event: event,
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
            this.dispatchEvent(new _events["default"]('pressEnd', {
              event: event,
              instance: this._getMovingTarget(),
              jflow: this
            }));
          }
        }

        this._target.moving = null;
        this.removeTempDraggingInstance(); // this._target.isMovingDirty = false;

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

  }, {
    key: "contextMenuHanlder",
    value: function contextMenuHanlder(offsetX, offsetY, event) {
      var _this$_targetLockOn3 = this._targetLockOn([offsetX, offsetY]),
          link = _this$_targetLockOn3.link,
          instance = _this$_targetLockOn3.instance;

      var topLayerPoint = this._target.cache.topLayerPoint;

      if (instance || link) {
        var target = instance || link;
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

        target.bubbleEvent(new _events["default"]('contextclick', {
          event: event,
          jflow: this,
          target: target,
          topLayerPoint: topLayerPoint,
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
        this.dispatchEvent(new _events["default"]('contextclick', {
          event: event,
          jflow: this,
          topLayerPoint: topLayerPoint
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

  }, {
    key: "_clearTarget",
    value: function _clearTarget() {
      Object.assign(this._target.meta, {
        x: undefined,
        y: undefined,
        initialX: undefined,
        initialY: undefined
      });
      Object.assign(this._target.status, {
        dragging: false,
        processing: false
      });
      Object.assign(this._target, {
        instance: null,
        link: null,
        moving: null
      });
    }
  }, {
    key: "_recalculatePosition",
    value: function _recalculatePosition(deltaX, deltaY, scale) {
      var _this$bounding_box4 = this.bounding_box,
          x = _this$bounding_box4.x,
          y = _this$bounding_box4.y;

      if (scale === undefined) {
        scale = this.scale;
      }

      this.position.x += deltaX;
      this.position.y += deltaY;
      this.position.offsetX = this.position.x - x * scale;
      this.position.offsetY = this.position.y - y * scale;
    }
  }, {
    key: "calculateToRealWorld",
    value: function calculateToRealWorld(p) {
      var scale = this.scale;
      var position = this.position;
      return [p[0] * scale + position.offsetX, p[1] * scale + position.offsetY];
    }
  }, {
    key: "_calculatePointBack",
    value: function _calculatePointBack(p) {
      var scale = this.scale;
      var position = this.position;
      return [(p[0] - position.offsetX) / scale, (p[1] - position.offsetY) / scale];
    }
  }, {
    key: "_calculateDistance",
    value: function _calculateDistance(l) {
      var scale = this.scale;
      return scale * l;
    }
  }, {
    key: "_resetTransform",
    value: function _resetTransform() {
      var _this$canvasMeta = this.canvasMeta,
          c_width = _this$canvasMeta.width,
          c_height = _this$canvasMeta.height;
      var position = this.position;
      var scale = this.scale;
      var ctx = this.ctx;
      ctx.setTransform();
      ctx.clearRect(0, 0, c_width, c_height);
      ctx.scale(this.dpr, this.dpr);
      ctx.transform(scale, 0, 0, scale, position.offsetX, position.offsetY);
    }
    /**
    * 绘制画布
    */

  }, {
    key: "_render",
    value: function _render() {
      this._resetTransform();

      var ctx = this.ctx;

      this._stack.render(ctx);

      this._linkStack.render(ctx);

      if (this._tempInstance) {
        ctx.save();

        this._tempInstance.render(ctx);

        ctx.restore();
      }
    }
  }]);

  return JFlow;
}( /*#__PURE__*/_wrapNativeSuper(EventTarget));

Object.assign(JFlow.prototype, _messageMixin["default"]);
Object.assign(JFlow.prototype, _stackMixin["default"]);
Object.assign(JFlow.prototype, _layoutMixin["default"]);
var _default = JFlow;
exports["default"] = _default;
//# sourceMappingURL=index.js.map
