/**
 * 绘图栈
 * @extends Array
 */
class InstanceStack extends Array {
    constructor() {
        super();
    }
    /**
     * 绘制当前栈
     * @param {Context2d} ctx - canvas context2d
     */
    render(ctx) {
        let movingTarget;
        this.forEach(instance => {
            if(instance._isMoving) {
                movingTarget = instance;
                return;
            }
            if(instance.visible) {
                ctx.save();
                // if(instance.reflow && !instance._reflowed) {
                //     instance.reflow();
                //     instance._reflowed = true;
                // }
                instance.render(ctx);
                ctx.restore();
            }
        });
        if(movingTarget) {
            ctx.save();
            // if(movingTarget.reflow && !movingTarget._reflowed) {
            //     movingTarget.reflow();
            //     movingTarget._reflowed = true;
            // }
            movingTarget.render(ctx);
            ctx.restore();
        }
    }

    /**
     * 碰撞对象过滤条件
     * @name InstanceStack~InstanceFilter
     * @function
     * @param {Instance} instance - 当前对象
    */
    /**
     * 碰撞检测
     * @param {number[]} point - 碰撞点
     * @param {InstanceStack~InstanceFilter} condition - 碰撞对象过滤条件
     * @return {Instance}
     */
    checkHit(point, condition){
        let i = this.length - 1;
        while(i >= 0) {
            const instance = this[i];
            
            if(instance.visible && !instance.ignoreHit) {
                if(condition && condition(instance)) {
                    i--
                    continue;
                }
                const ishit = instance.isHit(point, condition);
                instance._isHit = !!ishit;
                if(ishit) {
                    if(typeof ishit !== 'boolean') {
                        return ishit;
                    }
                    return instance;
                }
                
            }
            i--
        }

        return null;
    }
    /**
     * 获取当前层栈的最小外接矩形
     * @return {number[][]} - 外接矩形坐标
     */
    getBoundingRectPoints() {
        const points = [];
        this.forEach(instance => {
            if(instance.visible) {
                points.splice(points.length, 0, ...instance.getBoundingRect());
            }
        });
        return points;
    }
}

export default InstanceStack;
