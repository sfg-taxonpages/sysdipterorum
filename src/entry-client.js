import { createApp } from './main.js'
import { registerOnlyClientComponents } from '@/components/clientComponents.js'
import { registerGlobalComponents } from '@/components/globalComponents.js'

const originUrl = window.location.origin
const storeInitialState = window.initialState
const { app, router, store } = createApp({ originUrl })

if (storeInitialState) {
  store.state.value = storeInitialState
}

registerOnlyClientComponents(app)
registerGlobalComponents(app)

router.isReady().then(() => {
  app.mount('#app')
})
