"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _erNode = require("./er-node");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
    ER layout

    Entity Relationship Structure
    tree = [
        {
            type: 'node',
            id: 'uniqueID',
            properties: [
                {
                    name: 'xxxx',
                    ref: someUniqueId,
                    description: 'xxxxxx',
                },
                ...
            ]
        },
        ...
    ]
    
    * @implements {Layout}
 */
var ERLayout = /*#__PURE__*/function () {
  function ERLayout(configs) {
    _classCallCheck(this, ERLayout);

    this["static"] = false;
    this.flowStack = [];
    this.flowLinkStack = [];
    this.erNodes = [];
    this.reOrder(configs.entityRelationship);
  }
  /**
   * 从 tree 计算布局
   * @param {AstNode} tree - ER 树
   */


  _createClass(ERLayout, [{
    key: "reOrder",
    value: function reOrder(er, root) {
      var _this = this;

      this.er = er;
      this.flowStack = [];
      this.flowLinkStack = [];
      var nodes = (0, _erNode.makeER)(this.er);
      var idMap = [];
      nodes.forEach(function (node) {
        node.traverse(function (n) {
          _this.flowStack.push({
            type: n.type,
            configs: n.source,
            layoutMeta: n
          });
        });
        node.makeLink(function (configs) {
          var property = configs.from,
              toProperty = configs.to,
              meta = configs.meta;

          if (meta.isObjectRef) {
            var id1 = "".concat(property, "-").concat(toProperty);
            var id2 = "".concat(toProperty, "-").concat(property);
            var fromMeta = meta.from;

            if (idMap.includes(id1) || idMap.includes(id2)) {
              return;
            }

            if (!fromMeta.source.isParentRef) {
              idMap.push(id1);
              idMap.push(id2);

              _this.flowLinkStack.push(configs);
            }
          } else {
            _this.flowLinkStack.push(configs);
          }
        });
      });
      this.erNodes = nodes;
    }
  }, {
    key: "staticCheck",
    value: function staticCheck(instance, jflow) {
      return false;
    }
  }, {
    key: "reflow",
    value: function reflow(jflow) {
      var links = this.flowLinkStack;
      var nodes = this.erNodes;
      var x = 0;
      var lineMapping = {};
      var size = 1000;

      function computeNodeAnchor(node) {
        var recorded = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var relativeAnchor = [0, 0];

        if (node.parentRef) {
          if (recorded.includes(node.parentRef)) {
            // debugger;
            return [relativeAnchor[0] - size / 2 + node.source.diagramWeight * size, relativeAnchor[1]];
          }

          recorded.push(node.parentRef);
          relativeAnchor = computeNodeAnchor(node.parentRef, recorded);
          return [relativeAnchor[0] - size / 2 + node.source.diagramWeight * size, relativeAnchor[1] + 600];
        } else {
          return relativeAnchor;
        }
      }

      this.erNodes.forEach(function (node) {
        var instance = node.getJflowInstance();

        var _computeNodeAnchor = computeNodeAnchor(node),
            _computeNodeAnchor2 = _slicedToArray(_computeNodeAnchor, 2),
            nx = _computeNodeAnchor2[0],
            ny = _computeNodeAnchor2[1];

        if (!lineMapping[ny]) {
          lineMapping[ny] = [];
        }

        lineMapping[ny].push(node);
        instance.anchor = [nx + lineMapping[ny].length * 500, ny];
        x += 300;
      }); // debugger
      // // Kahn’s Algorithm
      // // Calcuate the incoming degree of each vertex
      // const vertices = nodes.slice();
      // debugger
      // const inDegree = {};
      // vertices.forEach(v => {
      //     v.adjacencyList.forEach(p => {
      //         const name = p.name;
      //         inDegree[name] = inDegree[name] + 1 || 1;
      //     })
      // })
      // console.log(inDegree)
      // debugger
      // // Create a queue which stores the vertex without dependencies
      // const queue = vertices.filter((v) => !inDegree[v.name]);
      // console.log(queue)
      // debugger
      // const topNums = {};
      // let index = 0;
      // while (queue.length) {
      //     const v = queue.shift();
      //     topNums[v.name] = index++;
      //     v.adjacencyList.forEach(neighbor => {
      //         const name = neighbor.name;
      //         inDegree[name]--;
      //         if (inDegree[name] === 0) {
      //             queue.push(neighbor);
      //         }
      //     });
      // }
      // if (index !== vertices.length) {
      //     console.log("Detect a cycle");
      // }
      // console.log(topNums);
    }
  }]);

  return ERLayout;
}();

var _default = ERLayout;
exports["default"] = _default;
//# sourceMappingURL=er-layout.js.map
