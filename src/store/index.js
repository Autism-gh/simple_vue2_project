import Vue from 'vue'

import Vuex from 'vuex'
import getters from './getters'

import createPersistedState from 'vuex-persistedstate'
import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
    modules,

    getters,

    plugins: [
        //  持久化的模块, 看看好存在哪里的！！！！！！
        createPersistedState({
            storage: window.sessionStorage,
            paths: [],
        }),
        createPersistedState({
            storage: window.localStorage,
            paths: [],
        })
    ]
})
