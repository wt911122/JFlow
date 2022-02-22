"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeER = makeER;

var _constance = require("../../utils/constance");

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getRelationShip(p1, p2) {
  if (p1.type === 'Array' && p2.type !== 'Array') {
    return '多对一';
  }

  if (p2.type === 'Array' && p1.type !== 'Array') {
    return '一对多';
  }

  if (p1.type === 'Array' && p2.type === 'Array') {
    return '多对多';
  }

  if (p1.type !== 'Array' && p2.type !== 'Array') {
    return '一对一';
  }
}

var ERProperty = /*#__PURE__*/_createClass(function ERProperty(source, node, isNavigation) {
  _classCallCheck(this, ERProperty);

  this.type = 'ERProperty';
  this.source = source;
  this.node = node;
  this.ref = source.ref;
  this.type = source.type;
  this.association = source.association;
  this.id = isNavigation ? "".concat(node.id, "-").concat(source.name, "-navigation") : "".concat(node.id, "-").concat(source.name);
  this._selfLink = false;
  this.parentPropertyRef = undefined;
  this.getJflowInstance = undefined;
  this.doubleRef = undefined;
});

var ERNode = /*#__PURE__*/function () {
  function ERNode(source) {
    var _this = this;

    _classCallCheck(this, ERNode);

    this.type = 'ERNode';
    this.source = source;
    this.id = source.name;
    this.isDraggable = true;
    this.getJflowInstance = undefined; // this.adjacencyList = []

    this.propertyList = source.propertyList.map(function (p) {
      return new ERProperty(p, _this);
    });
    this.navigationPropertyList = source.navigationPropertyList.map(function (p) {
      return new ERProperty(p, _this, true);
    });
    this.idProperty = this.propertyList.find(function (p) {
      return p.source.name === 'id';
    }); // this.VertexNameProperty = this.propertyList.find(p => p.source.type === 'VertexName');
  }

  _createClass(ERNode, [{
    key: "_traverseProperty",
    value: function _traverseProperty(nodeMap) {
      var _this2 = this;

      this.propertyList.forEach(function (property) {
        var idRef = property.source.idRef; // 决定链接的对象

        var isParentRef = property.source.isParentRef; // 决定连接的性质

        if (idRef && property.source.type !== 'Array' && nodeMap[idRef]) {
          var parentRef = nodeMap[idRef];

          if (property.source.isParentRef) {
            _this2.parentRef = parentRef;
          }

          if (parentRef === _this2) {
            property._selfLink = true;
          }

          property.parentPropertyRef = parentRef.idProperty;
        }
      });
      this.navigationPropertyList.forEach(function (property) {
        var objectRef = property.source.objectRef;

        if (objectRef && nodeMap[objectRef]) {
          var node = nodeMap[objectRef];
          var targetProperty = node.navigationPropertyList.find(function (n) {
            return n.source.objectRef === _this2.id;
          });

          if (node === _this2) {
            property._selfLink = true;
          }

          property.doubleRef = targetProperty;
        }
      });
    }
  }, {
    key: "traverse",
    value: function traverse(callback) {
      callback(this);
      this.propertyList.forEach(function (property) {
        if (property.ref instanceof ERNode) {
          callback(property);
        }
      });
    }
  }, {
    key: "makeLink",
    value: function makeLink(callback) {
      this.propertyList.forEach(function (property) {
        if (property.parentPropertyRef instanceof ERProperty) {
          var toProperty = property.parentPropertyRef;

          if (property._selfLink) {
            callback({
              from: property.id,
              to: toProperty.id,
              part: 'property',
              fromDir: _constance.DIRECTION.LEFT,
              toDir: _constance.DIRECTION.LEFT,
              content: property.association,
              minSpanX: 80,
              meta: {
                from: property,
                to: toProperty
              }
            });
          } else {
            callback({
              from: property.id,
              to: toProperty.id,
              part: 'property',
              content: property.association,
              meta: {
                from: property,
                to: toProperty
              }
            });
          }
        }
      });
      this.navigationPropertyList.forEach(function (property) {
        if (property.doubleRef instanceof ERProperty) {
          var toProperty = property.doubleRef;

          if (property._selfLink) {
            callback({
              from: property.id,
              to: toProperty.id,
              part: 'property',
              fromDir: _constance.DIRECTION.LEFT,
              toDir: _constance.DIRECTION.TOP,
              lineDash: [10, 5],
              doubleLink: true,
              content: property.association,
              minSpanX: 80,
              minSpanY: 80,
              meta: {
                from: property,
                to: toProperty
              }
            });
          } else {
            callback({
              from: property.id,
              to: toProperty.id,
              part: 'property',
              lineDash: [10, 5],
              doubleLink: true,
              content: property.association,
              meta: {
                from: property,
                to: toProperty,
                isObjectRef: true
              }
            });
          }
        }
      });
    }
  }]);

  return ERNode;
}();

function makeER(source) {
  var nodeMap = {};
  var nodes = source.map(function (s) {
    var node = new ERNode(s);
    nodeMap[s.name] = node;
    return node;
  });
  nodes.forEach(function (node) {
    node._traverseProperty(nodeMap);
  });
  return nodes;
}
//# sourceMappingURL=er-node.js.map
