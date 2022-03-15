import { DIRECTION } from '../../utils/constance';
function getRelationShip(p1, p2) {
    if(p1.type === 'Array' && p2.type !== 'Array') {
        return '多对一'
    }
    if(p2.type === 'Array' && p1.type !== 'Array') {
        return '一对多'
    }
    if(p1.type === 'Array' && p2.type === 'Array') {
        return '多对多'
    }
    if(p1.type !== 'Array' && p2.type !== 'Array') {
        return '一对一'
    }
}
/**
    ER property Node
    * @implements {LayoutNode}
 */
class ERProperty {
    constructor(source, node, isNavigation) {
        /** @member {String}      - 布局节点类型 */
        this.type = 'ERProperty';
        /** @member {Object}      - 数据源 */
        this.source = source;
        this.node = node;
        this.ref = source.ref;
        this.type = source.type;
        this.association = source.association;
        /** @member {String}      - 唯一标识 */
        this.id = isNavigation ? `${node.id}-${source.name}-navigation` : `${node.id}-${source.name}`
        this._selfLink = false;
        this.parentPropertyRef = undefined;
        /** @member {LayoutNode~getJflowInstance}      - 获取jflow对象 */
        this.getJflowInstance = undefined;
        this.doubleRef = undefined;
    }
}
/**
 ER Node
 * @implements {LayoutNode}
 * @param {Object} source
 */
class ERNode { 
    constructor(source) {
        /** @member {String}      - 布局节点类型 */
        this.type = 'ERNode';
        /** @member {Object}      - 数据源 */
        this.source = source;
        /** @member {String}      - 唯一标识 */
        this.id = source.name;
        /** @member {Boolean}      - true, 可拖动 */
        this.isDraggable = true;
        /** @member {LayoutNode~getJflowInstance}      - 获取jflow对象 */
        this.getJflowInstance = undefined;
        // this.adjacencyList = []
        this.propertyList = source.propertyList.map(p => new ERProperty(p, this));
        this.navigationPropertyList = source.navigationPropertyList.map(p => new ERProperty(p, this, true))
        this.idProperty = this.propertyList.find(p => p.source.name === 'id');
        // this.VertexNameProperty = this.propertyList.find(p => p.source.type === 'VertexName');
    }

    _traverseProperty(nodeMap) {
        this.propertyList.forEach(property => {
            const idRef = property.source.idRef; // 决定链接的对象
            const isParentRef = property.source.isParentRef; // 决定连接的性质
            if(idRef && property.source.type !== 'Array' && nodeMap[idRef]) {
                const parentRef = nodeMap[idRef];
                if (property.source.isParentRef) {
                    this.parentRef = parentRef;
                }
                if (parentRef === this) {
                    property._selfLink = true;
                }
                property.parentPropertyRef = parentRef.idProperty;
            }
        });
        this.navigationPropertyList.forEach(property => {
            const objectRef = property.source.objectRef;
            if(objectRef && nodeMap[objectRef]) {
                const node = nodeMap[objectRef];
                const targetProperty = node.navigationPropertyList.find(n => n.source.objectRef === this.id)
                if (node === this) {
                    property._selfLink = true;
                }
                property.doubleRef = targetProperty;
            }
        })
        
    }

    traverse(callback) {
        callback(this);
        this.propertyList.forEach(property => {
            if(property.ref instanceof ERNode) {
                callback(property);
            }
        })
    }

    makeLink(callback) {
        this.propertyList.forEach(property => {
            if(property.parentPropertyRef instanceof ERProperty) {
                const toProperty = property.parentPropertyRef;
                if(property._selfLink) {
                    callback({
                        from: property.id,
                        to: toProperty.id,
                        part: 'property',
                        fromDir: DIRECTION.LEFT,
                        toDir: DIRECTION.LEFT,
                        content: property.association,
                        minSpanX: 80,
                        meta: {
                            from: property,
                            to: toProperty,
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
                            to: toProperty,
                        }
                    });
                }
            }
        });

        
        this.navigationPropertyList.forEach(property => {
            if(property.doubleRef instanceof ERProperty) {
                const toProperty = property.doubleRef;
                if(property._selfLink) {
                    callback({
                        from: property.id,
                        to: toProperty.id,
                        part: 'property',
                        fromDir: DIRECTION.LEFT,
                        toDir: DIRECTION.TOP,
                        lineDash: [10, 5],
                        doubleLink: true,
                        content: property.association,
                        minSpanX: 80,
                        minSpanY: 80,
                        meta: {
                            from: property,
                            to: toProperty,
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
                            isObjectRef: true,
                        }
                    });
                }
            }
        })
    }
}

function makeER(source) {
    const nodeMap = {};
    const nodes = source.map(s => {
        const node = new ERNode(s);
        nodeMap[s.name] = node
        return node;
    });
    nodes.forEach(node => {
        node._traverseProperty(nodeMap);
    });
    return nodes;
}
export { 
    makeER,
}