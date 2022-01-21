/**
    线性布局

    排列方向
    direction:
        + vertical 从上至下排布
        + horizontal 从左至右排布
    
    不重叠，中线对齐
    只针对当前的 group

    对齐方式
    alignment: 
        + start 主轴左侧对齐
        + center 主轴对齐
        + end   主轴右侧对齐
    justify: 
        + start 开始时对齐
        + center 居中对齐
        + end   末尾对齐
        + space-between 平均分配空间对齐

 * @implements {Layout}
 */

class LinearLayout {
    constructor(configs = {}) {
        /**
         * 通用样式属性
         * @property {string} direction     - 排列方向 默认 vertical
         * @property {number} gap           - 边距
         * @property {string} alignment     - 对齐方式 默认 center
         */
        this.direction =     configs.direction || 'vertical';
        this.gap =           configs.gap ?? 5;
        this.alignment =     configs.alignment || 'center';
        this.justify =       configs.justify || 'center';
        this._rawConfigs = configs;
    }


    reflow(group) {
        const stack = group._stack.filter(instance => instance.visible && !instance.outOfFlow);
        const groupWidth = group.width - group.padding.left - group.padding.right;
        // console.log(groupWidth, group.height, group)
        if(this.direction === 'vertical') {
            let reduceHeight = 0;
            let lastInstanceHeight = 0;
            let maxWidth = 0;
            let allHeight = 0;
            stack.forEach((instance, idx) =>  {
                const { width, height } = instance.getBoundingDimension();
                // console.log(height, instance.type);
                const gap = (idx > 0 ? this.gap : 0);
                maxWidth = Math.max(width, maxWidth);
                allHeight += (height + gap);
                reduceHeight += (height/2 + gap + lastInstanceHeight)
                lastInstanceHeight = height / 2;
                instance.anchor = [0, reduceHeight];
            });
            maxWidth = Math.max(groupWidth, maxWidth);
            
            allHeight = allHeight/2;
            if(this.alignment === 'start') {
                stack.forEach((instance, idx) =>  {
                    const { width } = instance.getBoundingDimension();
                    instance.anchor[0] = -(maxWidth - width) / 2;
                    instance.anchor[1] -= allHeight;
                    // console.log(maxWidth, width, instance.anchor[0])
                })
            }
            if(this.alignment === 'end') {
                stack.forEach((instance, idx) =>  {
                    const { width } = instance.getBoundingDimension();
                    instance.anchor[0] = (maxWidth - width) / 2;
                    instance.anchor[1] -= allHeight;
                })
            }
            if(this.alignment === 'center') {
                stack.forEach((instance, idx) =>  {
                    const { width } = instance.getBoundingDimension();
                    instance.anchor[1] -= allHeight;
                })
            }

        } 
        if(this.direction === 'horizontal') {
            let reduceWidth = 0;
            let lastInstanceWidth = 0;
            let maxHeight = 0;
            let allWidth = 0;
            let allPureWidth = 0;
            
            stack.forEach((instance, idx) =>  {
                const { width, height } = instance.getBoundingDimension();
                const gap = (idx > 0 ? this.gap : 0);
                maxHeight = Math.max(height, maxHeight);
                allWidth += (width+gap);
                allPureWidth += width;
                reduceWidth += (width/2 + gap + lastInstanceWidth)
                lastInstanceWidth = width / 2;
                instance.anchor = [reduceWidth, 0]
            });
            if(this.justify === 'start') {
                const withdraw = groupWidth/2;
                stack.forEach((instance, idx) => {
                    instance.anchor[0] -= withdraw;
                });  
            }
            if(this.justify === 'end') {
                const withdraw = groupWidth/2 - allWidth;
                stack.forEach((instance, idx) => {
                    instance.anchor[0] += withdraw;
                });  
            }
            if(this.justify === 'center') { 
                const withdraw = allWidth / 2;
                stack.forEach((instance, idx) => {
                    instance.anchor[0] -= withdraw;
                })                
            }
            if(this.justify === 'space-between' && stack.length > 1) {
                const width = Math.max(groupWidth, allWidth);
                const gapAverage = (width - allWidth) / (stack.length - 1);
                const withdraw = width/2;
                stack.forEach((instance, idx) => {
                    instance.anchor[0] += ((gapAverage * idx) - withdraw);
                });  
            }
            if(this.alignment === 'start') {
                stack.forEach((instance, idx) => {
                    const { height } = instance.getBoundingDimension();
                    instance.anchor[1] = -(maxHeight - height) / 2;
                })
            }
            if(this.alignment === 'end') {
                stack.forEach((instance, idx) => {
                    const { height } = instance.getBoundingDimension();
                    instance.anchor[1] = (maxHeight - height) / 2;
                })
            }
        }
    }

    clone() {
        return new LinearLayout(this._rawConfigs);
    }
}

export default LinearLayout;