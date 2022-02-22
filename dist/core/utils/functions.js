"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bezierPoint = bezierPoint;
exports.bezierPoints = bezierPoints;
exports.bounding_box = bounding_box;
exports.dist2 = dist2;
exports.distToBezierSegmentSquared = distToBezierSegmentSquared;
exports.distToSegmentSquared = distToSegmentSquared;
exports.getBezierAngle = getBezierAngle;
exports.getInstanceHeight = getInstanceHeight;
exports.makeRadiusFromVector = makeRadiusFromVector;
exports.minIntersectionBetweenNodes = minIntersectionBetweenNodes;
exports.polylinePoints = polylinePoints;

var _bezierJs = require("bezier-js");

var _constance = require("./constance");

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * 根据点计算最小外接矩形
 * @param {number[][]} points - 点集合
 * @return {Object} demension 宽高，坐标
 */
function bounding_box(points) {
  var min_x = Infinity;
  var min_y = Infinity;
  var max_x = -Infinity;
  var max_y = -Infinity;

  for (var idx in points) {
    var item = points[idx];

    if (item[0] < min_x) {
      min_x = item[0];
    }

    if (item[0] > max_x) {
      max_x = item[0];
    }

    if (item[1] < min_y) {
      min_y = item[1];
    }

    if (item[1] > max_y) {
      max_y = item[1];
    }
  }

  return {
    // points: [(min_x,min_y),(max_x,min_y),(max_x,max_y),(min_x,max_y)],
    width: Math.max(max_x - min_x, 10),
    height: Math.max(max_y - min_y, 10),
    x: min_x,
    y: min_y
  };
}

function sqr(x) {
  return x * x;
}

function dist2(v, w) {
  return sqr(v[0] - w[0]) + sqr(v[1] - w[1]);
} // p - point
// v - start point of segment
// w - end point of segment


function distToSegmentSquared(p, v, w) {
  var l2 = dist2(v, w);
  if (l2 === 0) return dist2(p, v);
  var t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
  t = Math.max(0, Math.min(1, t));
  return dist2(p, [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])]);
}

function minIntersectionBetweenNodes(dmsfrom, dmsto) {
  var meta = {
    fromDir: null,
    fromP: null,
    toDir: null,
    toP: null,
    distMin: Infinity
  };
  Object.keys(dmsfrom).forEach(function (df) {
    if (+df === _constance.DIRECTION.SELF) {
      return;
    }

    var pf = dmsfrom[df];
    Object.keys(dmsto).forEach(function (dt) {
      if (+dt === _constance.DIRECTION.SELF) {
        return;
      }

      var pt = dmsto[dt];
      var dist = dist2(pf, pt);

      if (dist < meta.distMin) {
        Object.assign(meta, {
          distMin: dist,
          fromDir: +df,
          fromP: pf,
          toDir: +dt,
          toP: pt
        });
      }
    });
  });
  return meta;
} // export function bezierPoints(p1, p2, start_dir = DIRECTION.TOP, end_dir = DIRECTION.TOP, anticlock = false) {
//     const isSameDirection = start_dir === end_dir;
//     const isVerticalStart = [DIRECTION.TOP, DIRECTION.BOTTOM].includes(start_dir);   
//     const isVerticalEnd = [DIRECTION.TOP, DIRECTION.BOTTOM].includes(end_dir);
//     const arrowspan = [DIRECTION.TOP, DIRECTION.LEFT].includes(end_dir) ? -5 : 5;
//     const endX = isVerticalEnd ? p2[0] : p2[0] + arrowspan;
//     const endY = isVerticalEnd ? p2[1] + arrowspan : p2[1];
//     if(isSameDirection) {
//         let span = Math.abs(isVerticalStart ? (endY - p1[1]) : (endX - p1[0]))
//         span = Math.min(span, 50);
//         const symb = [DIRECTION.RIGHT, DIRECTION.BOTTOM].includes(end_dir)
//         span = symb ? span : - span;
//         const cp1 = isVerticalStart ? [p1[0], p1[1] + span] : [p1[0] + span, p1[1]];
//         const cp2 = isVerticalEnd ? [endX, endY + span] : [endX + span, endY];
//         return [ 
//             ...cp1,
//             ...cp2,
//             endX, endY ];
//     }
//     let spanStart = (anticlock ? -5 : 1) * (isVerticalStart ? (endY - p1[1]) / 2 : (endX - p1[0]) / 2)
//     let spanEnd = (anticlock ? -4 : 1) * (isVerticalEnd ? (p1[1] - endY) / 2 : (p1[0] - endX) / 2)
//     let u1 = spanStart / Math.abs(spanStart);
//     spanStart = u1 * Math.min(Math.abs(spanStart), 50);
//     let u2 = spanEnd / Math.abs(spanEnd);
//     spanEnd = u2 * Math.min(Math.abs(spanEnd), 50);
//     const cp1 = isVerticalStart ? [p1[0], p1[1] + spanStart] : [p1[0] + spanStart, p1[1]];
//     const cp2 = isVerticalEnd ? [endX, endY + spanEnd] : [endX + spanEnd, endY];
//     return [ 
//         ...cp1,
//         ...cp2,
//         endX, endY ];
// }


