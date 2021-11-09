/**
    
    direction:
        + vertical 从上至下排布
        + horizontal 从左至右排布
    不重叠，中线对齐
    只针对当前的 group


    alignment: 
        + start 主轴左侧对齐
        + center 主轴对齐
        + end   主轴右侧对齐
 */

class LinearLayout {
    constructor(configs = {}) {
        this.direction =     configs.direction || 'vertical';
        this.gap =           configs.gap || 5;
        this.alignment =     configs.alignment || 'center';
    }

    reflow(group) {
        const stack = group._stack.filter(instance => instance.visible && !instance.outOfFlow);
        // console.log(this, stack)
        if(this.direction === 'vertical') {
            let reduceHeight = 0;
            let lastInstanceHeight = 0;
            let maxWidth = 0;
            stack.forEach((instance, idx) =>  {
                const { width, height } = instance.getBoundingDimension();
                maxWidth = Math.max(width, maxWidth);
                reduceHeight += (height/2 + (idx > 0 ? this.gap : 0) + lastInstanceHeight)
                lastInstanceHeight = height / 2;
                instance.anchor = [0, reduceHeight];
            });

            if(this.alignment === 'start') {
                stack.forEach((instance, idx) =>  {
                    const { width } = instance.getBoundingDimension();
                    instance.anchor[0] = -(maxWidth - width) / 2;
                })
            }
            if(this.alignment === 'end') {
                stack.forEach((instance, idx) =>  {
                    const { width } = instance.getBoundingDimension();
                    instance.anchor[0] = (maxWidth - width) / 2;
                })
            }
        } 
        if(this.direction === 'horizontal') {
            let reduceWidth = 0;
            let lastInstanceWidth = 0;
            let maxHeight = 0;
            stack.forEach((instance, idx) =>  {
                const { width, height } = instance.getBoundingDimension();
                maxHeight = Math.max(height, maxHeight);
                reduceWidth += (width/2 + (idx > 0 ? this.gap : 0) + lastInstanceWidth)
                lastInstanceWidth = width / 2;
                instance.anchor = [reduceWidth, 0]
            });

            if(this.alignment === 'start') {
                stack.forEach((instance, idx) =>  {
                    const { height } = instance.getBoundingDimension();
                    instance.anchor[1] = -(maxHeight - height) / 2;
                })
            }
            if(this.alignment === 'end') {
                stack.forEach((instance, idx) =>  {
                    const { height } = instance.getBoundingDimension();
                    instance.anchor[1] = (maxHeight - height) / 2;
                })
            }
        }
    }
}

export default LinearLayout;