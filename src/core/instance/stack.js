class InstanceStack extends Array {
    constructor() {
        super();
    }

    render(ctx) {
        let movingTarget;
        this.forEach(instance => {
            if(instance._isMoving) {
                movingTarget = instance;
                return;
            }
            if(instance.visible) {
                ctx.save();
                if(instance.reflow && !instance._reflowed) {
                    instance.reflow();
                    instance._reflowed = true;
                }
                instance.render(ctx);
                ctx.restore();
            }
        });
        if(movingTarget) {
            ctx.save();
            if(movingTarget.reflow && !movingTarget._reflowed) {
                movingTarget.reflow();
                movingTarget._reflowed = true;
            }
            movingTarget.render(ctx);
            ctx.restore();
        }
    }

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
