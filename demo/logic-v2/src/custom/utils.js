const PIINRATIO = Math.PI / 180
export const DIRECTION = {
    /** RIGHT */
    RIGHT: 0,
    /** BOTTOM */
    BOTTOM: 1,
    /** LEFT */
    LEFT: 2,
    /** TOP */
    TOP: 3,

    STARTLOOP: 6,
    ENDLOOP: 16,
};

export const DIRECTION_ANGLE = {
    [DIRECTION.RIGHT]: 2 * 90 * PIINRATIO,
    [DIRECTION.BOTTOM]: 3 * 90 * PIINRATIO,
    [DIRECTION.LEFT]: 0,
    [DIRECTION.TOP]: 90 * PIINRATIO,
    [DIRECTION.STARTLOOP]: 2 * 90 * PIINRATIO,
    [DIRECTION.ENDLOOP]: 2 * 90 * PIINRATIO,
}

export function polylinePoints(
    p1, p2,
    start_dir = DIRECTION.TOP,
    end_dir = DIRECTION.TOP,
    spanX = 10,
    spanY = 10,
    gapX = 5,
    gapY = 15,
    bendPoint,
) {
    let points = [];

    if(start_dir === DIRECTION.BOTTOM) {
        // if(end_dir === DIRECTION.TOP) {
        // }
        if(end_dir === DIRECTION.RIGHT) {
            if (bendPoint) {
                const [x, y] = bendPoint;
                points.push([p1[0], y]);
                points.push([x, y]);
                points.push([x, p2[1]]);
            } else {
                points.push([p1[0], p2[1]]);
            }
        }
        if(end_dir === DIRECTION.ENDLOOP) {
            points.push([p1[0], p1[1] + gapY]);
            points.push([p2[0] + gapX, p1[1] + gapY]);
            points.push([p2[0] + gapX, p2[1]]);
        }
    }

    if(start_dir === DIRECTION.RIGHT)  {
        if(end_dir === DIRECTION.TOP) {
            points.push([p2[0], p1[1]]);
        }
        if(end_dir === DIRECTION.RIGHT) {
            if (bendPoint && bendPoint.length === 4) {
                const [x1, y1, x2, y2] = bendPoint;
                points.push([x1, y1]);
                points.push([x1, y2]);
                points.push([x2, y2]);
                points.push([x2, p2[1]]);
            } else {
                points.push([p1[0] + spanX, p1[1]]);
                points.push([p1[0] + spanX, p2[1]]);
            }
        }
    }

    if(start_dir === DIRECTION.STARTLOOP) {
        if(end_dir === DIRECTION.TOP) {
            points.push([p2[0], p1[1]]);
        }
        if(end_dir === DIRECTION.ENDLOOP) {
            points.push([p1[0] + spanX, p1[1]]);
            points.push([p1[0] + spanX, p1[1] + spanY]);
            points.push([p1[0] + gapX, p1[1] + spanY]);
            points.push([p1[0] + gapX, p2[1]]);
        }
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
export function isPolyLineIntersectionRectange(polyline, rect) {
    let p = polyline[0];
    let l = polyline.length;
    let i = 1;
    const [l0, l1, r0, r1] = rect;
    while (i < l) {
        const cp = polyline[i];
        if(p[0] === cp[0]) {
            // vertical
            if(p[0] < r0 && p[0] > l0 
                && !((p[1] > r1 && cp[1] > r1) || (p[1] < l1 && cp[1] < l1))){
                    return true;
                } 
        } else {
            // horizontal
            if(p[1] < r1 && p[1] > l1
                && !((p[0] > r0 && cp[0] > r0) || (p[0] < l0 && cp[0] < l0))){
                    return true;
                } 
        }
        p = cp;
        i++;
    }
    return false;
}

export function distToSegmentSquared(p, v, w) {
    const l2 = dist2(v, w);
    if (l2 === 0) return dist2(p, v);
    let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
    t = Math.max(0, Math.min(1, t));
    return dist2(p, [ v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1]) ]);
}

function sqr(x) {
    return x * x;
}
export function dist2(v, w) {
    return sqr(v[0] - w[0]) + sqr(v[1] - w[1]);
}


export function translateToClientCoord(jflowInstance) {
    const p = [
        -jflowInstance.width / 2,
        jflowInstance.height / 2,
    ];
    const gp = jflowInstance.calculateToRealWorld(p);
    const { x, y } = jflowInstance._jflow.DOMwrapper.getBoundingClientRect();
    return [gp[0] + x, gp[1] + y];
}
