"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeAST = makeAST;

var _constance = require("../../utils/constance");

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var BaseNode = /*#__PURE__*/function () {
  function BaseNode(source) {
    var _this = this;

    _classCallCheck(this, BaseNode);

    this.source = source;
    this.id = source.id;
    this.type = source.type;
    this.isDraggable = true;
    this.getJflowInstance = undefined;
    this.level = undefined;
    this.sequence = undefined;
    this.isLocked = false;
    this.isFree = false;
    this.parent = undefined;
    this.idx = undefined;
    this.parentIterateType = undefined;

    source._getAstNode = function () {
      return _this;
    };
  }

  _createClass(BaseNode, [{
    key: "reflowPreCalculate",
    value: function reflowPreCalculate() {
      var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var sequence = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var callback = arguments.length > 2 ? arguments[2] : undefined;
      this.level = level;
      this.sequence = sequence;
      this.spanX = 1;
      this.spanY = 1;

      if (callback) {
        callback(level, sequence, this);
      }

      return {
        spanX: this.spanX,
        spanY: this.spanY,
        level: level,
        sequence: sequence
      };
    }
  }, {
    key: "makeLink",
    value: function makeLink(callback) {
      return this;
    }
  }, {
    key: "makeEndpoint",
    value: function makeEndpoint() {}
  }, {
    key: "traverse",
    value: function traverse(callback) {
      callback(this);
    }
  }, {
    key: "getNodes",
    value: function getNodes() {
      var nodes = [];
      this.traverse(function (n) {
        if (n.getJflowInstance) nodes.push(n.getJflowInstance());
      });
      return nodes;
    }
  }, {
    key: "linkSource",
    value: function linkSource(source) {
      this.parent.source[this.parentIterateType].splice(this.idx + 1, 0, source);
    }
  }, {
    key: "remove",
    value: function remove() {
      this.parent.source[this.parentIterateType].splice(this.idx, 1);
    }
  }]);

  return BaseNode;
}();

var Root = /*#__PURE__*/function (_BaseNode) {
  _inherits(Root, _BaseNode);

  var _super = _createSuper(Root);

  function Root(source) {
    var _this2;

    _classCallCheck(this, Root);

    _this2 = _super.call(this, source);
    _this2.isroot = true;
    _this2.body = (source.body || []).map(mapFunc('body').bind(_assertThisInitialized(_this2)));
    var playgrounditerator = mapFunc('playground').bind(_assertThisInitialized(_this2));
    _this2.playground = (source.playground || []).map(function (s, idx) {
      var n = playgrounditerator(s, idx);
      n.isFree = true;
      return n;
    });
    return _this2;
  }

  _createClass(Root, [{
    key: "reflowBodyPreCalculate",
    value: function reflowBodyPreCalculate() {
      var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var sequence = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var callback = arguments.length > 2 ? arguments[2] : undefined;
      var spanX = 1;
      var spanY = 1;
      this.level = level;
      this.sequence = sequence;

      if (callback) {
        callback(level, sequence, this);
      }

      this.body.forEach(function (b) {
        var _b$reflowPreCalculate = b.reflowPreCalculate(level + 1, sequence, callback),
            sx = _b$reflowPreCalculate.spanX,
            sy = _b$reflowPreCalculate.spanY;

        spanX = Math.max(sx, spanX);
        spanY += sy;
        level += sy;
      });
      this.spanX = spanX;
      this.spanY = spanY;
      return {
        spanX: spanX,
        spanY: spanY,
        level: level,
        sequence: sequence
      };
    }
  }, {
    key: "reflowPlaygroundPreCalculate",
    value: function reflowPlaygroundPreCalculate(preCallback, callback) {
      this.playground.forEach(function (node) {
        preCallback(node);
        node.reflowPreCalculate(0, 0, callback);
      });
    }
  }, {
    key: "makeLink",
    value: function makeLink(callback) {
      var last;
      this.body.forEach(function (b) {
        if (!last) {
          last = b;
          return;
        }

        callback({
          from: last.id,
          to: b.id,
          part: 'body',
          fromDir: _constance.DIRECTION.BOTTOM,
          toDir: _constance.DIRECTION.TOP,
          meta: {
            from: last,
            to: b
          }
        });
        b = b.makeLink(callback);
        last = b;
      });
      this.playground.forEach(function (n) {
        n.makeLink(callback);
      });
      return this;
    }
  }, {
    key: "traverse",
    value: function traverse(callback) {
      this.body.forEach(function (n) {
        n.traverse(callback);
      });
      this.playground.forEach(function (n) {
        n.traverse(callback);
      });
    }
  }]);

  return Root;
}(BaseNode);

