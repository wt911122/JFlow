/**
    tree layout
    + link
        root to leafs, level by level
    + no link blocks 
        top to bottom, no overlap
 */
import JFlowEvent from '../events'; 

function getInstanceHeight(instance) {
    const rect = instance.getBoundingRect();
    let min_y = Infinity;
    let max_y = -Infinity;
    let min_x = Infinity;
    let max_x = -Infinity;
    rect.forEach(point => {
        max_y = Math.max(max_y, point[1]);
        min_y = Math.min(min_y, point[1]);
        max_x = Math.max(max_x, point[0]);
        min_x = Math.min(min_x, point[0]);
    });
    return {
        height: max_y - min_y,
        width: max_x - min_x,
    }
}

function iterateLinks(
    reduceHeight,
    lastLevelHeight,
    links,
    linkLength,
    target, 
    stack,
) {
    let levelHeight = 0;
    const to = [];
    const nextLinks = [];
    links.forEach(l => {
        if(l.from === target && !stack.includes(l.to)) {
            const { height, width } = getInstanceHeight(l.to);
            levelHeight = Math.max(levelHeight, height);
            to.push(l.to);
            stack.push(l.to)
        } else {
            nextLinks.push(l);
        }
    });
    reduceHeight += (levelHeight/2 + linkLength + lastLevelHeight);
    lastLevelHeight = levelHeight / 2;
    to.forEach(t => {
        t.anchor = [0, reduceHeight];
        iterateLinks(reduceHeight, lastLevelHeight, nextLinks, linkLength, t, stack)
    });
}

// function (root, links, options) {
//     let level = 0;
//     const linkLength = options.linkLength || 18;
//     root.anchor = [0, 0];
//     const stack = [root];
    
//     const { height: reduceHeight } = getInstanceHeight(root) / 2;

//     iterateLinks(reduceHeight, links, linkLength, root, stack);
// }
function sqr(x) {
    return x * x;
}
function dist2(v, w) {
    return sqr(v[0] - w[0]) + sqr(v[1] - w[1]);
}
class TreeLayout {
    constructor(configs) {
        this.linkLength = configs.linkLength || 18;
        this.root = configs.root;
        this.static = true;

    }

    staticCheck(instance, jflow) {
        const finded = jflow._linkStack.find(l => l.from === instance || l.to === instance);
        if(!finded) {
            return false;
        }
        const nowAnchor = instance.anchor.slice();
        jflow.reflow();
        if(jflow._linkStack.length < 2) return;
        const currentAnchor = instance.anchor;
        const d = dist2(nowAnchor, currentAnchor);
        debugger
        if(d > 1000) {
            console.log(instance)
            instance.dispatchEvent(new JFlowEvent('outOfFlow', {
                anchor: nowAnchor,
                instance,
                jflow,
                // reflowCallback: () => {
                //     // const {
                //     //     toInstances
                //     // } = jflow.removeLinkOnInstance(instance);
                //     debugger
                //     jflow.recalculate();
                //     jflow.reflow();
                //     jflow._render();
                //     debugger
                // }
            }))
            /* 
                在具体支持的逻辑实现中处理这种事件好了
                示例代码：
                const {
                    toInstances
                } = jflow.removeLinkOnInstance(instance);
                if(instance === this.root) {
                    this.root = toInstances[0];
                }
                instance.anchor = nowAnchor;
                jflow.recalculate();
                jflow.reflow();
            */
            return true;
        }
        return false;
    }

