
import { makeER } from './er-node';
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
        this.static = false;
        this.flowStack = [];
        this.flowLinkStack = [];
        this.erNodes = [];
        this.reOrder(configs.entityRelationship);
    }
    /**
     * 从 tree 计算布局
     * @param {AstNode} tree - ER 树
     */
    reOrder(er, root) {
        this.er = er;
        this.flowStack = [];
        this.flowLinkStack = [];
        const nodes = makeER(this.er);
        nodes.forEach(node => {
            node.traverse((n) => {
                this.flowStack.push({
                    type: n.type,
                    configs: n.source,
                    layoutMeta: n,
                })
            });
            node.makeLink(configs => {
                this.flowLinkStack.push(configs)
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
        this.erNodes.forEach(node => {
            const instance = node.getJflowInstance();
            instance.anchor = [x, 0];
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