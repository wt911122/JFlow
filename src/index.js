const packageJson = require('../package.json');
import { default as JFlow } from './core/flow'; 
export default JFlow;
export * from './core/flow';
export { default as JFlowVuePlugin } from './vue-plugin/JFlowPlugin.js';
window.$jflow_version = packageJson.version;
// console.log(`jflow version@${packageJson.version}`)