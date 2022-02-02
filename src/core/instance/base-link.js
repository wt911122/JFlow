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
        this.from     = configs.from; // Instance
        this.to       = configs.to;   // Instance
        this.fromDir  = configs.fromDir;
        this.toDir    = configs.toDir;
        this.key      = configs.key;
        this._cachePoints = null;
        this.backgroundColor = configs.backgroundColor || '#000';
    }
}

export default BaseLink;