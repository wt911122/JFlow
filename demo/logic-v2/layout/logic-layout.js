
import { makeAST } from './base-node';

class LogicLayout {
    constructor(source) {
        this.rowGap = 30;
        this.columnGap = 75;
        this.columnWidth = 189;
        this.rowHeight = 32;
        this.flowStack = [];
        this.flowLinkStack = [];
        this.source = null;
        this.static = true;
        this.reOrder(source)
    }

    staticCheck(instance, jflow) {
        jflow.reflow();
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

        const layoutMapping = {
            vertical: {},
            horizontal: {},
        };
        this.root.reflowBodyPreCalculate(0, 0, (row, column, node) => {
            if (!layoutMapping.vertical[row]) {
                layoutMapping.vertical[row] = {};
            }
            layoutMapping.vertical[row][column] = node;

            if (!layoutMapping.horizontal[column]) {
                layoutMapping.horizontal[column] = {};
            }
            layoutMapping.horizontal[column][row] = node;
        });

        this.layoutMapping = layoutMapping;


        this.root.makeLink((configs) => {
            // console.log(configs)
            if(configs.roundCorner) {
                // console.log(configs.roundCorner);
                const [x, y] = configs.roundCorner;
                configs.bendPoint = [
                    x * (this.columnWidth + this.columnGap) + this.columnWidth /2 + 15,
                    y * (this.rowHeight + this.rowGap) - this.rowHeight / 2 - 10
                ]
            }
            this.flowLinkStack.push(configs);
        });
        console.log(layoutMapping)
        // console.log(this.source);
        // console.log(this.flowStack.map(t => t.type))
    }

    reflow(jflow) {
        const rowGap = this.rowGap;
        const columnGap = this.columnGap;

        const layoutMapping = this.layoutMapping;

        // const {
        //     vertical: verticalMapping,
        //     horizontal: horizontalMapping,
        // } = layoutMapping;
        
        this.flowStack.forEach(({ layoutNode }) => {
            const { row, column, source } = layoutNode;
            const instance = jflow.getRenderNodeBySource(source);
            instance.anchor = [
                column * (this.columnWidth + this.columnGap),
                row * (this.rowHeight + this.rowGap)
            ];
        });

        this.flowLinkStack.forEach(linkConfig => {
            if (linkConfig.roundCorner) {
                const [x, y] = linkConfig.roundCorner;
                linkConfig.bendPoint = [
                    x * (this.columnWidth + this.columnGap) + 10,
                    y * (this.rowHeight + this.rowGap) - this.rowHeight / 2 - 10
                ]
            }
        });

       
        // this.root.reflowPreCalculate(0, 0, ({ row, column, layoutNode }) => {
        //     console.log(row, column, layoutNode.source.concept)
        //     const instance = jflow.getRenderNodeBySource(layoutNode.source);
        //     instance.setAnchor(columnAnchor[column], row * (rowGap + 32));
        // });
        
    }
}

export default LogicLayout;