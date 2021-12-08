import Instance from './instance';
class BaseLink extends Instance{
    constructor(configs = {}) {
        super();
        this.from   = configs.from; // Instance
        this.to     = configs.to;   // Instance
        this._cachePoints = null;
        this.defaultStyle = 'black';
        this.hoverStyle = 'cornflowerblue';
    }
}

export default BaseLink;