    reflow(jflow){
        const links = jflow._linkStack;
        const instances = jflow._stack;
        const linkLength = this.linkLength;
        layoutAlgorithm(instances, links, linkLength)
        debugger
        // if(!this.root) {
        //     this.root = instances[0];
        // }
        // const root = this.root;
        // let level = 0;
        // const linkLength = this.linkLength;
        // root.anchor = [0, 0];
        // const stack = [root];
        
        // const { height } = getInstanceHeight(root);
        // const reduceHeight = 0;
        // iterateLinks(reduceHeight, height/2, links, linkLength, root, stack);
    }
}
function calculateLevelMap(instances, links) {
    const root = instances[0];
    root._level = 1;
    const stack = [root];
    const levelMap = {};
    levelMap[1] = [root];
    while (stack.length > 0) {
        const t = stack.pop();
        links.forEach(l => {
            if(l.from === t) {
                const toInstance = l.to;
                const newLevel =  t._level + 1;
                if(!levelMap[newLevel]) {
                    levelMap[newLevel] = [];
                }
                if(toInstance._level && toInstance._level < newLevel) {
                    const index = levelMap[toInstance._level].findIndex(i => i === toInstance);
                    ~index && levelMap[toInstance._level].splice(index, 1);
                    toInstance._level = newLevel;
                    toInstance._levels.push(newLevel);
                    levelMap[newLevel].push(toInstance);
                    stack.push(toInstance);
                }

                if(!toInstance._level) {
                    toInstance._level = newLevel;
                    toInstance._levels = [newLevel];
                    levelMap[newLevel].push(toInstance);
                    stack.push(toInstance);
                }
            }
        });
    }
    links.sort((a, b) => Math.abs(a.from._level - a.to._level) - Math.abs(b.from._level - b.to._level) )
    
    return levelMap;
}
function layoutAlgorithm(instances, links, linkLength) {
    const root = instances[0];
    const levelMap = calculateLevelMap(instances, links)
    const { height } = getInstanceHeight(root);
    let reduceHeight = 0;
    let offsetLevels = [];
    let levelOffsetsInterator = [1];
    const levelOffsets = {};
    console.log('start')
    Object.keys(levelMap).forEach(levelKey => {
        const level = levelMap[levelKey];
        level.forEach(i => {
            const level = i._level;
            const levels = i._levels || [];
            levels.slice(0, levels.length - 1).forEach(lk => {
                // if(!levelOffsetsInterator.includes(lk)) {
                const maxLK = Math.max(...levelOffsetsInterator)
                while (lk < maxLK && !levelOffsetsInterator.includes(lk)) {
                    // const mutatelevel = level - lk + 1;
                    // if(level - mutatelevel > 1) {
                    //     levelOffsetsInterator.push(lk);
                    //     break;
                    // } 
                    levelOffsets[level - lk + 1] = 200;
                    levelOffsetsInterator.push(lk);
                    lk++;
                     console.log(lk, level - lk + 1)
                }
                    // console.log('insert')
                    // console.log(lk, level - lk)
                // }
            })
        })
        levelOffsetsInterator = levelOffsetsInterator.map(p => p + 1);
         console.log(levelOffsetsInterator)
    })
   
    Object.keys(levelMap).forEach(levelKey => {
        const level = levelMap[levelKey];
        let levelHeight = 0;
        let anchorX = levelOffsets[levelKey] || 0;
        level.forEach(i => {
            const { height, width } = i.getBoundingDimension();
            console.log(width)
            levelHeight = Math.max(height, levelHeight);
            i.anchor[0] = anchorX;
            anchorX += (width + 20);
        });
        reduceHeight += levelHeight/2
        level.forEach(i => {
            i.anchor[1] = reduceHeight;
        });
        reduceHeight += (levelHeight/2 + linkLength) ;
    });
    instances.forEach(i => { 
        i._level = undefined;
        i._levels = undefined;
    });
    // Object.values(levelMap).slice().reverse().forEach(level => {
    //     let levelHeight = 0;
    //     let anchorX = 0;
    //     level.forEach(i => {
    //         const levels = i._levels;
    //         const { height, width } = i.getBoundingDimension();
    //         levelHeight = Math.max(height, levelHeight);
    //         i.anchor[0] = anchorX;
    //         anchorX += (width + 20);
    //     });
    //     reduceHeight += levelHeight/2
    //     level.forEach(i => {
    //         i.anchor[1] = reduceHeight;
    //     });
    //     reduceHeight += (levelHeight/2 + linkLength)
    // })
    // Object.values(levelMap).forEach(level => {
    //     let levelHeight = 0;
    //     let anchorX = 0;
    //     level.forEach(i => {
    //         const levels = i._levels;
    //         const { height, width } = i.getBoundingDimension();
    //         levelHeight = Math.max(height, levelHeight);
    //         i.anchor[0] = anchorX;
    //         anchorX += (width + 20);
    //     });
    //     reduceHeight += levelHeight/2
    //     level.forEach(i => {
    //         i.anchor[1] = reduceHeight;
    //     });
    //     reduceHeight += (levelHeight/2 + linkLength)
    // });
}

export default TreeLayout;