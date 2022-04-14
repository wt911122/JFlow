
import { makeAST } from './base-node';

class LogicLayout {
    constructor(source) {
        this.rowGap = 60;
        this.columnGap = 20;
        this.flowStack = [];
        this.flowLinkStack = [];
        this.source = null;
        this.static = false;
        this.reOrder(source)
    }

    reOrder(source) {
        this.source = source;
        this.flowStack = [];
        this.flowLinkStack = [];

        this.root = makeAST(this.source);

        this.root.traverse((node) => {
            if (node.type === 'SwitchCase') {
                return;
            }

            this.flowStack.push({
                type: node.type,
                source: node.source,
                layoutNode: node,
            }); 
        });

        this.root.makeLink((configs) => {
            if (configs.from.type !== 'End') {
                this.flowLinkStack.push(configs);
            }
        });

        const columnMap = {};
        this.root.reflowPreCalculate(0, 0, ({column, layoutNode }) => {
            if(!columnMap[column]) {
                columnMap[column] = [];
            }
            columnMap[column].push(layoutNode);
        });

        this.columnMap = columnMap;
        console.log(columnMap)
        console.log(this.source);
        console.log(this.flowStack.map(t => t.type))
    }

    reflow(jflow) {
        const rowGap = this.rowGap;
        const columnGap = this.columnGap;

        const columnMap = this.columnMap;
        const columnAnchor = [];
        let reduceWidth = 0;
        
        Object.keys(columnMap)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .forEach((k, idx) => {
                let w = 0;
                columnMap[k].forEach(layoutNode => {
                    const instance = jflow.getRenderNodeBySource(layoutNode.source);
                    const { width } = instance.getBoundingDimension();
                    w = Math.max(width, w);
                });
                reduceWidth += (idx === 0 ? 0 : w / 2);
                columnAnchor.push(reduceWidth);
                reduceWidth += (w / 2 + columnGap);
            });
        console.log(columnAnchor)
        this.root.reflowPreCalculate(0, 0, ({ row, column, layoutNode }) => {
            console.log(row, column, layoutNode.source.concept)
            const instance = jflow.getRenderNodeBySource(layoutNode.source);
            instance.setAnchor(columnAnchor[column], row * (rowGap + 32));
        });
        
    }
}

export default LogicLayout;