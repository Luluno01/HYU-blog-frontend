import '@babel/polyfill'
import Vue from 'vue'
import store from './store'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'

import './assets/css/font.css'
import './assets/css/unselectable.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