function _resolveControlPoint(p, dir, spanx, spany) {
  if (dir === _constance.DIRECTION.TOP) {
    return [p[0], p[1] - spany];
  }

  if (dir === _constance.DIRECTION.BOTTOM) {
    return [p[0], p[1] + spany];
  }

  if (dir === _constance.DIRECTION.LEFT) {
    return [p[0] - spanx, p[1]];
  }

  if (dir === _constance.DIRECTION.RIGHT) {
    return [p[0] + spanx, p[1]];
  }
}

function bezierPoints(p1, p2) {
  var start_dir = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _constance.DIRECTION.TOP;
  var end_dir = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _constance.DIRECTION.TOP;
  var minSpanX = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var minSpanY = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  var spanx = Math.max(Math.abs((p1[0] - p2[0]) / 2), minSpanX);
  var spany = Math.max(Math.abs((p1[1] - p2[1]) / 2), minSpanY);

  var cp1 = _resolveControlPoint(p1, start_dir, spanx, spany);

  var cp2 = _resolveControlPoint(p2, end_dir, spanx, spany);

  var arrowspan = [_constance.DIRECTION.TOP, _constance.DIRECTION.LEFT].includes(end_dir) ? -5 : 5;
  var isVerticalEnd = [_constance.DIRECTION.TOP, _constance.DIRECTION.BOTTOM].includes(end_dir);
  var endX = isVerticalEnd ? p2[0] : p2[0] + arrowspan;
  var endY = isVerticalEnd ? p2[1] + arrowspan : p2[1];
  return [].concat(_toConsumableArray(cp1), _toConsumableArray(cp2), [endX, endY]);
}

function bezierPoint(t, P) {
  var q = 1 - t;
  var x = q * q * q * P[0] + 3 * q * q * t * P[2] + 3 * q * t * t * P[4] + t * t * t * P[6];
  var y = q * q * q * P[1] + 3 * q * q * t * P[3] + 3 * q * t * t * P[5] + t * t * t * P[7];
  var u = q * q * (P[2] - P[0]) + 2 * t * q * (P[4] - P[2]) + t * t * (P[6] - P[4]);
  var v = q * q * (P[3] - P[1]) + 2 * t * q * (P[5] - P[3]) + t * t * (P[7] - P[5]);
  var angle = Math.atan2(v, u); // console.log(angle * 180)
  // if(angle < 0) {
  //     angle = Math.PI + angle;
  // }

  return [x, y, angle];
} // export function bezierPoints(p1, p2, start_vec, end_vec) {
// }


function distToBezierSegmentSquared(p, points) {
  var b = _construct(_bezierJs.Bezier, _toConsumableArray(points));

  var point = b.project({
    x: p[0],
    y: p[1]
  });
  var d = dist2(p, [point.x, point.y]);
  return d;
}

function getBezierAngle(t, sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey) {
  var dx = Math.pow(1 - t, 2) * (cp1x - sx) + 2 * t * (1 - t) * (cp2x - cp1x) + t * t * (ex - cp2x);
  var dy = Math.pow(1 - t, 2) * (cp1y - sy) + 2 * t * (1 - t) * (cp2y - cp1y) + t * t * (ey - cp2y);
  return -Math.atan2(dx, dy) + 0.5 * Math.PI;
}

