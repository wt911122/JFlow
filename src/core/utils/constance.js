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
    TOP: 3,
    /** SELF */
    SELF: 100,
}

export function nextDirection(direction, clockwise) {
    const nextDir = (direction + (clockwise ? 1 : -1)) % 4;
    return nextDir;
}

export function oppositeDirection(direction) {
    return (direction + 2) % 4
}

export const APPROXIMATE = 6;

export const JFLOW_MODE = {
    DEFAULT: 'DEFAULT',
    LINKING: 'LINKING',
}

export const LINE_DIR = {
    FROM: 'from',
    TO: 'to',
}