"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DIRECTION = exports.APPROXIMATE = void 0;
exports.nextDirection = nextDirection;
exports.oppositeDirection = oppositeDirection;

/**
 * 方向
 * @readonly
 * @enum {number}
 */
var DIRECTION = {
  /** RIGHT */
  RIGHT: 0,

  /** BOTTOM */
  BOTTOM: 1,

  /** LEFT */
  LEFT: 2,

  /** TOP */
  TOP: 3,

  /** SELF */
  SELF: 100
};
exports.DIRECTION = DIRECTION;

function nextDirection(direction, clockwise) {
  var nextDir = (direction + (clockwise ? 1 : -1)) % 4;
  return nextDir;
}

function oppositeDirection(direction) {
  return (direction + 2) % 4;
}

var APPROXIMATE = 6;
exports.APPROXIMATE = APPROXIMATE;
//# sourceMappingURL=constance.js.map
