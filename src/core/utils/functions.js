import {
    Bezier,
} from 'bezier-js';
import { DIRECTION } from './constance';

/**
 * 根据点计算最小外接矩形
 * @param {number[][]} points - 点集合
 * @return {Object} demension 宽高，坐标
 */
export function bounding_box(points) {
    let min_x = Infinity; 
    let min_y = Infinity; 
    let max_x = -Infinity; 
    let max_y = -Infinity; 
    for(let idx in points) {
        const item = points[idx];
        if(item[0] < min_x){
            min_x = item[0]
        }

        if (item[0] > max_x) {
            max_x = item[0]
        } 

        if (item[1] < min_y) {
            min_y = item[1]
        }

        if (item[1] > max_y) {
            max_y = item[1]
        }
    }
    return {
        // points: [(min_x,min_y),(max_x,min_y),(max_x,max_y),(min_x,max_y)],
        width: Math.max(max_x - min_x, 10),
        height: Math.max(max_y - min_y, 10),
        x: min_x,
        y: min_y,
    }
}

function sqr(x) {
    return x * x;
}
export function dist2(v, w) {
    return sqr(v[0] - w[0]) + sqr(v[1] - w[1]);
}

// p - point
// v - start point of segment
// w - end point of segment
export function distToSegmentSquared(p, v, w) {
    const l2 = dist2(v, w);
    if (l2 === 0) return dist2(p, v);
    let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
    t = Math.max(0, Math.min(1, t));
    return dist2(p, [ v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1]) ]);
}

export function minIntersectionBetweenNodes(dmsfrom, dmsto) {
    const meta = {
        fromDir: null,
        fromP: null,
        toDir: null,
        toP: null,
        distMin: Infinity
    }
    Object.keys(dmsfrom).forEach(df => {
        if((+df) === DIRECTION.SELF) {
            return;
        }
        let pf = dmsfrom[df];
        Object.keys(dmsto).forEach(dt => {
            if((+dt) === DIRECTION.SELF) {
                return;
            }
            let pt = dmsto[dt];
            const dist = dist2(pf, pt);
            if(dist < meta.distMin) {
                Object.assign(meta, {
                    distMin: dist,
                    fromDir: +df,
                    fromP: pf,
                    toDir: +dt,
                    toP: pt,
                })
            }
        })
    });
    return meta;
}

// export function bezierPoints(p1, p2, start_dir = DIRECTION.TOP, end_dir = DIRECTION.TOP, anticlock = false) {
//     const isSameDirection = start_dir === end_dir;
//     const isVerticalStart = [DIRECTION.TOP, DIRECTION.BOTTOM].includes(start_dir);   
//     const isVerticalEnd = [DIRECTION.TOP, DIRECTION.BOTTOM].includes(end_dir);
//     const arrowspan = [DIRECTION.TOP, DIRECTION.LEFT].includes(end_dir) ? -5 : 5;
//     const endX = isVerticalEnd ? p2[0] : p2[0] + arrowspan;
//     const endY = isVerticalEnd ? p2[1] + arrowspan : p2[1];
//     if(isSameDirection) {
//         let span = Math.abs(isVerticalStart ? (endY - p1[1]) : (endX - p1[0]))
//         span = Math.min(span, 50);
//         const symb = [DIRECTION.RIGHT, DIRECTION.BOTTOM].includes(end_dir)
//         span = symb ? span : - span;
//         const cp1 = isVerticalStart ? [p1[0], p1[1] + span] : [p1[0] + span, p1[1]];
//         const cp2 = isVerticalEnd ? [endX, endY + span] : [endX + span, endY];
//         return [ 
//             ...cp1,
//             ...cp2,
//             endX, endY ];
//     }
//     let spanStart = (anticlock ? -5 : 1) * (isVerticalStart ? (endY - p1[1]) / 2 : (endX - p1[0]) / 2)
//     let spanEnd = (anticlock ? -4 : 1) * (isVerticalEnd ? (p1[1] - endY) / 2 : (p1[0] - endX) / 2)
//     let u1 = spanStart / Math.abs(spanStart);
//     spanStart = u1 * Math.min(Math.abs(spanStart), 50);
//     let u2 = spanEnd / Math.abs(spanEnd);
//     spanEnd = u2 * Math.min(Math.abs(spanEnd), 50);
//     const cp1 = isVerticalStart ? [p1[0], p1[1] + spanStart] : [p1[0] + spanStart, p1[1]];
//     const cp2 = isVerticalEnd ? [endX, endY + spanEnd] : [endX + spanEnd, endY];
//     return [ 
//         ...cp1,
//         ...cp2,
//         endX, endY ];
// }
function _resolveControlPoint(p, dir, spanx, spany){
    if(dir === DIRECTION.TOP){
        return [p[0], p[1]-spany]
    }
    if(dir === DIRECTION.BOTTOM){
        return [p[0], p[1]+spany]
    }
    if(dir === DIRECTION.LEFT){
        return [p[0]-spanx, p[1]]
    }
    if(dir === DIRECTION.RIGHT){
        return [p[0]+spanx, p[1]]
    }
}

export function bezierPoints(p1, p2, start_dir = DIRECTION.TOP, end_dir = DIRECTION.TOP, minSpanX = 0, minSpanY = 0) {
    const spanx = Math.max(Math.abs((p1[0] - p2[0])/2), minSpanX);
    const spany = Math.max(Math.abs((p1[1] - p2[1])/2), minSpanY);
    const cp1 = _resolveControlPoint(p1, start_dir, spanx, spany);
    const cp2 = _resolveControlPoint(p2, end_dir, spanx, spany);
    const arrowspan = [DIRECTION.TOP, DIRECTION.LEFT].includes(end_dir) ? -5 : 5;
    const isVerticalEnd = [DIRECTION.TOP, DIRECTION.BOTTOM].includes(end_dir);
    const endX = isVerticalEnd ? p2[0] : p2[0] + arrowspan;
    const endY = isVerticalEnd ? p2[1] + arrowspan : p2[1];
    return [ 
        ...cp1,
        ...cp2,
        endX, endY];
}