var IfStatement = /*#__PURE__*/function (_BaseNode2) {
  _inherits(IfStatement, _BaseNode2);

  var _super2 = _createSuper(IfStatement);

  function IfStatement(source) {
    var _this3;

    _classCallCheck(this, IfStatement);

    _this3 = _super2.call(this, source);
    _this3.consequent = (source.consequent || []).map(mapFunc('consequent').bind(_assertThisInitialized(_this3)));
    _this3.alternate = (source.alternate || []).map(mapFunc('alternate').bind(_assertThisInitialized(_this3)));
    _this3.isLocked = true;
    return _this3;
  }

  _createClass(IfStatement, [{
    key: "reflowPreCalculate",
    value: function reflowPreCalculate() {
      var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var sequence = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var callback = arguments.length > 2 ? arguments[2] : undefined;
      var spanX = 1;
      var spanY = 1;
      this.level = level;
      this.sequence = sequence;

      if (callback) {
        callback(level, sequence, this);
      }

      var c_spanX = 1;
      var c_spanY = 0;
      var a_spanX = 0;
      var a_spanY = 0;
      this.consequent.forEach(function (c, idx) {
        var _c$reflowPreCalculate = c.reflowPreCalculate(level + 1, sequence, callback),
            sx = _c$reflowPreCalculate.spanX,
            sy = _c$reflowPreCalculate.spanY;

        c_spanX = Math.max(c_spanX, sx);
        c_spanY += sy;
        level += sy;
      });
      var nextSequeence = sequence + c_spanX;
      level = this.level;
      this.alternate.forEach(function (a, idx) {
        var _a$reflowPreCalculate = a.reflowPreCalculate(level + 1, nextSequeence, callback),
            sx = _a$reflowPreCalculate.spanX,
            sy = _a$reflowPreCalculate.spanY;

        a_spanX = Math.max(a_spanX, sx);
        a_spanY += sy;
        level += sy;
      });
      spanX = Math.max(1, c_spanX + a_spanX);
      spanY += Math.max(c_spanY, a_spanY);
      level = this.level + spanY - 1;

      var _this$Endpoint$reflow = this.Endpoint.reflowPreCalculate(level + 1, sequence, callback),
          sy = _this$Endpoint$reflow.spanY;

      spanY += sy;
      this.spanX = spanX;
      this.spanY = spanY;
      return {
        spanX: spanX,
        spanY: spanY,
        level: level,
        sequence: sequence
      };
    }
  }, {
    key: "makeLink",
    value: function makeLink(callback) {
      var _this4 = this;

      var lastc = this;
      this.consequent.forEach(function (c) {
        callback({
          from: lastc.id,
          to: c.id,
          part: 'consequent',
          fromDir: _constance.DIRECTION.BOTTOM,
          toDir: _constance.DIRECTION.TOP,
          meta: {
            from: lastc,
            to: c
          }
        });
        c = c.makeLink(callback);
        lastc = c;
      });
      callback({
        from: lastc.id,
        to: this.Endpoint.id,
        fromDir: _constance.DIRECTION.BOTTOM,
        toDir: _constance.DIRECTION.TOP,
        part: 'consequent',
        meta: {
          from: lastc,
          to: this.Endpoint
        }
      });
      var lasta = this;
      this.alternate.forEach(function (a) {
        callback({
          from: lasta.id,
          to: a.id,
          fromDir: lasta === _this4 ? _constance.DIRECTION.RIGHT : _constance.DIRECTION.BOTTOM,
          toDir: _constance.DIRECTION.TOP,
          part: 'alternate',
          meta: {
            from: lasta,
            to: a
          }
        });
        a = a.makeLink(callback);
        lasta = a;
      });
      callback({
        from: lasta.id,
        to: this.Endpoint.id,
        fromDir: lasta === this ? _constance.DIRECTION.RIGHT : _constance.DIRECTION.BOTTOM,
        toDir: _constance.DIRECTION.RIGHT,
        part: 'alternate',
        meta: {
          from: lasta,
          to: this.Endpoint
        }
      });
      return this.Endpoint;
    }
  }, {
    key: "makeEndpoint",
    value: function makeEndpoint() {
      this.Endpoint = makeAST({
        type: 'endpoint',
        id: "".concat(this.id, "-endpoint")
      });
      this.Endpoint.parent = this.parent;
      this.Endpoint.idx = this.idx;
      this.Endpoint.parentIterateType = this.parentIterateType;
    }
  }, {
    key: "traverse",
    value: function traverse(callback) {
      callback(this);
      this.consequent.forEach(function (n) {
        n.traverse(callback);
      });
      this.alternate.forEach(function (n) {
        n.traverse(callback);
      });
      callback(this.Endpoint);
    }
  }, {
    key: "linkSource",
    value: function linkSource(source, linkMeta) {
      this.source[linkMeta.part].unshift(source);
    }
  }]);

  return IfStatement;
}(BaseNode);