function getInstanceHeight(instance) {
  var rect = instance.getBoundingRect();
  var min_y = Infinity;
  var max_y = -Infinity;
  var min_x = Infinity;
  var max_x = -Infinity;
  rect.forEach(function (point) {
    max_y = Math.max(max_y, point[1]);
    min_y = Math.min(min_y, point[1]);
    max_x = Math.max(max_x, point[0]);
    min_x = Math.min(min_x, point[0]);
  });
  return {
    height: max_y - min_y,
    width: max_x - min_x
  };
}

function polylinePoints(p1, p2) {
  var start_dir = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _constance.DIRECTION.TOP;
  var end_dir = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _constance.DIRECTION.TOP;
  var minSpanX = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 10;
  var minSpanY = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 10;
  var isSelf = arguments.length > 6 ? arguments[6] : undefined;
  var dirSpan = Math.abs(start_dir - end_dir); // const spanx = Math.max(Math.abs((p1[0] - p2[0])/2), minSpanX);
  // const spany = Math.max(Math.abs((p1[1] - p2[1])/2), minSpanY);

  var isVerticalStart = start_dir === _constance.DIRECTION.TOP || start_dir === _constance.DIRECTION.BOTTOM;
  var points = [];

  switch (dirSpan) {
    case 0:
      // 都按向右好了
      if (start_dir === _constance.DIRECTION.TOP) {
        var y = Math.min(p1[1], p2[1]);
        var yp = y - minSpanY;
        points.push([p1[0], yp]);
        points.push([p2[0], yp]);
      }

      if (start_dir === _constance.DIRECTION.BOTTOM) {
        var _y = Math.max(p1[1], p2[1]);

        var _yp = _y + minSpanY;

        points.push([p1[0], _yp]);
        points.push([p2[0], _yp]);
      }

      if (start_dir === _constance.DIRECTION.LEFT) {
        var x = Math.min(p1[0], p2[0]);
        var xp = x - minSpanX;
        points.push([xp, p1[1]]);
        points.push([xp, p2[1]]);
      }

      if (start_dir === _constance.DIRECTION.RIGHT) {
        var _x = Math.max(p1[0], p2[0]);

        var _xp = _x + minSpanX;

        points.push([_xp, p1[1]]);
        points.push([_xp, p2[1]]);
      }

      break;

    case 1:
    case 3:
      if (isSelf) {
        if (!isVerticalStart) {
          points.push([p1[0] + minSpanX, p1[1]]);
          points.push([p1[0] + minSpanX, p2[1] + minSpanY]);
          points.push([p2[0], p2[1] + minSpanY]);
        } else {
          points.push([p1[0], p1[1] + minSpanY]);
          points.push([p2[0] + minSpanX, p1[1] + minSpanY]);
          points.push([p2[0] + minSpanX, p2[1]]);
        }
      } else {
        var point = isVerticalStart ? [p1[0], p2[1]] : [p2[0], p1[1]];
        points.push(point);
      }

      break;

    case 2:
      var pmiddle = [(p1[0] - p2[0]) / 2 + p2[0], (p1[1] - p2[1]) / 2 + p2[1]];

      if (isVerticalStart) {
        points.push([p1[0], pmiddle[1]]);
        points.push([p2[0], pmiddle[1]]);
      } else {
        points.push([pmiddle[0], p1[1]]);
        points.push([pmiddle[0], p2[1]]);
      }

      break;

    default:
      break;
  }

  points.unshift(p1);
  points.push(p2);
  return points;
}

function minusVec(p1, p2) {
  return [p1[0] - p2[0], p1[1] - p2[1]];
}

function absVec(vec) {
  return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
}

function scaleVec(vec, scale) {
  return [vec[0] * scale, vec[1] * scale];
}

function makeRadiusFromVector(pbefore, p, pnext, radius) {
  var vec1 = minusVec(p, pbefore);
  var vec2 = minusVec(p, pnext);
  var absVec1 = absVec(vec1);
  var absVec2 = absVec(vec2);

  if (!absVec1 || !absVec2) {
    return {
      p1: null,
      p2: null
    };
  }

  var r1 = scaleVec(vec1, radius / absVec1);
  var r2 = scaleVec(vec2, radius / absVec2);
  return {
    p1: minusVec(p, r1),
    p2: minusVec(p, r2)
  };
}
//# sourceMappingURL=functions.js.map
