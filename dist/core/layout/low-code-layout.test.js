"use strict";

function layoutAST(ast) {
  // let x = 0;
  // let y = 0;
  var mapping = {};

  function addMapping(level, index, node) {
    if (!mapping[level]) {
      mapping[level] = {};
    }

    mapping[level][index] = node.name;
  } //     getNodeBoundingBox(node) {
  //         let xspan = 1;
  //         let yspan = 1;
  //         if(node.consequent && Array.isArray(node.consequent)) {
  //             node.consequent.forEach(n => {
  //                 const { xspan, yspan } = getNodeBoundingBox(n);
  //             })
  //         }
  //         if(node.alternate && Array.isArray(node.alternate)) {
  //             node.alternate.forEach(n => {
  //                 addMapping(x, y, n);
  //             });
  //         }
  //         return { xspan, yspan }
  //     }
  //     function itAst(node) {
  //         let y = 0;
  //         let x = 0;
  //         node.body.forEach(n => {
  //             addMapping(x, y, n);
  //             const { yspan } = getNodeBoundingBox(n);
  //             y += yspan;
  //         });
  //     }
  //     // let yleft = 0;
  //     // let yright = 0;
  //     let x = 0;
  //     function iterateAst(node, yleft = 0, yright = 0, fromIterate = 'body') {
  //         if(node.consequent && Array.isArray(node.consequent)) {
  //             if(fromIterate === 'alternate') {
  //                 yleft += 1;
  //             }
  //             node.consequent.forEach(n => {
  //                 yleft += 1
  //                 addMapping(x, yleft, n);
  //                 const p = iterateAst(n, yleft, yright, 'consequent');
  //                 // yleft = p.
  //             })
  //         }
  //         if(node.alternate && Array.isArray(node.alternate)) {
  //             x += 1;
  //             node.alternate.forEach(n => {
  //                 yright += 1
  //                 addMapping(x, yright, n);
  //                 const p = iterateAst(n, yleft, yright, 'alternate');
  //                 yright = p.yleft;
  //             });
  //             x -= 1;
  //         } 
  //         if(node.body && Array.isArray(node.body)) {
  //             node.body.forEach(n => {
  //                 const y = Math.max(yleft, yright) + 1;
  //                 yleft = yright = y;
  //                 addMapping(x, y, n);
  //                 const p = iterateAst(n, yleft, yright, 'body');
  //                 yleft = p.yleft;
  //                 yright = p.yright;
  //             })
  //         }
  //         return {
  //             yleft,
  //             yright
  //         }
  //     }
  //     iterateAst(ast)
  //     console.log(mapping)

}

function AstNode(source) {
  this.name = source.name;
  this.type = source.type;
  this.body = (source.body || []).map(function (n) {
    return new AstNode(n);
  });
  this.consequent = (source.consequent || []).map(function (n) {
    return new AstNode(n);
  });
  this.alternate = (source.alternate || []).map(function (n) {
    return new AstNode(n);
  });

  if (source.consequent || source.alternate) {
    this.Endpoint = new AstNode({
      type: 'endpoint',
      name: "".concat(this.name, "-endpoint")
    });
  }
}

AstNode.prototype.getNodeBoundingBox = function () {
  var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var sequence = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var spanX = 1;
  var spanY = 1;
  this.level = level;
  this.sequence = sequence;

  if (this.body.length) {
    this.body.forEach(function (b, idx) {
      var _b$getNodeBoundingBox = b.getNodeBoundingBox(level + 1, sequence),
          sx = _b$getNodeBoundingBox.spanX,
          sy = _b$getNodeBoundingBox.spanY;

      spanX = Math.max(sx, spanX);
      spanY += sy;
      level += sy;
    });
  } else {
    var c_spanX = 0;
    var c_spanY = 0;
    var a_spanX = 0;
    var a_spanY = 0;
    this.consequent.forEach(function (c, idx) {
      var _c$getNodeBoundingBox = c.getNodeBoundingBox(level + 1, sequence),
          sx = _c$getNodeBoundingBox.spanX,
          sy = _c$getNodeBoundingBox.spanY;

      c_spanX = Math.max(c_spanX, sx);
      c_spanY += sy;
      level += sy;
    });
    var nextSequeence = sequence + c_spanX;
    level = this.level;
    this.alternate.forEach(function (a, idx) {
      var _a$getNodeBoundingBox = a.getNodeBoundingBox(level + 1, nextSequeence),
          sx = _a$getNodeBoundingBox.spanX,
          sy = _a$getNodeBoundingBox.spanY;

      a_spanX = Math.max(a_spanX, sx);
      a_spanY += sy;
      level += sy;
    });
    spanX = Math.max(1, c_spanX + a_spanX);
    spanY += Math.max(c_spanY, a_spanY);

    if (this.Endpoint) {
      var _this$Endpoint$getNod = this.Endpoint.getNodeBoundingBox(level + 1, nextSequeence),
          sy = _this$Endpoint$getNod.spanY;

      spanY += sy;
    }
  }

  this.spanX = spanX;
  this.spanY = spanY;
  console.log(this.name, this.spanX, this.spanY);
  return {
    spanX: spanX,
    spanY: spanY,
    level: level,
    sequence: sequence
  };
};

AstNode.prototype.toString = function () {
  console.log("".concat(this.sequence, ", ").concat(this.level, ", ").concat(this.name));

  if (this.body.length) {
    this.body.forEach(function (b) {
      b.toString();
    });
  } else {
    this.consequent.forEach(function (c) {
      c.toString();
    });
    this.alternate.forEach(function (a) {
      a.toString();
    });

    if (this.Endpoint) {
      this.Endpoint.toString();
    }
  }
};

AstNode.prototype.makeLink = function (linkStack) {
  if (this.body.length) {
    this.body.forEach(function (b) {
      b.toString();
    });
  } else {
    this.consequent.forEach(function (c) {
      c.toString();
    });
    this.alternate.forEach(function (a) {
      a.toString();
    });

    if (this.Endpoint) {
      this.Endpoint.toString();
    }
  }
};

var ast = {
  name: 'root',
  body: [{
    type: 'start',
    name: 'start'
  }, {
    type: 'variable',
    content: 'aaaa',
    name: 'logic1',
    consequent: [{
      type: 'variable',
      content: 'vvvvvvv',
      name: 'logic5'
    }, {
      type: 'variable',
      content: 'vvvvvvv',
      name: 'logic6',
      consequent: [{
        type: 'variable',
        content: 'vvvvvvv',
        name: 'logic6554'
      }],
      alternate: [{
        type: 'variable',
        content: 'ggggggg',
        name: 'logic89757'
      }, {
        type: 'variable',
        content: 'vvvvvvv',
        name: 'logic8675'
      }]
    }],
    alternate: [{
      type: 'variable',
      content: 'ggggggg',
      name: 'logic55474',
      consequent: [{
        type: 'variable',
        content: 'vvvvvvv',
        name: 'logic77'
      }],
      alternate: [{
        type: 'variable',
        content: 'ggggggg',
        name: 'logic88'
      }, {
        type: 'variable',
        content: 'vvvvvvv',
        name: 'logic99'
      }]
    }, {
      type: 'variable',
      content: 'ggggggg',
      name: 'logic34455'
    }]
  }, {
    type: 'variable',
    content: 'ddddggg',
    name: 'logic3'
  }, {
    type: 'assignment',
    name: 'logic2'
  }, {
    type: 'end',
    name: 'end'
  }]
}; // layoutAST(ast)

var root = new AstNode(ast);
root.getNodeBoundingBox();
root.toString();
//# sourceMappingURL=low-code-layout.test.js.map