var SwitchStatement = /*#__PURE__*/function (_BaseNode3) {
  _inherits(SwitchStatement, _BaseNode3);

  var _super3 = _createSuper(SwitchStatement);

  function SwitchStatement(source) {
    var _this5;

    _classCallCheck(this, SwitchStatement);

    _this5 = _super3.call(this, source);
    _this5.cases = (source.cases || []).map(mapFunc('case').bind(_assertThisInitialized(_this5)));

    if (_this5.cases.length) {
      _this5.cases[_this5.cases.length - 1].lastCase = true;
    }

    _this5.isLocked = true;
    return _this5;
  }

  _createClass(SwitchStatement, [{
    key: "reflowPreCalculate",
    value: function reflowPreCalculate() {
      var _this6 = this;

      var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var sequence = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var callback = arguments.length > 2 ? arguments[2] : undefined;
      var spanX = 1;
      var spanY = 1;
      this.level = level;
      this.sequence = sequence;

      if (callback) {
        callback(level, sequence, this);
      }

      var c_spanX = 1;
      var c_spanY = 0;

      if (this.cases.length) {
        var consequent = this.cases[this.cases.length - 1].consequent;
        level = this.level;
        consequent.forEach(function (cc) {
          var _cc$reflowPreCalculat = cc.reflowPreCalculate(level + 1, sequence, callback),
              sx = _cc$reflowPreCalculat.spanX,
              sy = _cc$reflowPreCalculat.spanY;

          c_spanX = Math.max(c_spanX, sx);
          c_spanY += sy;
          level += sy;
        });
      }

      var s_spanX = c_spanX;
      var s_spanY = 0;
      this.cases.forEach(function (c, idx) {
        var nextSequeence = sequence + s_spanX;
        var a_spanX = 0;
        var a_spanY = 0;
        level = _this6.level;
        c.alternate.forEach(function (ca) {
          var _ca$reflowPreCalculat = ca.reflowPreCalculate(level + 1, nextSequeence, callback),
              sx = _ca$reflowPreCalculat.spanX,
              sy = _ca$reflowPreCalculat.spanY;

          a_spanX = Math.max(a_spanX, sx);
          a_spanY += sy;
          level += sy;
        });
        s_spanX += a_spanX;
        s_spanY = Math.max(s_spanY, a_spanY);
      });
      spanX = Math.max(1, s_spanX);
      spanY = Math.max(c_spanY, s_spanY);
      level = this.level + spanY;

      var _this$Endpoint$reflow2 = this.Endpoint.reflowPreCalculate(level + 1, sequence, callback),
          sy = _this$Endpoint$reflow2.spanY;

      spanY += sy;
      spanY += 1; // 要算上自己

      this.spanX = spanX;
      this.spanY = spanY;
      return {
        spanX: spanX,
        spanY: spanY,
        level: level,
        sequence: sequence
      };
    }
  }, {
    key: "makeLink",
    value: function makeLink(callback) {
      var _this7 = this;

      var lastc = this;

      if (this.cases.length) {
        var consequent = this.cases[this.cases.length - 1].consequent;
        consequent.forEach(function (c, idx) {
          callback({
            from: lastc.id,
            to: c.id,
            fromDir: _constance.DIRECTION.BOTTOM,
            toDir: _constance.DIRECTION.TOP,
            part: 'consequent',
            meta: {
              from: lastc,
              to: c
            }
          });
          lastc = c.makeLink(callback);
        });
      }

      callback({
        from: lastc.id,
        to: this.Endpoint.id,
        fromDir: _constance.DIRECTION.BOTTOM,
        toDir: _constance.DIRECTION.TOP,
        part: 'alternate',
        meta: {
          from: lastc,
          to: this.Endpoint
        }
      });
      this.cases.forEach(function (c, idx) {
        var lasta = c;
        c.alternate.forEach(function (a) {
          callback({
            from: lasta.id,
            to: a.id,
            fromDir: lasta === c ? _constance.DIRECTION.RIGHT : _constance.DIRECTION.BOTTOM,
            toDir: _constance.DIRECTION.TOP,
            part: 'alternate',
            meta: {
              from: lasta,
              to: a
            }
          });
          lasta = a.makeLink(callback);
        });
        callback({
          from: lasta.id,
          to: _this7.Endpoint.id,
          fromDir: lasta === c ? _constance.DIRECTION.RIGHT : _constance.DIRECTION.BOTTOM,
          toDir: _constance.DIRECTION.RIGHT,
          part: 'alternate',
          minSpanX: 32 * (idx + 1),
          meta: {
            from: lasta,
            to: _this7.Endpoint
          }
        });
      });
      return this.Endpoint;
    }
  }, {
    key: "makeEndpoint",
    value: function makeEndpoint() {
      this.Endpoint = makeAST({
        type: 'endpoint',
        id: "".concat(this.id, "-endpoint")
      });
      this.Endpoint.parent = this.parent;
      this.Endpoint.parentIterateType = this.parentIterateType;
      this.Endpoint.idx = this.idx;
    }
  }, {
    key: "traverse",
    value: function traverse(callback) {
      callback(this);
      this.cases.forEach(function (n) {
        n.traverse(callback);
      });
      callback(this.Endpoint);
    }
  }]);

  return SwitchStatement;
}(BaseNode);

