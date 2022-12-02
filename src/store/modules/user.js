import {
    getToken,
    setToken,
    removeToken
} from '@/util/app/auth'
import router, {
    asyncRoutes,
    resetRouter
} from '@/router'
import {
    getCustomuuid
} from '@/util/common/common'
import {
    Base64
} from 'js-base64'
import moment from 'moment'
import defaultSetting from '@/setting'

const state = {
    token: getToken(),

    menus: [],

    userInfo: {},

    rootLoginOut: false,

    whiteUser: defaultSetting.rootUser
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
        state.rootLoginOut = !token
    },
    /**
     * 返回类型仿佛收到什么影响，有时候是对象有时候是数组
     * @param {*} state
     * @param {*} menus
     */
    SET_MENUS: (state, menus) => {
        const type = toString.call(menus)
        if (type === '[object Array]') {
            state.menus = menus
        } else if (type === '[object Object]') {
            state.menus = Object.values(menus)
        }
    },

    SET_CURRENT_INFO(state, {
        key,
        value
    }) {
        state[key] = value
    }
}


const actions = {
    // user login
    systemLogin({
        state,
        commit,
        dispatch
    }, userInfo) {
        const {
            username,
            password,
            remember
        } = userInfo
        return new Promise((resolve, reject) => {
            try {
                const formatUserName = username.trim()
                const activeUser = state.whiteUser[formatUserName]
                if (activeUser && activeUser === password) {

                    const mockToken = {
                        name: username,
                        token: getCustomuuid()
                    }

                    commit('SET_TOKEN', mockToken)
                    setToken(mockToken)

                    if (remember) {
                        dispatch('setLoginRemember', userInfo)
                    } else {
                        dispatch('clearLoginRemember')
                    }

                    resolve({
                        state: true
                    })
                } else {
                    resolve({
                        state: false,
                        error: '账号密码错误'
                    })
                }
            } catch (error) {
                reject(error)
            }
        })
    },


    /**
     * 
     * 
     * 
     * 
     * 
     * 简单形式的记住密码操作
     * @param {*} param0 
     * @param {*} userInfo 
     * 
     * 
     * 
     * 
     * 
     */
    async setLoginRemember({
        dispatch
    }, userInfo) {
        const {
            username,
            password
        } = userInfo
        const nowTime = moment().valueOf()
        const {
            time
        } = await dispatch('getLoginRemember')
        if (nowTime - time > 7 * 86400000) {
            dispatch('clearLoginRemember')
        } else {
            const code = `1dw45wuch1${username}tb2xh${password}lao3xie${nowTime}ymd`
            localStorage.setItem('loginInfo', Base64.encode(code))
        }
    },

    getLoginRemember() {
        const userInfo = localStorage.getItem('loginInfo')
        const lastLoginInfo = userInfo ? Base64.decode(userInfo) : ''

        if (lastLoginInfo) {
            const keyList = lastLoginInfo.replaceAll(/tb2xh|wuch1|lao3xie|ymd/g, () => '___').split('___')
            return {
                username: keyList[1],
                password: keyList[2],
                time: keyList[3]
            }
        } else {
            return {}
        }
    },

    clearLoginRemember() {
        if (localStorage.removeItem('loginInfo')) localStorage.removeItem('loginInfo')
    },


    /**
     *
     * 
     * 
     * 此处获取的menu 有问题，时而为 null  时而为 【Object】 时而为 【Array】
     * 导致菜单消失 / 死循环 / 报错等问题
     * 暂时做一个处理
     * 
     * 
     *
     */
    async getUserInfoFromApi({
        commit,
        state,
        dispatch
    }) {
        const loginInfo = await dispatch('getLoginRemember')
        const userInfo = defaultSetting.userInfo
        const computed = asyncRoutes

        commit('SET_MENUS', computed)
        commit('SET_CURRENT_INFO', {
            key: 'userInfo',
            value: Object.assign(userInfo, loginInfo)
        })
        return {
            menu: computed,
            userInfo
        }
    },

    // user logout
    systemLoginOut({
        commit,
        state,
        dispatch
    }) {
        return new Promise((resolve, reject) => {

            try {
                commit('SET_TOKEN', '')
                commit('SET_MENUS', [])
                removeToken()
                resetRouter()
                dispatch('tagsView/delAllViews', null, {
                    root: true
                })
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    },

    // remove token
    resetToken({
        commit
    }) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            removeToken()
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}