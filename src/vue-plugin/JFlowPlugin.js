// import JFlowComponent from './components/JFlow';
import JFlowComponent from './components/JFlow';
import JFlowInstance from './components/JFlowInstance';
import JFlowLink from './components/JFlowLink';
import JFLowGroup from './components/JFlowGroup';
 
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
     * @property {Rectangle~RectangleConfigs} configs - 传给 Rectangle 的配置
     * @property {Boolean} visible - 可见状态
     * @property {String} jflowId - 全局唯一ID，用于连线单元
     */
    'Rectangle',
    /**
     * JFlow {@link Capsule} 的 vue 封装 
     * @module j-capsule
     * @property {Capsule~CapsuleConfigs} configs - 传给 Capsule 的配置
     * @property {Boolean} visible - 可见状态
     * @property {String} jflowId - 全局唯一ID，用于连线单元
     */
    'Capsule',
    /**
     * JFlow {@link Diamond} 的 vue 封装 
     * @module j-diamond
     * @property {Diamond~DiamondConfigs} configs - 传给 Diamond 的配置
     * @property {Boolean} visible - 可见状态
     * @property {String} jflowId - 全局唯一ID，用于连线单元
     */
    'Diamond',
    /**
     * JFlow {@link Rhombus} 的 vue 封装 
     * @module j-rhombus
     * @property {Rhombus~RhombusConfigs} configs - 传给 Diamond 的配置
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
     * @property {j-bezier-link~Configs} configs - 传给 BezierLink 的配置
     * @property {Boolean} visible - 可见状态
     * @property {String} jflowId - 全局唯一ID，用于连线单元
     */
    'BezierLink'
]
const JFLOW_GROUPS = [
    /**
     * JFlow {@link CapsuleGroup} 的 vue 封装 
     * @module j-capsule-group
     * @property {CapsuleGroup~CapsuleGroupConfigs} configs - 传给 CapsuleGroup 的配置
     * @property {Boolean} visible - 可见状态
     * @property {String} jflowId - 全局唯一ID，用于连线单元
     */
    'CapsuleGroup',
    /**
     * JFlow {@link CapsuleVerticalGroup} 的 vue 封装 
     * @module j-capsule-vertical-group
     * @property {CapsuleGroup~CapsuleGroupConfigs} configs - 传给 CapsuleVerticalGroup 的配置
     * @property {Boolean} visible - 可见状态
     * @property {String} jflowId - 全局唯一ID，用于连线单元
     */
    'CapsuleVerticalGroup',
    /**
     * JFlow {@link DiamondGroup} 的 vue 封装 
     * @module j-diamond-group
     * @property {DiamondGroup~DiamondGroupConfigs} configs - 传给 DiamondGroup 的配置
     * @property {Boolean} visible - 可见状态
     * @property {String} jflowId - 全局唯一ID，用于连线单元
     */
    'DiamondGroup',
    /**
     * JFlow {@link DiamondVerticalGroup} 的 vue 封装 
     * @module j-diamond-vertical-group
     * @property {DiamondGroup~DiamondGroupConfigs} configs - 传给 DiamondVerticalGroup 的配置
     * @property {Boolean} visible - 可见状态
     * @property {String} jflowId - 全局唯一ID，用于连线单元
     */
    'DiamondVerticalGroup',
    /**
     * JFlow {@link RhombusGroup} 的 vue 封装 
     * @module j-rhombus-group
     * @property {RhombusGroup~RhombusGroupConfigs} configs - 传给 DiamondGroup 的配置
     * @property {Boolean} visible - 可见状态
     * @property {String} jflowId - 全局唯一ID，用于连线单元
     */
    'RhombusGroup',
]

const components = [
    {
        /**
         * JFlow {@link JFlow} 的 vue 封装 
         * @module j-jflow
         * @property {JFlow~JFlowConfigs} configs - 传给 JFlow 的配置
         */
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
        component: JFLowGroup('Group'),
    }, 
    ...JFLOW_GROUPS.map(name => ({
        name,
        component: JFLowGroup(name)
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

        if(options.custom) {
            Object.keys(options.custom).forEach(name => {
                Vue.component(`${prefixToUse}${name}`, JFlowInstance(options.custom[name]));
            })
        }
        
    }
}

// export { * as JFlowInstance } from './components/JFlowInstance'; 
