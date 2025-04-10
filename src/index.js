// import packageJson from '../package.json';
import { default as JFlow } from './core/flow'; 
export default JFlow;
export * from './core/flow';
// export { default as JFlowVuePlugin, JFlowLinkGroup } from './vue-plugin/JFlowPlugin.js';
JFlow.$jflow_version = packageJson.version;
// console.log(`jflow version@${packageJson.version}`)