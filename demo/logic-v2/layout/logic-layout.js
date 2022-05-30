import { JFlowEvent } from '@joskii/jflow'
import { makeAST } from './base-node';
import { layoutConstance, getLayoutConstance, getSourceAnchor } from './utils';
import { dist2 } from '../src/custom/utils'
class LogicLayout {
    constructor(source) {
        // this.rowGap = layoutConstance.rowGap;
        // this.columnGap = layoutConstance.columnGap;
        // this.columnWidth = layoutConstance.columnWidth;
        // rowHeight = layoutConstance.rowHeight;
        this.flowStack = [];
        this.flowLinkStack = [];
        this.source = null;
        this.static = true;
        this.reOrder(source)
    }

    staticCheck(instance, jflow) {
        console.log(this.flowStack[0].source)
        const nowAnchor = instance.anchor.slice();
        let layoutAnchor = null;
        let i = 0;
        for (let i = 0; i < this.flowStack.length; i++) {
            console.log(this.flowStack[i].source)
            const { source, layoutNode } = this.flowStack[i];
            const j = jflow.getRenderNodeBySource(source); // ast.getJflowInstance();
            if(j === instance) {
                const rowGap = getLayoutConstance('rowGap');
                const rowHeight = getLayoutConstance('rowHeight');
                const columnWidth = getLayoutConstance('columnWidth');
                const columnGap = getLayoutConstance('columnGap');
                const rootLayoutNode = layoutNode.rootLayoutNode;
                let ax = 0;
                let ay = 0;
                if(rootLayoutNode) {
                    const [x, y] = getSourceAnchor(jflow, rootLayoutNode.source)
                    ax = x;
                    ay = y;
                }
                const { row, column, source } = layoutNode;
                layoutAnchor = [
                    column * (columnWidth + columnGap) + ax,
                    row * (rowHeight + rowGap) + ay,
                ];
                break;
            }
        }
        if(!layoutAnchor) {
            jflow.reflow();
            return false;
        } 
       
        const d = dist2(nowAnchor, layoutAnchor);
        if (d > 1000) {
            instance.dispatchEvent(new JFlowEvent('outOfFlow', {
                anchor: nowAnchor,
                instance,
                jflow,
                point: nowAnchor,
            }));
            return true;
        } else {
            jflow.reflow();
        }
        return false;
    }

    reOrder(source) {
        this.source = source;
        this.flowStack = [];
        this.flowLinkStack = [];

        this.root = makeAST(this.source);

        this.root.traverse((node) => {
            if (node.concept === 'Switch' || node.concept === 'Logic') {
                return;
            }

            this.flowStack.push({
                type: node.type,
                source: node.source,
                layoutNode: node,
            }); 
        });

        // const layoutMapping = {
        //     vertical: {},
        //     horizontal: {},
        // };
        this.root.reflowBodyPreCalculate(0, 0, (row, column, node) => {
            //console.log(column, row, node.concept, node.source.content)
        })

        this.root.reflowPlaygroundPreCalculate(() => {});
        // this.root.reflowBodyPreCalculate(0, 0, (row, column, node) => {
        //     if (!layoutMapping.vertical[row]) {
        //         layoutMapping.vertical[row] = {};
        //     }
        //     layoutMapping.vertical[row][column] = node;

        //     if (!layoutMapping.horizontal[column]) {
        //         layoutMapping.horizontal[column] = {};
        //     }
        //     layoutMapping.horizontal[column][row] = node;
        // });

        // this.layoutMapping = layoutMapping;
        const rowGap = getLayoutConstance('rowGap');
        const rowHeight = getLayoutConstance('rowHeight');
        const columnWidth = getLayoutConstance('columnWidth');
        const columnGap = getLayoutConstance('columnGap');

        this.root.makeLink((configs) => {
            // console.log(configs)
            const sourceLayoutNode = configs.from;
            const { column, row } = sourceLayoutNode
            if(configs.roundCorner) {
                
                // console.log(configs.roundCorner);
                if (configs.roundCorner.length === 2) {
                    const [x, y] = configs.roundCorner;
                    configs.bendPoint = [
                        (x) * (columnWidth + columnGap) + columnWidth /2 + 15,
                        (y) * (rowHeight + rowGap) - rowHeight / 2 + 10,
                    ]
                }
                if (configs.roundCorner.length === 4) {
                    const [x1, y1, x2, y2] = configs.roundCorner;
                    configs.bendPoint = [
                        (x1) * (columnWidth + columnGap),
                        (y1) * (rowHeight + rowGap),
                        (x2) * (columnWidth + columnGap) + columnWidth /2 + 15,
                        (y2) * (rowHeight + rowGap) - rowHeight / 2 + 10,
                    ]
                }
            } else {
                configs.bendPoint = []
            }
            if(configs.endRow) {
                const iterateEndY = (configs.endRow - row) * (rowHeight + rowGap);
                configs.iterateEndY = iterateEndY;
            } else {
                configs.iterateEndY = undefined
            }
            if(configs.minSpanColumn !== undefined) {
                console.log('spanConsquent', configs.minSpanColumn)
                configs.minSpanX += (configs.minSpanColumn - 1) * (columnWidth + columnGap);
            }

            if(sourceLayoutNode.source.concept === 'If') {
                configs.content = (configs.part === 'alternate' ? 'No' : 'Yes');
            }
            if(sourceLayoutNode.source.concept === 'While') {
                configs.content = (configs.part === 'whilebody' ? 'Yes' : 'No');
            }
            this.flowLinkStack.push(configs);
        });
        // console.log(layoutMapping)
        // console.log(this.source);
        // console.log(this.flowStack.map(t => t.type))
    }

    reflow(jflow) {
        // const rowGap = rowGap;
        // const columnGap = columnGap;
        const rowGap = getLayoutConstance('rowGap');
        const rowHeight = getLayoutConstance('rowHeight');
        const columnWidth = getLayoutConstance('columnWidth');
        const columnGap = getLayoutConstance('columnGap');
        // const layoutMapping = this.layoutMapping;

        // const {
        //     vertical: verticalMapping,
        //     horizontal: horizontalMapping,
        // } = layoutMapping;
        
        this.flowStack.forEach(({ layoutNode }) => {
            const rootLayoutNode = layoutNode.rootLayoutNode;
            let ax = 0;
            let ay = 0;
            if(rootLayoutNode) {
                const [x, y] = getSourceAnchor(jflow, rootLayoutNode.source)
                // const i = jflow.getRenderNodeBySource(rootLayoutNode.source);
                ax = x;
                ay = y;
            }
            const { row, column, source } = layoutNode;
            const instance = jflow.getRenderNodeBySource(source);
            instance.anchor = [
                column * (columnWidth + columnGap) + ax,
                row * (rowHeight + rowGap) + ay,
            ];
        });

        // this.flowLinkStack.forEach(linkConfig => {
        //     if (linkConfig.roundCorner) {
        //         const [x, y] = linkConfig.roundCorner;
        //         linkConfig.bendPoint = [
        //             x * (this.columnWidth + this.columnGap) + 10,
        //             y * (rowHeight + this.rowGap) - rowHeight / 2 - 10
        //         ]
        //     }
        // });

       
        // this.root.reflowPreCalculate(0, 0, ({ row, column, layoutNode }) => {
        //     console.log(row, column, layoutNode.source.concept)
        //     const instance = jflow.getRenderNodeBySource(layoutNode.source);
        //     instance.setAnchor(columnAnchor[column], row * (rowGap + 32));
        // });
        
    }
}

export default LogicLayout;