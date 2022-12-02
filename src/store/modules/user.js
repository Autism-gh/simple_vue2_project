import { login, logout, getInfo } from '@/axios/app/user'
import { getToken, setToken, removeToken } from '@/util/app/auth'
import { asyncRoutes } from '@/router'
import router, { resetRouter } from '@/router'
import moment from 'moment'
import { Base64 } from 'js-base64'

export const formatApiMenu = (menu) => {
    let result = []
    const type = toString.call(menu)
    if (type === '[object Array]') {
        result = menu
    } else if (type === '[object Object]') {
        result = Object.values(menu)
    }
    return result
}

const state = {
  token: getToken(),

  menus: [],

  userInfo: {},

  rootLoginOut: false,

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

  SET_CURRENT_INFO(state, { key, value }) {
    state[key] = value
  }
}

const actions = {
  // user login
  systemLogin({ commit, dispatch }, userInfo) {
    const { username, password, remember } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        if (!response.auth) {
          resolve(response)
        }
        commit('SET_TOKEN', response.auth)
        setToken(response.auth)
        if (remember) {
          dispatch('setLoginRemember', userInfo)
        } else {
          dispatch('clearLoginRemember')
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
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
  async setLoginRemember({ dispatch }, userInfo) {
    const { username, password } = userInfo
    const nowTime = moment().valueOf()
    const { time } = await dispatch('getLoginRemember')
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
  getUserInfoFromApi({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo({token: state.token}).then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }

        // 因为权限还没出现所以走全部
        // const { menu, user, user: { name }} = data
        // const formatMenu = formatApiMenu(menu)
        // const computed = formatMenu && formatMenu?.length ? formatMenu : asyncRoutes

        const {  user, user: { name } } = data
        const computed = asyncRoutes

        commit('SET_MENUS', computed)
        commit('SET_CURRENT_INFO', { key: 'userInfo', value: user })
        
        resolve({ menu: computed, user })
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  systemLoginOut({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')

        /**
         * 清除掉菜单信息，让他重新获取
         */
        commit('SET_MENUS', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
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