var ForEachStatement = /*#__PURE__*/function (_BaseNode4) {
  _inherits(ForEachStatement, _BaseNode4);

  var _super4 = _createSuper(ForEachStatement);

  function ForEachStatement() {
    _classCallCheck(this, ForEachStatement);

    return _super4.apply(this, arguments);
  }

  return _createClass(ForEachStatement);
}(BaseNode);

var WhileStatement = /*#__PURE__*/function (_BaseNode5) {
  _inherits(WhileStatement, _BaseNode5);

  var _super5 = _createSuper(WhileStatement);

  function WhileStatement(source) {
    var _this8;

    _classCallCheck(this, WhileStatement);

    _this8 = _super5.call(this, source);
    _this8.body = (source.body || []).map(mapFunc('body').bind(_assertThisInitialized(_this8)));
    _this8.isLocked = true;
    return _this8;
  }

  _createClass(WhileStatement, [{
    key: "reflowPreCalculate",
    value: function reflowPreCalculate() {
      var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var sequence = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var callback = arguments.length > 2 ? arguments[2] : undefined;
      var spanX = 1;
      var spanY = 1;
      this.level = level;
      this.sequence = sequence;

      if (callback) {
        callback(level, sequence, this);
      }

      var nextSequeence = sequence + 1; // level--;

      this.body.forEach(function (b) {
        var _b$reflowPreCalculate2 = b.reflowPreCalculate(level + 1, nextSequeence, callback),
            sx = _b$reflowPreCalculate2.spanX,
            sy = _b$reflowPreCalculate2.spanY;

        spanX = Math.max(sx, spanX);
        spanY += sy;
        level += sy;
      });
      this.spanX = spanX + 1;
      this.spanY = spanY;
      return {
        spanX: spanX,
        spanY: spanY,
        level: level,
        sequence: sequence
      };
    }
  }, {
    key: "makeLink",
    value: function makeLink(callback) {
      var _this9 = this;

      var last = this; // const lastIdx = this.body.length - 1;

      this.body.forEach(function (b, idx) {
        callback({
          from: last.id,
          to: b.id,
          part: 'body',
          fromDir: last === _this9 ? _constance.DIRECTION.RIGHT : _constance.DIRECTION.BOTTOM,
          toDir: _constance.DIRECTION.TOP,
          meta: {
            from: last,
            to: b
          }
        });
        b = b.makeLink(callback);
        last = b;
      });
      callback({
        from: last.id,
        to: this.id,
        part: 'body',
        fromDir: last === this ? _constance.DIRECTION.RIGHT : _constance.DIRECTION.BOTTOM,
        anticlock: last === this,
        toDir: _constance.DIRECTION.BOTTOM,
        isSelf: true,
        minSpanX: 20,
        minSpanY: 20,
        meta: {
          from: last,
          to: this
        }
      });
      return this;
    }
  }, {
    key: "traverse",
    value: function traverse(callback) {
      callback(this);
      this.body.forEach(function (n) {
        n.traverse(callback);
      });
    }
  }, {
    key: "linkSource",
    value: function linkSource(source, linkMeta) {
      this.source[linkMeta.part].unshift(source);
    }
  }]);

  return WhileStatement;
}(BaseNode);

