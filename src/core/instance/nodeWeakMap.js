function getMapObject() {
    return {
        layoutNode: undefined,
        jflowNode: undefined,
    }
}
class NodeWeakMap {
    constructor() {
        this._map = new WeakMap();
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
    setRenderNodeBySource(source, instance) {
        const mapping = this.source_Layout_Render_NodeMap.get(source);
        if(mapping) {
            mapping.jflowNode = instance;
        }
    },
    getLayoutNodeBySource(source) {
        const mapping = this.source_Layout_Render_NodeMap.get(source);
        if(mapping) {
            return mapping.layoutNode;
        }
        return undefined;
    }
}

export default NodeWeakMap;

