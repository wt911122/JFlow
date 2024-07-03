function getMapObject() {
    return {
        layoutNode: undefined,
        jflowNode: undefined,
        jflowlinks: [],
        jflowFromLinks: [],
        jflowToLinks: [],
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
    getLayoutNodeBySource(source) {
        const mapping = this.source_Layout_Render_NodeMap.get(source);
        if(mapping) {
            return mapping.layoutNode;
        }
        return undefined;
    },
    getSourceRenderMeta(source) {
        const map = this.source_Layout_Render_NodeMap;
        return map.get(source)
    },
    _getMap(source) {
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
    },
    addLinkNodeBySource(sourceFrom, sourceTo, link) {
        let obj = this._getMap(sourceFrom);
        obj.jflowFromLinks.push(link);

        obj = this._getMap(sourceTo);
        obj.jflowToLinks.push(link);
    },
    removeLinkNodeBySource(sourceFrom, sourceTo, link) {
        const map = this.source_Layout_Render_NodeMap;
        let obj = map.get(sourceFrom);
        if(obj) {
            const idx = obj.jflowFromLinks.findIndex(l => l === link);
            if(idx !== -1) {
                obj.jflowFromLinks.splice(idx, 1);
            }
        }
        obj = map.get(sourceTo);
        if(obj) {
            const idx = obj.jflowToLinks.findIndex(l => l === link);
            if(idx !== -1) {
                obj.jflowToLinks.splice(idx, 1);
            }
        }
    }
}

export default NodeWeakMap;

