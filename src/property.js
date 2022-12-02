import Vue from 'vue'


import CustomTheme from '@/theme'
Vue.use(CustomTheme);


import CustomDirective from '@/util/directive'
Vue.use(CustomDirective);


Vue.prototype.$openLoading = (type) => {
    store.commit('app/TOGGLE_LOADING', type)
}

Vue.prototype.checkRoot = (permiss) => {
    return true
}