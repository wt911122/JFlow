import Instance from './instance';
class BaseLink extends Instance{
    constructor(configs = {}) {
        super();
        this.from     = configs.from; // Instance
        this.to       = configs.to;   // Instance
        this.fromDir  = configs.fromDir;
        this.toDir    = configs.toDir;
        this.key      = configs.key;
        this._cachePoints = null;
        this.defaultStyle = 'black';
        this.hoverStyle = 'cornflowerblue';
    }
}

export default BaseLink;