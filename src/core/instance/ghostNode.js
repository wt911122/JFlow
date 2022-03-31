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

    getIntersectionsInFourDimension() {
        const [x2, y2] = this.anchor;
        return {
            [DIRECTION.RIGHT]:  [x2, y2],
            [DIRECTION.LEFT]:   [x2, y2],
            [DIRECTION.BOTTOM]: [x2, y2],
            [DIRECTION.TOP]:    [x2, y2],
        }
    }
}

export default GhostNode;