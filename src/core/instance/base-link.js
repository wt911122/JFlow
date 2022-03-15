import Instance from './instance';

/**
 * @typedef {Instance~Configs} BaseLink~Configs
 * @property {Instance} from   - 起始单元
 * @property {Instance} to     - 终止单元
 * @property {String} fromDir  - 起始方向 
 * @property {String} toDir    - 终止方向 
 * @property {String} key      - 连线唯一键值
 * @property {String} backgroundColor    - 线条颜色 
 */
/**
 * 连线基类
 * @constructor BaseLink
 * @extends Instance
 * @param {BaseLink~Configs} configs - 配置
 */
class BaseLink extends Instance{
    constructor(configs = {}) {
        super();
        /** @member {Instance}      - 起始单元 */
        this.from     = configs.from;
        /** @member {Instance}      - 终止单元 */
        this.to       = configs.to;
        /** @member {DIRECTION}      - 起始方向 */
        this.fromDir  = configs.fromDir;
        /** @member {DIRECTION}      - 终止方向 */
        this.toDir    = configs.toDir;
        /** @member {key}            - 连线唯一键值 */
        this.key      = configs.key;
        /** @member {number[][]}     - 连线控制点缓存 */
        this._cachePoints = null;
        /** @member {string}     - 连线颜色，默认为 #000 */
        this.backgroundColor = configs.backgroundColor || '#000';
    }
}

export default BaseLink;