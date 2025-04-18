// import { NodePlaceholder } from './node-placeholder';
/**
 * 绘图栈
 * @extends Array
 */
class InstanceStack extends Array {
    constructor() {
        super();
        this._currentHit = null;
    }

    forEach(cb) {
        return super.forEach((i, idx) => {
            if(i.type === 'NODE_PLACEHOLDER') { 
                return;
            }
            cb(i, idx);
        })
    }
    filter(cb) {
        return Array.from(super.filter((i, idx) => {
            if(i.type === 'NODE_PLACEHOLDER') { 
                return false;
            }
            return cb(i, idx);
        }))
    }
    slice() {
        return Array.from(super.filter((i, idx) => {
            return i.type !== 'NODE_PLACEHOLDER'
        }))
    }
    superfilter(cb) {
        return super.filter((i, idx) => {
            return cb(i, idx);
        });
    }
    /**
     * 绘制当前栈
     * @param {Context2d} ctx - canvas context2d
     */
    render(ctx, condition) {
        let movingTarget;
        this.forEach(instance => {
            if(instance._isMoving) {
                movingTarget = instance;
                return;
            }
            if(instance.visible && (!condition || condition(instance))) {
                if(instance.beforeRender) {
                    if(!instance.beforeRender(ctx)){
                        return;
                    }
                }
                ctx.save();
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

    resetHitStatus() {
        this._currentHit = null;
        this.forEach(i => {
            if(i._stack) {
                i._stack.resetHitStatus();
            }
            i._isHit = false;
        })
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
    checkHit(point, condition, currentConstraint){
        let i = this.length - 1;
        while(i >= 0) {
            const instance = this[i];
            if(instance.type === 'NODE_PLACEHOLDER') { 
                i--
                continue;
            }
            if(instance.visible && !instance.ignoreHit) {
                if(condition && condition(instance)) {
                    i--
                    continue;
                }
                if(currentConstraint && !currentConstraint(instance)) {
                    i--
                    continue
                }
                const ishit = instance.isHit(point, condition);
                
                if(ishit) {
                    if(this._currentHit !== instance) {
                        if(this._currentHit) {
                            this._currentHit._isHit = false;
                        }
                        instance._isHit = true;
                        this._currentHit = instance;
                    }
                    if(typeof ishit !== 'boolean') {
                        return ishit;
                    }
                    return instance;
                } else {
                    instance._isHit = false;
                }
                
            }
            i--
        }
        if(this._currentHit) {
            this._currentHit._isHit = false;
        }
        this._currentHit = null;
        return null;
    }
    /**
     * 获取当前层栈的最小外接矩形
     * @return {number[][]} - 外接矩形坐标
     */
    getBoundingRectPoints() {
        const points = [];
        this.forEach(instance => {
            if(instance.visible && !instance.absolutePosition) {
                const rect = instance.getBoundingRect()
                points.push([rect[0], rect[1]]);
                points.push([rect[2], rect[3]]);
            }
        });
        return points;
    }

    /**
     * 获取当前层栈的锚点矩形
     * @return {number[][]} - 锚点矩形坐标
     */
    getAnchorRectPoints() {
        const points = [];
        this.forEach(instance => {
            if(instance.visible && !instance.absolutePosition) {
                points.push(instance.anchor);
            }
        });
        return points;
    }
}

export default InstanceStack;
