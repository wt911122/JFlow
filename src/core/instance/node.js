import Instance from './instance';
import { doOverlap } from '../utils/functions';

/**
 * 绝对定位 配置， 绝对定位不受布局影响，相对于当前组来定位
 * @typedef {object} Node~AbsolutePosition 
 * @property {number} top       - 上距离
 * @property {number} bottom    - 下距离
 * @property {number} right     - 右距离
 * @property {number} left      - 左距离
 */
/**
 * Node 配置
 * @typedef {Instance~Configs} Node~Configs 
 * @property {number[]} anchor - 坐标
 * @property {Node~AbsolutePosition} absolutePosition - 绝对定位位置
 */
/**
 * 节点基类
 * @constructor Node
 * @extends Instance
 * @param {Node~Configs} configs - 节点配置
 */
class Node extends Instance {
    constructor(configs = {}) {
        super(configs);
        this._rawConfigs = configs;
        // for layout
        /** @member {number[]} */
        this.anchor =           configs.anchor || [0, 0];
        /** @member {Node~AbsolutePosition} */
        this.absolutePosition = configs.absolutePosition;
    }

    setConfig(configs) {
        Object.keys(configs).forEach(k => {
            if(configs[k] !== undefined && configs[k] !== null) {
                this[k] = configs[k]
                this._rawConfigs[k] = configs[k];
            }
        });
    }
    setAnchorX(x) {
        this.anchor[0] = x;
    }
    setAnchorY(y) {
        this.anchor[1] = y;
    }
    setAnchor(x, y) {
        this.anchor[0] = x;
        this.anchor[1] = y;
    }

    beforeRender() {
        const result = doOverlap(this._belongs._getViewBox(), this.getBoundingRect());
        this._isInViewBox = result;
        return result;
    }

    /**
     * 克隆当前节点.
     * @return {Node} 当前节点的副本
     */
    clone() {
        const C = this.constructor;
        const t = new C(this._rawConfigs);
        t.visible = this.visible;
        return t;
    }
}

export default Node;