import Vue from 'vue'
import store from '@/store'
import {
    isString,
    isArray
} from '../common/type-check.js'
import settings from '@/setting'

const {
    errorLog: needErrorLog
} = settings

function checkNeed() {
    const env = ''
    if (isString(needErrorLog)) {
        return env === needErrorLog
    }
    if (isArray(needErrorLog)) {
        return needErrorLog.includes(env)
    }
    return false
}

if (checkNeed()) {
    Vue.config.errorHandler = function (err, vm, info) {
        Vue.nextTick(() => {
            store.dispatch('errorLog/addErrorLog', {
                err,
                vm,
                info,
                url: window.location.href
            })
            console.error(err, info)
        })
    }
}