var SwitchCase = /*#__PURE__*/function (_BaseNode6) {
  _inherits(SwitchCase, _BaseNode6);

  var _super6 = _createSuper(SwitchCase);

  function SwitchCase(source) {
    var _this10;

    _classCallCheck(this, SwitchCase);

    _this10 = _super6.call(this, source);
    _this10.consequent = (source.consequent || []).map(mapFunc('consequent').bind(_assertThisInitialized(_this10)));
    _this10.alternate = (source.alternate || []).map(mapFunc('alternate').bind(_assertThisInitialized(_this10)));
    _this10.lastCase = false;
    return _this10;
  }

  _createClass(SwitchCase, [{
    key: "reflowPreCalculate",
    value: function reflowPreCalculate() {
      var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var sequence = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var callback = arguments.length > 2 ? arguments[2] : undefined;
      var spanX = 1;
      var spanY = 1;
      this.level = level;
      this.sequence = sequence;

      if (callback) {
        callback(level, sequence, this);
      }

      var c_spanX = 0;
      var c_spanY = 0;
      var a_spanX = 0;
      var a_spanY = 0;

      if (this.lastCase) {
        this.consequent.forEach(function (c, idx) {
          var _c$reflowPreCalculate2 = c.reflowPreCalculate(level + 1, sequence, callback),
              sx = _c$reflowPreCalculate2.spanX,
              sy = _c$reflowPreCalculate2.spanY;

          c_spanX = Math.max(c_spanX, sx);
          c_spanY += sy;
          level += sy;
        });
      }

      var nextSequeence = sequence + Math.max(c_spanX, 1);
      level = this.level;
      this.alternate.forEach(function (a, idx) {
        var _a$reflowPreCalculate2 = a.reflowPreCalculate(level + 1, nextSequeence, callback),
            sx = _a$reflowPreCalculate2.spanX,
            sy = _a$reflowPreCalculate2.spanY;

        a_spanX = Math.max(a_spanX, sx);
        a_spanY += sy;
        level += sy;
      });
      spanX = Math.max(1, c_spanX + a_spanX);
      spanY += Math.max(c_spanY, a_spanY);
      this.spanX = spanX;
      this.spanY = spanY;
      return {
        spanX: spanX,
        spanY: spanY,
        level: level,
        sequence: sequence
      };
    }
  }, {
    key: "traverse",
    value: function traverse(callback) {
      callback(this);
      this.consequent.forEach(function (n) {
        n.traverse(callback);
      });
      this.alternate.forEach(function (n) {
        n.traverse(callback);
      });
    }
  }, {
    key: "linkSource",
    value: function linkSource(source, linkMeta) {
      this.source[linkMeta.part].unshift(source);
    }
  }]);

  return SwitchCase;
}(BaseNode);

var TYPE_MAPPING = {
  IfStatement: IfStatement,
  SwitchStatement: SwitchStatement,
  SwitchCase: SwitchCase,
  ForEachStatement: ForEachStatement,
  WhileStatement: WhileStatement,
  Root: Root,
  other: BaseNode
};

function mapFunc(type) {
  return function (n, idx) {
    var p = makeAST(n);
    p.parent = this;
    p.idx = idx;
    p.parentIterateType = type;
    p.makeEndpoint();
    return p;
  };
}

function makeAST(source) {
  var type = source.type;
  var Constructor = TYPE_MAPPING[type] || TYPE_MAPPING.other;
  var node = new Constructor(source);
  return node;
}
//# sourceMappingURL=baseNode.js.map
