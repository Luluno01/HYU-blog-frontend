import '@babel/polyfill'
import Vue from 'vue'
import store from './store'
import './plugins/vuetify'
import './plugins/mavon-editor'
import App from './App.vue'
import router from './router'
import sdk from './Lib/sdk'
console.log(sdk.User)

import 'vue-material-design-icons/styles.css'
import './assets/css/public.css'
import './assets/css/font.css'
import './assets/css/unselectable.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
