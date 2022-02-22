"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  JFlowVuePlugin: true
};
Object.defineProperty(exports, "JFlowVuePlugin", {
  enumerable: true,
  get: function get() {
    return _JFlowPlugin["default"];
  }
});

var _flow = require("./core/flow");

Object.keys(_flow).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _flow[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _flow[key];
    }
  });
});

var _JFlowPlugin = _interopRequireDefault(require("./vue-plugin/JFlowPlugin.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
//# sourceMappingURL=index.js.map
