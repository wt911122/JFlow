import Vue from 'vue'
import { JFlowVuePlugin, Point } from '@joskii/jflow';
import LogicNodeGroup from './custom/logic-node';
import LogicLink from './custom/logic-link';
import SwitchCaseLink from './custom/switchcase-link';
import App from './App.vue'

Vue.config.productionTip = false;
Vue.use(JFlowVuePlugin, {
    customLink: {
        LogicLink,
        SwitchCaseLink
    },
    customGroups: {
        LogicNodeGroup
    },
});
new Vue({
  render: h => h(App),
}).$mount('#app')
