import {
    Bezier,
} from 'bezier-js';
import { DIRECTION } from './constance';

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
function dist2(v, w) {
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



export function bezierPoints(p1, p2, start_dir = DIRECTION.TOP, end_dir = DIRECTION.TOP) {
    const isSameDirection = start_dir === end_dir;
    const isVerticalStart = [DIRECTION.TOP, DIRECTION.BOTTOM].includes(start_dir);   
    const isVerticalEnd = [DIRECTION.TOP, DIRECTION.BOTTOM].includes(end_dir);
    const arrowspan = [DIRECTION.TOP, DIRECTION.LEFT].includes(end_dir) ? -5 : 5;
    const endX = isVerticalEnd ? p2[0] : p2[0] + arrowspan;
    const endY = isVerticalEnd ? p2[1] + arrowspan : p2[1];
    if(isSameDirection) {
        let span = Math.abs(isVerticalStart ? (endY - p1[1]) : (endX - p1[0]))
        const symb = [DIRECTION.RIGHT, DIRECTION.BOTTOM].includes(end_dir)
        span = symb ? span : - span;
        const cp1 = isVerticalStart ? [p1[0], p1[1] + span] : [p1[0] + span, p1[1]];
        const cp2 = isVerticalEnd ? [endX, endY + span] : [endX + span, endY];
        return [ 
            ...cp1,
            ...cp2,
            endX, endY ];
    }
    const spanStart = isVerticalStart ? (endY - p1[1]) / 2 : (endX - p1[0]) / 2
    const spanEnd = isVerticalEnd ? (p1[1] - endY) / 2 : (p1[0] - endX) / 2
    
    const cp1 = isVerticalStart ? [p1[0], p1[1] + spanStart] : [p1[0] + spanStart, p1[1]];
    const cp2 = isVerticalEnd ? [endX, endY + spanEnd] : [endX + spanEnd, endY];
    return [ 
        ...cp1,
        ...cp2,
        endX, endY ];
}

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