"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  canvas: {
    wheel: function wheel(event, jflow) {
      event.preventDefault();
      var offsetX = event.offsetX,
          offsetY = event.offsetY,
          deltaX = event.deltaX,
          deltaY = event.deltaY;

      if (event.ctrlKey) {
        deltaY = -deltaY;
      }

      jflow.zoomHandler(offsetX, offsetY, deltaX, deltaY, event);
    }
  }
};
exports["default"] = _default;
//# sourceMappingURL=commonAdapter.js.map
