import Instance from './instance';

/**
 * 连线基类
 * @extends Instance
 */
class BaseLink extends Instance{
    /**
     * 创建连线.
     * @param {Configs} configs - 配置
     * @param {Instance} configs.from   - 起始单元
     * @param {Instance} configs.to     - 终止单元
     * @param {String} configs.fromDir  - 起始方向 
     * @param {String} configs.toDir    - 终止方向 
     * @param {String} configs.key      - 连线唯一键值
     * @param {String} configs.backgroundColor    - 线条颜色 
     */
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