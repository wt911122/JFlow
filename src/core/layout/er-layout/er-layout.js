
import { makeER } from './er-node';
/**
 * ER source
 * @typedef {Object} ERLayout~sourceConfigs
 * @property {string} type - node
 * @property {string} id - 唯一标识
 * @property {Object[]} properties - 描述
 */
/**
 * ER布局数据源配置
 * @typedef {Object} ERLayout~Configs
 * @property {ERLayout~sourceConfigs[]} entityRelationship - 关系
 */
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

class ERLayout {
    constructor(configs) {
        /** @member {boolean}      - false 不需要布局变化检查 */
        this.static = false;
        /** @member {Layout~NodeMeta[]}      - 布局节点单元数组 */
        this.flowStack = [];
        /** @member {Layout~LinkMeta[]}      - 布局连线单元数组 */
        this.flowLinkStack = [];
        /** @member {LayoutNode[]}      - 布局节点数组 */
        this.erNodes = [];
        this.reOrder(configs.entityRelationship);
    }
    /**
     * 从 tree 计算布局
     * @param {AstNode} tree - ER 树
     */
    reOrder(er) {
        this.er = er;
        this.flowStack = [];
        this.flowLinkStack = [];
        const nodes = makeER(this.er);
        const idMap = [];
        nodes.forEach(node => {
            node.traverse((n) => {
                this.flowStack.push({
                    type: n.type,
                    configs: n.source,
                    layoutMeta: n,
                })
            });
            node.makeLink(configs => {
                const {
                    from: property,
                    to: toProperty,
                    meta,
                } = configs;
                if(meta.isObjectRef) {
                    const id1 = `${property}-${toProperty}`;
                    const id2 = `${toProperty}-${property}`;
                    
                    const fromMeta = meta.from;
                    if(idMap.includes(id1) || idMap.includes(id2)) {
                        return;
                    }
                    if(!fromMeta.source.isParentRef) {  
                        idMap.push(id1);
                        idMap.push(id2);
                        this.flowLinkStack.push(configs)
                    }
                } else {
                    this.flowLinkStack.push(configs)
                }
               
            })
        });
        this.erNodes = nodes;
    }

    staticCheck(instance, jflow) {
        return false;
    }

    reflow(jflow){
        const links = this.flowLinkStack;
        const nodes = this.erNodes;
        let x = 0;
        const lineMapping = {};
        const size = 1000;
        function computeNodeAnchor(node, recorded = []) {
            let relativeAnchor = [0, 0];
            
            
            if (node.parentRef) {
                if(recorded.includes(node.parentRef)) {
                    // debugger;
                    return [
                        relativeAnchor[0] - (size/2) + node.source.diagramWeight * size,
                        relativeAnchor[1]
                    ];
                }
                recorded.push(node.parentRef);
                
                relativeAnchor = computeNodeAnchor(node.parentRef, recorded);
                return [
                    relativeAnchor[0] - (size/2) + node.source.diagramWeight * size,
                    relativeAnchor[1] + 600,
                ];
            } else {
                return relativeAnchor;
            }
        }
        this.erNodes.forEach(node => {
            const instance = node.getJflowInstance();
            const [nx, ny] = computeNodeAnchor(node);
            if(!lineMapping[ny]) {
                lineMapping[ny] = [];
            }
            lineMapping[ny].push(node);
            instance.anchor = [nx + lineMapping[ny].length * 500, ny];
            x+=300
        });
        // debugger
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
}

export default ERLayout;