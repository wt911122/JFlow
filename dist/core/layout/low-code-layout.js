"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _events = _interopRequireDefault(require("../events"));

var _constance = require("../utils/constance");

var _baseNode = require("./low-code-types/baseNode");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function sqr(x) {
  return x * x;
}

function dist2(v, w) {
  return sqr(v[0] - w[0]) + sqr(v[1] - w[1]);
}
/**
    lowcode layout

    type: 
        + IfStatement,
        + SwitchStatement,
        + SwitchCase,
        + ForEachStatement,
        + WhileStatement,
        + Root,
        + other,
    
    * @implements {Layout}
 */


var LowcodeLayout = /*#__PURE__*/function () {
  function LowcodeLayout(configs) {
    var _configs$treeItemDrag;

    _classCallCheck(this, LowcodeLayout);

    this.linkLength = configs.linkLength || 18;
    this.gap = configs.gap || 30;
    this.treeItemDraggable = (_configs$treeItemDrag = configs.treeItemDraggable) !== null && _configs$treeItemDrag !== void 0 ? _configs$treeItemDrag : true;
    this.reOrder(configs.ast);
    this["static"] = true;
  }
  /**
   * 从 ast 计算布局
   * @param {AstNode} ast - ASL 树
   */


  _createClass(LowcodeLayout, [{
    key: "reOrder",
    value: function reOrder(ast) {
      var _this = this;

      this.ast = ast;
      this.flowStack = [];
      this.flowLinkStack = [];
      this.root = (0, _baseNode.makeAST)(this.ast); // new AstNode(this.ast, this.flowStack, true);

      this.root.traverse(function (node) {
        if (node.parentIterateType !== 'playground') {
          node.isDraggable = _this.treeItemDraggable;
        }

        _this.flowStack.push({
          type: node.type,
          configs: node.source,
          layoutMeta: node
        });
      });
      var layoutMapping = {
        vertical: {},
        horizontal: {}
      };
      var playgroundLayoutMapping = {};
      this.root.reflowBodyPreCalculate(0, 0, function (level, sequence, node) {
        if (!node.isroot) {
          if (!layoutMapping.vertical[level]) {
            layoutMapping.vertical[level] = {};
          }

          layoutMapping.vertical[level][sequence] = node;

          if (!layoutMapping.horizontal[sequence]) {
            layoutMapping.horizontal[sequence] = {};
          }

          layoutMapping.horizontal[sequence][level] = node;
        }
      });
      var currentTopNodeId;
      this.root.reflowPlaygroundPreCalculate(function (topNode) {
        currentTopNodeId = topNode.id;
        playgroundLayoutMapping[topNode.id] = {
          vertical: {},
          horizontal: {},
          node: topNode
        };
      }, function (level, sequence, node) {
        var layoutMapping = playgroundLayoutMapping[currentTopNodeId];

        if (!layoutMapping.vertical[level]) {
          layoutMapping.vertical[level] = {};
        }

        layoutMapping.vertical[level][sequence] = node;

        if (!layoutMapping.horizontal[sequence]) {
          layoutMapping.horizontal[sequence] = {};
        }

        layoutMapping.horizontal[sequence][level] = node;
      });
      this.layoutMapping = layoutMapping;
      this.playgroundLayoutMapping = playgroundLayoutMapping;
      this.root.makeLink(function (configs) {
        _this.flowLinkStack.push(configs);
      });
    }
  }, {
    key: "staticCheck",
    value: function staticCheck(instance, jflow) {
      if (instance._layoutNode && instance._layoutNode.isFree) {
        return false;
      }

      var finded = jflow._linkStack.find(function (l) {
        return l.from === instance || l.to === instance;
      });

      if (!finded) {
        return false;
      }

      var nowAnchor = instance.anchor.slice();
      jflow.reflow();
      if (jflow._linkStack.length < 2) return;
      var currentAnchor = instance.anchor;
      var d = dist2(nowAnchor, currentAnchor);

      if (d > 1000) {
        instance.dispatchEvent(new _events["default"]('outOfFlow', {
          anchor: nowAnchor,
          instance: instance,
          jflow: jflow,
          point: nowAnchor
        }));
        return true;
      }

      return false;
    }
  }, {
    key: "reflowByMapping",
    value: function reflowByMapping(layoutMapping) {
      var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var linkLength = this.linkLength;
      var gap = this.gap;
      var verticalMapping = layoutMapping.vertical,
          horizontalMapping = layoutMapping.horizontal;
      var reduceWidth = x;
      Object.keys(horizontalMapping).forEach(function (columnNumber, idx) {
        var column = horizontalMapping[columnNumber];
        var rowWidth = 0;
        var rows = Object.keys(column);
        rows.forEach(function (rowNumber) {
          var ast = column[rowNumber];
          var instance = ast.getJflowInstance();

          var _instance$getBounding = instance.getBoundingDimension(),
              width = _instance$getBounding.width;

          rowWidth = Math.max(width, rowWidth);
        });
        reduceWidth += idx === 0 ? 0 : rowWidth / 2;
        rows.forEach(function (rowNumber) {
          var ast = column[rowNumber];
          var instance = ast.getJflowInstance();
          instance.anchor[0] = reduceWidth;
        });
        reduceWidth += rowWidth / 2 + gap;
      });
      var reduceHeight = y; // console.log(verticalMapping)

      Object.keys(verticalMapping).forEach(function (rowNumber, idx) {
        var row = verticalMapping[rowNumber];
        var rowHeight = 0;
        var columns = Object.keys(row);
        columns.forEach(function (columnNumber) {
          var ast = row[columnNumber];
          var instance = ast.getJflowInstance();

          var _instance$getBounding2 = instance.getBoundingDimension(),
              height = _instance$getBounding2.height,
              width = _instance$getBounding2.width;

          rowHeight = Math.max(height, rowHeight);
        });
        reduceHeight += idx === 0 ? 0 : rowHeight / 2;
        columns.forEach(function (columnNumber) {
          var ast = row[columnNumber];
          var instance = ast.getJflowInstance();
          instance.anchor[1] = reduceHeight;
        });
        reduceHeight += rowHeight / 2 + linkLength;
      });
    }
  }, {
    key: "findLayoutNode",
    value: function findLayoutNode(configs) {
      var finded = this.flowStack.find(function (node) {
        return node.configs === configs;
      });

      if (finded) {
        return finded.layoutMeta;
      }

      return null;
    }
  }, {
    key: "reflow",
    value: function reflow(jflow) {
      var _this2 = this;

      this.reflowByMapping(this.layoutMapping);
      Object.values(this.playgroundLayoutMapping).forEach(function (mapping) {
        var node = mapping.node.getJflowInstance();

        _this2.reflowByMapping(mapping, node.anchor[0], node.anchor[1]);
      });
    }
  }]);

  return LowcodeLayout;
}();

var _default = LowcodeLayout;
exports["default"] = _default;
//# sourceMappingURL=low-code-layout.js.map
