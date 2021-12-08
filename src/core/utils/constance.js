export const DIRECTION = {
    RIGHT: 0,
    BOTTOM: 1,
    LEFT: 2,
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