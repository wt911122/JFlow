const queue = [];
const clearQueue = [];
let queueSet = new WeakSet();

const checkWork = (target) => {
    return queueSet.has(target);
}  

const getStackPath = (node) => {
    let t = node;
    let exp = 1;
    let p = '';
    while(t && t._belongs) {
        const idx = t._belongs._stack.findIndex(n => n === t);
        p = idx + (p && ('.' + p))
        t = t._belongs;
    }
    return p;
}

const sortByPath = () => {
    const map = new WeakMap();
    queue.sort((a, b) => {
        let apath = map.get(a);
        if(apath === undefined) {
            apath = getStackPath(a);
            map.set(a, apath);
        }
        let bpath = map.get(b);
        if(bpath === undefined) {
            bpath = getStackPath(b);
            map.set(b, bpath);
        }
        const _a = apath.split('.')
        const _b = bpath.split('.')
        if(_a.length < _b.length) { 
            return 1;
        } 
        if(_a.length > _b.length) { 
            return -1;
        } 
        for(let i=0;i<_a.length;i++) {
            const _p = +_a[i];
            const _q = +_b[i];
            if(_p < _q) {
                return 1;
            }
            if(_p > _q) {
                return -1;
            }
        }
        return 0;
    })
}


export const addClearSourceWork = (jflow, source) => {
    clearQueue.push([jflow, source]);
}

// work is sync function!!
export const addReflowWork = (target, parent) => {
    
    if(target.doRecalculate) {
        if(!queueSet.has(target)) {
            queue.push(target);
            queueSet.add(target)
        }
    } 
    if(parent && parent.doRecalculate && !queueSet.has(parent)) {
        queue.push(parent);
        queueSet.add(parent)
    }
   
    // if(target.doRecalculate) {
    //     if(!checkWork(target)) {
    //         queue.push(target);
    //         queueSet.add(target);
    //     }
    // }  
    // if(parent) {
    //     if(checkWork(parent)) {
    //         const idx = queue.findIndex(p => p === parent);
    //         queue.splice(idx, 1);
    //         queue.push(parent);
    //     } else {
    //         queue.push(parent);
    //         queueSet.add(parent);
    //     }

    // }
    flush();
}
let inFlush = false;
const flush = () => {
    if(inFlush) {
        return;
    }
    inFlush = true;
    requestAnimationFrame(() => {
        const roots = new Set();
        sortByPath();
        while(queue.length) {
            const target = queue.shift();
            if(target.doRecalculate && target._jflow) {
                target.doRecalculate();
                roots.add(target._jflow);
            }
            // console.log(target.width, target.height)
        }
        while(clearQueue.length) {
            const [jflow, source] = clearQueue.shift();
            if(!jflow.getRenderNodeBySource(source)){
                jflow.clearSource(source);
            }
        }
        // console.log('-----dirty---flush-----')
        queueSet = new WeakSet();
        inFlush = false
        Array.from(roots).forEach(jflow => {
            jflow._render();
        });
    });
}