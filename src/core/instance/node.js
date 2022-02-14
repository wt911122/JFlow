import Instance from './instance';
import { nextDirection } from '../utils/constance';

/**
 * 绝对定位 配置， 绝对定位不受布局影响，相对于当前组来定位
 * @typedef {object} Instance~AbsolutePosition 
 * @property {number} top       - 上距离
 * @property {number} bottom    - 下距离
 * @property {number} right     - 右距离
 * @property {number} left      - 左距离
 *、
/**
 * 节点基类
 * @constructor Node
 * @extends Instance
 * @param {Instance~Configs} configs - 节点配置
 * @param {Number[]} configs.anchor - 坐标
 * @param {Instance~AbsolutePosition} configs.absolutePosition - 绝对定位位置
 */
class Node extends Instance {
    constructor(configs = {}) {
        super(configs);
        this._rawConfigs = configs;
        // for layout
        // this._intersections = [];
        this.anchor =           configs.anchor || [0, 0];
        this.absolutePosition = configs.absolutePosition;
        // this.margin =   configs.margin || 5;
    }

    setConfig(configs) {
        Object.keys(configs).forEach(k => {
            if(configs[k] !== undefined && configs[k] !== null) {
                this[k] = configs[k]
                this._rawConfigs[k] = configs[k];
            }
        });
    }

    // end: from | to
    // from 逆时针, to 顺时针
    // checkLinked(interDir, end) {
    //     if(this._intersections.find(i => i === interDir)) {
    //         interDir = nextDirection(interDir, end === 'to');
    //     } else {
    //         this._intersections.push(interDir)
    //     }
    //     return interDir;
    // }

    /* renderFocus(ctx) {
        const points = this.getBoundingRect();
        if(points.length !== 4) return;
        const margin = this.margin;
        const [p0, p1, p2, p3] = points;
        const width = p1[0] - p0[0];
        const height = p3[1] - p0[1];
        const w = width * 0.2;
        const h = height * 0.2;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(p0[0] - margin, p0[1] - margin + h);
        ctx.lineTo(p0[0] - margin, p0[1] - margin);
        ctx.lineTo(p0[0] - margin + w, p0[1] - margin);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(p1[0] + margin - w, p1[1] - margin);
        ctx.lineTo(p1[0] + margin, p1[1] - margin);
        ctx.lineTo(p1[0] + margin, p1[1] - margin + h);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(p2[0] + margin, p2[1] + margin - h);
        ctx.lineTo(p2[0] + margin, p2[1] + margin);
        ctx.lineTo(p2[0] + margin - w, p2[1] + margin);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(p3[0] - margin + w, p3[1] + margin);
        ctx.lineTo(p3[0] - margin, p3[1] + margin);
        ctx.lineTo(p3[0] - margin, p3[1] + margin - h);
        ctx.stroke();
        ctx.restore();
    } */

    /**
     * 克隆当前节点.
     * @return {Node} 当前节点的副本
     */
    clone() {
        const C = this.constructor;
        const t = new C(this._rawConfigs);
        return t;
    }
}

export default Node;