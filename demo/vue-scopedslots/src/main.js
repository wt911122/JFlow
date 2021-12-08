import Vue from 'vue'
import { JFlowVuePlugin } from '@joskii/jflow';
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(JFlowVuePlugin);
new Vue({
  render: h => h(App),
}).$mount('#app')
