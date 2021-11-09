import { setupDevtoolsPlugin } from '@vue/devtools-api'

export function setupDevtools (app) {
  setupDevtoolsPlugin({ 
      id: 'jflow-devtools-plugin',
      label: 'JFlowDevtoolPlugin',
      packageName: 'jflow',
      app
  }, api => {
      console.log(api)
    api.on.getInspectorState(payload => {
        console.log(payload);
    })
  })
}