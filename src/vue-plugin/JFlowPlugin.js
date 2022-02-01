// import JFlowComponent from './components/JFlow';
import JFlowComponent from './components/JFlow';
import JFlowInstance from './components/JFlowInstance';
import JFlowLink from './components/JFlowLink';
import JFLowGroup from './components/JFlowGroup';
const JFLOW_NODES = [
    'Point',
    'Rectangle',
    'Capsule',
    'Diamond',
    'Text',
    'Icon',
];
const JFLOW_LINKS = [
    'Link',
    'PolylineLink',
    'BezierLink'
]
const JFLOW_GROUPS = [
    'CapsuleGroup',
    'DiamondGroup',
]

const components = [
    {
        name: 'Jflow',
        component: JFlowComponent,
    },
    {
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
