import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './checkuser'

import './property'

import './element'

import './components'

// 开启日志监控
import '@/util/app/error.log.js'

import '@/style/common/index.scss' // global css

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
