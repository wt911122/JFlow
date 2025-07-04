function getMapObject() {
    return {
        layoutNode: undefined,
        jflowNode: undefined,
        jflowlinks: [],
        jflowFromLinks: new Set(),
        jflowToLinks: new Set(),
    }
}
class NodeWeakMap {
    constructor() {
        this._map = new Map();
    }

    get(source) {
        return this._map.get(source);
    }

    set(source) {
        const obj = getMapObject();
        this._map.set(source, obj);
        return obj;
    }

    has(source) {
        return this._map.has(source);
    }

    delete(source) {
        this._map.delete(source);
    }

    clear() {
        this._map.clear();
    }
}

export const NodeWeakMapMixin = {
    initNodeWeakMap() {
        this.source_Layout_Render_NodeMap = new NodeWeakMap();
    },
    getRenderNodeBySource(source) {
        const mapping = this.source_Layout_Render_NodeMap.get(source);
        if(mapping) {
            return mapping.jflowNode;
        }
        return undefined;
    }, 
    removeRenderNodeBySource(source, instance) {
        const map = this.source_Layout_Render_NodeMap;
        let obj = map.get(source);
        if(obj && obj.jflowNode === instance) {
            obj.jflowNode = undefined
        }
        if(obj && obj.jflowFromLinks.size === 0 && obj.jflowToLinks.size === 0) {
            this.source_Layout_Render_NodeMap.delete(source);
        }
    },
    getLayoutNodeBySource(source) {
        const mapping = this.source_Layout_Render_NodeMap.get(source);
        if(mapping) {
            return mapping.layoutNode;
        }
        return undefined;
    },
    getSourceRenderMeta(source) {
        const map = this.source_Layout_Render_NodeMap;
        const _meta = map.get(source);
        if(!_meta) {
            return null;   
        }
        return {
            ..._meta,
            jflowFromLinks: Array.from(_meta.jflowFromLinks),
            jflowToLinks: Array.from(_meta.jflowToLinks),
        }
    },
    _getMap(source) {
        if(!source) {
            return null;
        }
        const map = this.source_Layout_Render_NodeMap;
        let obj;
        if(map.has(source)) {
            obj = map.get(source);
        } else {
            obj = map.set(source);
        }
        return obj
    },
    setLayoutNodeBySource(source, layoutNode) {
        let obj = this._getMap(source);
        obj.layoutNode = layoutNode;
    },
    setRenderNodeBySource(source, instance) {
        let obj = this._getMap(source);
        obj.jflowNode = instance;

        if(obj.jflowFromLinks.size > 0) {
            obj.jflowFromLinks.forEach(link => {
                link.from = instance;
            });
        }
        if(obj.jflowToLinks.size > 0) {
            obj.jflowToLinks.forEach(link => {
                link.to= instance;
            });
        }
    },
    addLinkNodeBySource(sourceFrom, sourceTo, link) {
        let obj = this._getMap(sourceFrom);
        obj.jflowFromLinks.add(link);

        obj = this._getMap(sourceTo);
        obj.jflowToLinks.add(link);
    },
    removeLinkNodeBySource(sourceFrom, sourceTo, link) {
        const map = this.source_Layout_Render_NodeMap;
        let obj = map.get(sourceFrom);
        if(obj) {
            obj.jflowFromLinks.delete(link);
            if(obj.jflowFromLinks.size === 0 && obj.jflowToLinks.size === 0 && !obj.jflowNode) {
                this.source_Layout_Render_NodeMap.delete(sourceFrom);
            }
        }
        obj = map.get(sourceTo);
        if(obj) {
            obj.jflowToLinks.delete(link);
            if(obj.jflowFromLinks.size === 0 && obj.jflowToLinks.size === 0 && !obj.jflowNode) {
                this.source_Layout_Render_NodeMap.delete(sourceTo);
            }
        }
    },
    changeLinkNodeBySource(prevSource, nextSource, link, dir) {
        let obj = this._getMap(prevSource);
        if(obj) {
            if(dir === 'from') {
                obj.jflowFromLinks.delete(link)
            }
            if(dir === 'to') {
                obj.jflowToLinks.delete(link)
            }
        }
        obj = this._getMap(nextSource);
        if(obj) {
            if(dir === 'from') {
                obj.jflowFromLinks.add(link);
                if(obj.jflowNode) {
                    link.from = obj.jflowNode;
                }
                
            }
            if(dir === 'to') {
                obj.jflowToLinks.add(link);
                if(obj.jflowNode) {
                    link.to = obj.jflowNode;
                }
            }
        }
    },
    changeNodeBySource(prevSource, nextSource, instance) {
        if(prevSource && nextSource) {
            const oldobj = this._getMap(prevSource);
            const newobj = this._getMap(nextSource);
            newobj.jflowNode = instance;
            oldobj.jflowFromLinks.forEach(link => {
                newobj.jflowFromLinks.add(link);
            });
            oldobj.jflowToLinks.forEach(link => {
                newobj.jflowFromLinks.add(link);
            });
            newobj.jflowFromLinks.forEach(link => {
                link.from = instance;
            });
            newobj.jflowToLinks.forEach(link => {
                link.to = instance;
            });
            this.source_Layout_Render_NodeMap.delete(prevSource);
        }
    }
}

export default NodeWeakMap;