export function bezierPoint(t, P) {
    const q = 1-t;
    const x = q*q*q*P[0] + 3*q*q*t*P[2] + 3*q*t*t*P[4] + t*t*t*P[6];
    const y = q*q*q*P[1] + 3*q*q*t*P[3] + 3*q*t*t*P[5] + t*t*t*P[7];
    const u = q*q*(P[2]-P[0]) + 2*t*q*(P[4]-P[2]) + t*t*(P[6]-P[4]);
    const v = q*q*(P[3]-P[1]) + 2*t*q*(P[5]-P[3]) + t*t*(P[7]-P[5]);
    let angle = Math.atan2(v, u);
    // console.log(angle * 180)
    // if(angle < 0) {
    //     angle = Math.PI + angle;
    // }
    return [x, y, angle];
}

// export function bezierPoints(p1, p2, start_vec, end_vec) {

// }

export function distToBezierSegmentSquared(p, points) {
    const b = new Bezier(...points);

    const point = b.project({ x: p[0], y: p[1] });
    const d = dist2(p, [ point.x, point.y ]);
    return d;
}

export function getBezierAngle(t, sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey) {
  var dx = Math.pow(1-t, 2)*(cp1x-sx) + 2*t*(1-t)*(cp2x-cp1x) + t * t * (ex - cp2x);
  var dy = Math.pow(1-t, 2)*(cp1y-sy) + 2*t*(1-t)*(cp2y-cp1y) + t * t * (ey - cp2y);
  return -Math.atan2(dx, dy) + 0.5*Math.PI;
}


export function getInstanceHeight(instance) {
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

export function polylinePoints(p1, p2, start_dir = DIRECTION.TOP, end_dir = DIRECTION.TOP, minSpanX = 10, minSpanY = 10, isSelf) {
    const dirSpan = Math.abs(start_dir - end_dir);
    // const spanx = Math.max(Math.abs((p1[0] - p2[0])/2), minSpanX);
    // const spany = Math.max(Math.abs((p1[1] - p2[1])/2), minSpanY);
    const isVerticalStart = (start_dir === DIRECTION.TOP || start_dir === DIRECTION.BOTTOM);
    let points = [];
    switch (dirSpan) {
        case 0:
            // 都按向右好了
            if(start_dir === DIRECTION.TOP) {
                const y = Math.min(p1[1], p2[1]);
                const yp = y - minSpanY;
                points.push([p1[0], yp]);
                points.push([p2[0], yp]);
            }
            if(start_dir === DIRECTION.BOTTOM) {
                const y = Math.max(p1[1], p2[1]);
                const yp = y + minSpanY;
                points.push([p1[0], yp]);
                points.push([p2[0], yp]);
            }
            if(start_dir === DIRECTION.LEFT) {
                const x = Math.min(p1[0], p2[0]);
                const xp = x - minSpanX;
                points.push([xp, p1[1]]);
                points.push([xp, p2[1]]);
            }
            if(start_dir === DIRECTION.RIGHT) {
                const x = Math.max(p1[0], p2[0]);
                const xp = x + minSpanX;
                points.push([xp, p1[1]]);
                points.push([xp, p2[1]]);
            }
            break;
        case 1:
        case 3:  
            if(isSelf) {
                if(!isVerticalStart) {
                    points.push([p1[0] + minSpanX, p1[1]]);
                    points.push([p1[0] + minSpanX, p2[1] + minSpanY]);
                    points.push([p2[0], p2[1] + minSpanY]);
                } else {
                    points.push([p1[0], p1[1] + minSpanY]);
                    points.push([p2[0] + minSpanX, p1[1] + minSpanY]);
                    points.push([p2[0] + minSpanX, p2[1]]);
                }
            } else {
                const point = isVerticalStart ? [p1[0], p2[1]]: [p2[0], p1[1]]
                points.push(point);
            }
            break;
        case 2:
            const pmiddle = [
                (p1[0] - p2[0])/2 + p2[0],
                (p1[1] - p2[1])/2 + p2[1]
            ]; 
            if(isVerticalStart) {
                points.push([p1[0], pmiddle[1]])
                points.push([p2[0], pmiddle[1]])
            } else {
                points.push([pmiddle[0], p1[1]])
                points.push([pmiddle[0], p2[1]])
            }
            break;
        default:
            break;
    }
    points.unshift(p1);
    points.push(p2);
    return points;
}

function minusVec(p1, p2) {
    return [p1[0] - p2[0], p1[1] - p2[1]]
}

function absVec(vec) {
    return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
}

function scaleVec(vec, scale) {
    return [vec[0] * scale, vec[1] * scale];
}

export function makeRadiusFromVector(pbefore, p, pnext, radius) {
    const vec1 = minusVec(p, pbefore);
    const vec2 = minusVec(p, pnext);
    const absVec1 = absVec(vec1);
    const absVec2 = absVec(vec2);
    if(!absVec1 || !absVec2) {
        return {
            p1: null,
            p2: null,
        }
    }
    const r1 = scaleVec(vec1, radius/absVec1);
    const r2 = scaleVec(vec2, radius/absVec2);
    return {
        p1: minusVec(p, r1),
        p2: minusVec(p, r2),
    }
}