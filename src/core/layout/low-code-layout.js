import JFlowEvent from '../events'; 
import { DIRECTION } from '../utils/constance';
import { makeAST } from './low-code-types/baseNode';

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
class LowcodeLayout {
    constructor(configs) {
        this.linkLength = configs.linkLength || 18;
        this.gap = configs.gap || 30;
        this.reOrder(configs.ast);
        this.static = true;
    }
    /**
     * 从 ast 计算布局
     * @param {AstNode} ast - ASL 树
     */
    reOrder(ast) {
        this.ast = ast;
        this.flowStack = [];
        this.flowLinkStack = [];

        this.root = makeAST(this.ast)// new AstNode(this.ast, this.flowStack, true);
        this.root.traverse((node) => {
            this.flowStack.push({
                type: node.type,
                configs: node.source,
                layoutMeta: node,
            });
        });

        const layoutMapping = {
            vertical: {},
            horizontal: {},
        };
        const playgroundLayoutMapping = {}
        this.root.reflowBodyPreCalculate(0, 0, (level, sequence, node) => {
            if(!node.isroot) {
                if(!layoutMapping.vertical[level]){
                    layoutMapping.vertical[level] = {};
                }
                layoutMapping.vertical[level][sequence] = node;
                
                if(!layoutMapping.horizontal[sequence]){
                    layoutMapping.horizontal[sequence] = {};
                }
                layoutMapping.horizontal[sequence][level] = node;
            }
        });

        let currentTopNodeId;
        this.root.reflowPlaygroundPreCalculate(
            (topNode) => {
                currentTopNodeId = topNode.id;
                playgroundLayoutMapping[topNode.id] = {
                    vertical: {},
                    horizontal: {},
                    node: topNode,
                }
            },
            (level, sequence, node) => {
                const layoutMapping = playgroundLayoutMapping[currentTopNodeId];
                if(!layoutMapping.vertical[level]){
                    layoutMapping.vertical[level] = {};
                }
                layoutMapping.vertical[level][sequence] = node;
                
                if(!layoutMapping.horizontal[sequence]){
                    layoutMapping.horizontal[sequence] = {};
                }
                layoutMapping.horizontal[sequence][level] = node;
            })

        this.layoutMapping = layoutMapping;
        this.playgroundLayoutMapping = playgroundLayoutMapping;
        this.root.makeLink((configs) => {
            this.flowLinkStack.push(configs)
        })
    }

    staticCheck(instance, jflow) {

        if(instance._layoutNode && instance._layoutNode.isFree) {
            return false;
        }
        const finded = jflow._linkStack.find(l => l.from === instance || l.to === instance);
        if(!finded) {
            return false;
        }
        const nowAnchor = instance.anchor.slice();
        jflow.reflow();
        if(jflow._linkStack.length < 2) return;
        const currentAnchor = instance.anchor;
        const d = dist2(nowAnchor, currentAnchor);
        if(d > 1000) {
            console.log(instance)
            instance.dispatchEvent(new JFlowEvent('outOfFlow', {
                anchor: nowAnchor,
                instance,
                jflow,
                point: nowAnchor,
            }))
            return true;
        }
        return false;
    }

    reflowByMapping(layoutMapping, x = 0, y = 0) {
        const linkLength = this.linkLength;
        const gap = this.gap;
        const {
            vertical: verticalMapping,
            horizontal: horizontalMapping,
        } = layoutMapping;

        let reduceWidth = x;
        Object.keys(horizontalMapping).forEach((columnNumber, idx) => {
            const column = horizontalMapping[columnNumber];
            let rowWidth = 0;
            const rows = Object.keys(column)
            rows.forEach(rowNumber => {
                const ast = column[rowNumber];
                const instance = ast.getJflowInstance();
                const { width } = instance.getBoundingDimension();
                rowWidth = Math.max(width, rowWidth);
            });
            reduceWidth += idx === 0 ? 0: rowWidth/2
            rows.forEach(rowNumber => {
                const ast = column[rowNumber];
                const instance = ast.getJflowInstance();
                instance.anchor[0] = reduceWidth;
            });
            reduceWidth += (rowWidth/2 + gap) ;
        });

        let reduceHeight = y;
        // console.log(verticalMapping)
        Object.keys(verticalMapping).forEach((rowNumber, idx) => {
            const row = verticalMapping[rowNumber];
            let rowHeight = 0;
            const columns = Object.keys(row)
            columns.forEach(columnNumber => {
                const ast = row[columnNumber];
                const instance = ast.getJflowInstance();
                const { height, width } = instance.getBoundingDimension();
                rowHeight = Math.max(height, rowHeight);
            });
            reduceHeight += idx === 0 ? 0 : rowHeight/2;
            columns.forEach(columnNumber => {
                const ast = row[columnNumber];
                const instance = ast.getJflowInstance();
                instance.anchor[1] = reduceHeight;
            });
            reduceHeight += (rowHeight/2 + linkLength) ;
        });
        
    }

    findLayoutNode(configs) {
        const finded = this.flowStack.find(node => node.configs === configs);
        if(finded) {
            return finded.layoutMeta;
        }
        return null;
    }

    reflow(jflow){
        this.reflowByMapping(this.layoutMapping);
        Object.values(this.playgroundLayoutMapping).forEach(mapping => {
            const node = mapping.node.getJflowInstance();
            this.reflowByMapping(mapping, node.anchor[0], node.anchor[1]);
        })
    }
}

export default LowcodeLayout;