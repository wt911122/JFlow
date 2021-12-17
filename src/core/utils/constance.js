/**
 * 方向
 * @readonly
 * @enum {number}
 */
export const DIRECTION = {
    /** RIGHT */
    RIGHT: 0,
    /** BOTTOM */
    BOTTOM: 1,
    /** LEFT */
    LEFT: 2,
    /** TOP */
    TOP: 3
}

export function nextDirection(direction, clockwise) {
    const nextDir = (direction + (clockwise ? 1 : -1)) % 4;
    return nextDir;
}

export function oppositeDirection(direction) {
    return (direction + 2) % 4
}

export const APPROXIMATE = 2;