import { Group } from '@joskii/jflow';
import { DIRECTION } from './utils';
export default class extends Group {
    getIntersectionsSeprate() {
        let p2 = this.anchor;
        // if (_belongs && _belongs.calculateToCoordination) {
        //     p2 = _belongs.calculateToCoordination(p2);
        // }

        const [x2, y2] = p2;
        const w = this.width / 2;
        const h = this.height / 2;
        const hh = h / 2;
        return {
            [DIRECTION.RIGHT]: [x2 + w, y2],
            [DIRECTION.LEFT]: [x2 - w, y2],
            [DIRECTION.BOTTOM]: [x2, y2 + h],
            [DIRECTION.TOP]: [x2, y2 - h],
            [DIRECTION.STARTLOOP]: [x2 + w, y2-hh],
            [DIRECTION.ENDLOOP]: [x2 + w, y2+hh],
        };
    }
}