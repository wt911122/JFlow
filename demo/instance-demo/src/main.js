import Vue from 'vue'
import { JFlowVuePlugin } from '../../../src/index';
import App from './App.vue'

Vue.config.productionTip = false;
// Vue.config.parsePlatformTagName = (name) => {
//     if(name === 'math') {
//         return 'nosense'
//     }
//     return name
// }
Vue.use(JFlowVuePlugin);
new Vue({
  render: h => h(App),
}).$mount('#app')
