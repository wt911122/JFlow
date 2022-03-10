"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * 事件处理函数
 * @name EventAdapter~Handler
 * @function
 * @param {Event} event - 原生事件
 * @param {JFlow} jflow - 当前jflow 对象
 */

/**
 * EventAdapter 对象 plugin 配置
 * @typedef {Object} EventAdapter~pluginDef
 * @property {Object} canvas - canvas 相关的事件
 * @property {EventAdapter~Handler} canvas.eventName - 注册 canvas 上的事件处理
 * @property {Object} document - document 相关的事件
 * @property {EventAdapter~Handler} document.eventName - 注册 document 上的事件处理
 */
function getDefaultPlugin() {
  return {
    canvas: {
      wheel: function wheel(event, jflow) {
        event.preventDefault();
        var offsetX = event.offsetX,
            offsetY = event.offsetY,
            deltaX = event.deltaX,
            deltaY = event.deltaY;

        if (event.ctrlKey) {
          deltaY = -deltaY;
          jflow.zoomHandler(offsetX, offsetY, deltaX, deltaY, event);
        } else {
          jflow.panHandler(-deltaX, -deltaY, event);
        }
      },
      pointerdown: function pointerdown(event, jflow) {
        var offsetX = event.offsetX,
            offsetY = event.offsetY,
            deltaY = event.deltaY,
            button = event.button;
        if (button !== 0) return;
        jflow.pressStartHandler(offsetX, offsetY, event);
      },
      pointermove: function pointermove(event, jflow) {
        var offsetX = event.offsetX,
            offsetY = event.offsetY;
        jflow.pressMoveHandler(offsetX, offsetY, event);
      },
      pointerup: function pointerup(event, jflow) {
        event.preventDefault();
        event.stopPropagation();
        var button = event.button;
        if (button !== 0) return;
        jflow.pressUpHanlder(false, event);
      },
      contextmenu: function contextmenu(event, jflow) {
        event.preventDefault();
        event.stopPropagation();
        var offsetX = event.offsetX,
            offsetY = event.offsetY;
        jflow.contextMenuHanlder(offsetX, offsetY, event);
      }
    },
    document: {
      pointerup: function pointerup(event, jflow) {
        jflow.pressUpHanlder(true, event);
      }
    }
  };
}
/** 
 * EventAdapter 对象
 * EventAdapter 通过 plugin 的形式实现多种交互方式的映射
 * @constructor EventAdapter
 */


var EventAdapter = /*#__PURE__*/function () {
  function EventAdapter() {
    var plugin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, EventAdapter);

    this.plugin = getDefaultPlugin();
    this.use(plugin);
    this.canvasHandlers = [];
    this.documentHandlers = [];
  }

  _createClass(EventAdapter, [{
    key: "use",
    value: function use() {
      var plugin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var ca = plugin.canvas,
          docObj = plugin.document;

      if (ca) {
        for (var eventName in ca) {
          if (ca.hasOwnProperty(eventName)) {
            this.plugin.canvas[eventName] = ca[eventName];
          }
        }
      }

      if (docObj) {
        for (var _eventName in docObj) {
          if (docObj.hasOwnProperty(_eventName)) {
            this.plugin.document[_eventName] = docObj[_eventName];
          }
        }
      }
    }
  }, {
    key: "apply",
    value: function apply(jflow) {
      var _this = this;

      var _this$plugin = this.plugin,
          ca = _this$plugin.canvas,
          docObj = _this$plugin.document;
      var canvas = jflow.canvas;

      var _loop = function _loop(eventName) {
        var handler = ca[eventName];

        function handlerWrapperd(e) {
          handler(e, jflow);
        }

        canvas.addEventListener(eventName, handlerWrapperd);

        _this.canvasHandlers.push({
          eventName: eventName,
          handlerWrapperd: handlerWrapperd
        });
      };

      for (var eventName in ca) {
        _loop(eventName);
      }

      var _loop2 = function _loop2(_eventName2) {
        var handler = docObj[_eventName2];

        function handlerWrapperd(e) {
          handler(e, jflow);
        }

        document.addEventListener(_eventName2, handlerWrapperd);

        _this.documentHandlers.push({
          eventName: _eventName2,
          handlerWrapperd: handlerWrapperd
        });
      };

      for (var _eventName2 in docObj) {
        _loop2(_eventName2);
      }
    }
  }, {
    key: "unload",
    value: function unload(jflow) {
      var canvas = jflow.canvas;
      this.canvasHandlers.forEach(function (_ref) {
        var eventName = _ref.eventName,
            handlerWrapperd = _ref.handlerWrapperd;
        canvas.removeEventListener(eventName, handlerWrapperd);
      });
      this.documentHandlers.forEach(function (_ref2) {
        var eventName = _ref2.eventName,
            handlerWrapperd = _ref2.handlerWrapperd;
        document.removeEventListener(eventName, handlerWrapperd);
      });
    }
  }]);

  return EventAdapter;
}();

var _default = EventAdapter;
exports["default"] = _default;
//# sourceMappingURL=adapter.js.map
