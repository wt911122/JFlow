// import JFlowComponent from './components/JFlow';
import JFlowComponent from './components/JFlow';
import JFlowInstance from './components/JFlowInstance';
import JFlowLink from './components/JFlowLink';
import JFlowGroup from './components/JFlowGroup';
 
const JFLOW_NODES = [
    /**
     * JFlow {@link Point} 的 vue 封装 
     * @module j-point
     * @property {Point~PointConfigs} configs - 传给 Point 的配置
     * @property {Boolean} visible - 可见状态
     * @property {String} jflowId - 全局唯一ID，用于连线单元
     */
    'Point',
    /**
     * JFlow {@link Rectangle} 的 vue 封装 
     * @module j-rectangle
     * @property {Rectangle~RectangleConfigs|GroupTemplate~GroupConfigs} configs - 传给 Rectangle 的配置
     * @property {Boolean} visible - 可见状态
     * @property {String} jflowId - 全局唯一ID，用于连线单元
     */
    'Rectangle',
    /**
     * JFlow {@link Capsule} 的 vue 封装 
     * @module j-capsule
     * @property {(Capsule~CapsuleConfigs|GroupTemplate~GroupConfigs)} configs - 传给 Capsule 的配置
     * @property {Boolean} visible - 可见状态
     * @property {String} jflowId - 全局唯一ID，用于连线单元
     */
    'Capsule',
    /**
     * JFlow {@link Diamond} 的 vue 封装 
     * @module j-diamond
     * @property {(Diamond~DiamondConfigs|GroupTemplate~GroupConfigs)} configs - 传给 Diamond 的配置
     * @property {Boolean} visible - 可见状态
     * @property {String} jflowId - 全局唯一ID，用于连线单元
     */
    'Diamond',
    /**
     * JFlow {@link Rhombus} 的 vue 封装 
     * @module j-rhombus
     * @property {(Rhombus~RhombusConfigs|GroupTemplate~GroupConfigs)} configs - 传给 Diamond 的配置
     * @property {Boolean} visible - 可见状态
     * @property {String} jflowId - 全局唯一ID，用于连线单元
     */
    'Rhombus',
    /**
     * JFlow {@link Text} 的 vue 封装 
     * @module j-text
     * @property {Text~TextConfigs} configs - 传给 Text 的配置
     * @property {Boolean} visible - 可见状态
     * @property {String} jflowId - 全局唯一ID，用于连线单元
     */
    'Text',
    /**
     * JFlow {@link Icon} 的 vue 封装 
     * @module j-icon
     * @property {Icon~IconConfigs} configs - 传给 Icon 的配置
     * @property {Boolean} visible - 可见状态
     * @property {String} jflowId - 全局唯一ID，用于连线单元
     */
    'Icon',

    'ShadowDom',
];
/**
 * @typedef {BezierLink~Configs} j-bezier-link~Configs
 * @property {String} from   - 起始单元 jflowId
 * @property {String} to     - 终止单元 jflowId
 */
const JFLOW_LINKS = [
    'Link',
    'PolyLink',
    
    /**
     * JFlow {@link BezierLink} 的 vue 封装 
     * @module j-bezier-link
     * @property {BezierLink~Configs} configs - 传给 BezierLink 的配置
     */
    'BezierLink'
]
const JFLOW_GROUPS = [
    /**
     * JFlow {@link CapsuleGroup} 的 vue 封装 
     * @module j-capsule-group
     * @property {(Capsule~CapsuleConfigs|GroupTemplate~GroupConfigs)} configs - 传给 CapsuleGroup 的配置
     * @property {Boolean} visible - 可见状态
     * @property {String} jflowId - 全局唯一ID，用于连线单元
     */
    'CapsuleGroup',
    /**
     * JFlow {@link CapsuleVerticalGroup} 的 vue 封装 
     * @module j-capsule-vertical-group
     * @property {(Capsule~CapsuleConfigs|GroupTemplate~GroupConfigs)} configs - 传给 CapsuleVerticalGroup 的配置
     * @property {Boolean} visible - 可见状态
     * @property {String} jflowId - 全局唯一ID，用于连线单元
     */
    'CapsuleVerticalGroup',
    /**
     * JFlow {@link DiamondGroup} 的 vue 封装 
     * @module j-diamond-group
     * @property {(Diamond~DiamondConfigs|GroupTemplate~GroupConfigs)} configs - 传给 DiamondGroup 的配置
     * @property {Boolean} visible - 可见状态
     * @property {String} jflowId - 全局唯一ID，用于连线单元
     */
    'DiamondGroup',
    /**
     * JFlow {@link DiamondVerticalGroup} 的 vue 封装 
     * @module j-diamond-vertical-group
     * @property {(Diamond~DiamondConfigs|GroupTemplate~GroupConfigs)} configs - 传给 DiamondVerticalGroup 的配置
     * @property {Boolean} visible - 可见状态
     * @property {String} jflowId - 全局唯一ID，用于连线单元
     */
    'DiamondVerticalGroup',
    /**
     * JFlow {@link RhombusGroup} 的 vue 封装 
     * @module j-rhombus-group
     * @property {(Rhombus~RhombusConfigs|GroupTemplate~GroupConfigs)} configs - 传给 RhombusGroup 的配置
     * @property {Boolean} visible - 可见状态
     * @property {String} jflowId - 全局唯一ID，用于连线单元
     */
    'RhombusGroup',

    'PointGroup',
]

const components = [
    {
        name: 'Jflow',
        component: JFlowComponent,
    },
    {
        /**
         * JFlow {@link RectangleGroup} 的 vue 封装 
         * @module j-group
         * @property {RectangleGroup~RectangleGroupConfigs} configs - 传给 RectangleGroup 的配置
         */
        name: 'Group',
        component: JFlowGroup('Group'),
    }, 
    ...JFLOW_GROUPS.map(name => ({
        name,
        component: JFlowGroup(name)
    })),
    ...JFLOW_NODES.map(name => ({
        name,
        component: JFlowInstance(name)
    })),
    ...JFLOW_LINKS.map(name => ({
        name,
        component: JFlowLink(name)
    })),
];
const componentPrefix = 'j';
customElements.define('jflow-group', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }
});
/**
 * @module JFlowVuePlugin 
 */
export default {
    /**
     * 安装 JFlowVuePlugin
     * @function
     * @param {Vue} Vue - Vue
     * @param {Object} options - Vue plugin 配置
     * @param {string} options.prefix - 组件前缀，默认是 j
     * @param {Object} options.custom - 自定义组件，形式为 { key: {@link:Instance} }
     */
    install: (Vue, options = {}) => {
        let prefixToUse = componentPrefix;
        if(options && options.prefix){
            prefixToUse = options.prefix;
        };
        components.forEach(k => {
            Vue.component(`${prefixToUse}${k.name}`, k.component);
        });

        if(options.customInstance) {
            Object.keys(options.customInstance).forEach(name => {
                Vue.component(`${prefixToUse}${name}`, JFlowInstance(options.customInstance[name]));
            })
        }
        if(options.customGroups) {
            Object.keys(options.customGroups).forEach(name => {
                // console.log(`${prefixToUse}${name}` )
                Vue.component(`${prefixToUse}${name}`, JFlowGroup(options.customGroups[name]));
            })
        }
        if(options.customLink) {
            Object.keys(options.customLink).forEach(name => {
                // console.log(`${prefixToUse}${name}` )
                Vue.component(`${prefixToUse}${name}`, JFlowLink(options.customLink[name]));
            })
        }
    }
}

// export { * as JFlowInstance } from './components/JFlowInstance'; 
