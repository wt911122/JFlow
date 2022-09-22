import Node from './node';
import { DIRECTION } from '../utils/constance';

class GhostNode extends Node {
    constructor(configs) {
        super(configs);
    }

    render(ctx) {}

    isHit(point) {
        return false;
    }
    calculateIntersection(point) {
        return this.anchor;
    }

    getBoundingRect() {
        const [x2, y2] = this.anchor;
        return [x2, y2, x2, y2]
    }

    getBoundingDimension() {
        return {
            width: 0, height: 0
        }
    }

    getIntersectionsInFourDimension() {
        const [x2, y2] = this.anchor;
        return {
            [DIRECTION.RIGHT]:  [x2+1, y2],
            [DIRECTION.LEFT]:   [x2-1, y2],
            [DIRECTION.BOTTOM]: [x2, y2+1],
            [DIRECTION.TOP]:    [x2, y2-1],
        }
    }
}

export default GhostNode;