import Vue from 'vue'
import { JFlowVuePlugin } from '@joskii/jflow';
import App from './App.vue'
import Variable from './custom-jflow-components/variable';
import Slot from './custom-jflow-components/slot';
import Selector from './custom-jflow-components/selector';
import { setupDevtools } from './vue-devtools-plugin';

Vue.use({
    install(app, options = {}) {
        setupDevtools(app)
    }
})
Vue.config.productionTip = false
Vue.use(JFlowVuePlugin, {
    custom: {
        Variable,
        Slot,
        Selector
    }
});
new Vue({
  render: h => h(App),
}).$mount('#app')
