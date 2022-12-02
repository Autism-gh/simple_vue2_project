import Vue from 'vue'
import { setColumns, getColumns } from '@/axios/app/common'
import { Message } from 'element-ui'
const state = {
  columnsSettings: {},

  // 为了防止与原来的冲突这里加了特殊标识前缀
  prefix: 'aoxing'
}

const mutations = {
  SET_COLUMNS: (state, { tag, setting }) => {
    Vue.set(state.columnsSettings, tag, setting)
  }
}


/**
 * 由于权限问题，这里暂时走前端，没有走后端
 */
const actions = {
  async getColumns({ commit, state }, tag) {
    return new Promise((resolve, reject) => {
      try {
        const formatTag = `${ state.prefix }__${ tag }`

        if (state.columnsSettings[formatTag]) {
          resolve(state.columnsSettings[formatTag])
        } else {

          getColumns({ tag: formatTag }).then(response => {
            const { data } = response
            if (!data) {
              reject('')
            }
            const { setting, pinned } = data
            const fields = setting ? JSON.parse(setting) : []

            commit('SET_COLUMNS', { formatTag, setting: { fields, pinned: pinned || 0 }})
            resolve({ fields, pinned })
          }).catch(error => {
            reject(error)
          })
        }
      } catch (error) {
        reject(error)
      }
    })
  },



  async setColumns({ commit }, { tag, fields, pinned }) {
    return new Promise((resolve, reject) => {
      const formatTag = `${ state.prefix }__${ tag }`

      const parmas = { 
        tag: formatTag, 
        setting: JSON.stringify(fields), 
        pinned
      }

      setColumns(parmas).then(response => {

        const { data } = response
        
        if (!response.state) {
          Message({
            message: response.message,
            type: 'error',
            duration: 5 * 1000
          })
        } else {
          if (!data) {
            reject('')
          }
          commit('SET_COLUMNS', { tag: formatTag, setting: { fields: fields, pinned: pinned || 0 }})
          resolve(data)
        }
        
      }).catch(error => {
        reject(error)
      })

    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
