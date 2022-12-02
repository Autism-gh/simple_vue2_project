import Vue from 'vue'

const state = {
    columnsSettings: {},

    // 为了防止与原来的冲突这里加了特殊标识前缀
    prefix: 'autism'
}

const mutations = {
    SET_COLUMNS: (state, {
        tag,
        setting
    }) => {
        Vue.set(state.columnsSettings, tag, setting)
    }
}

const actions = {
    async getColumns({
        state
    }, tag) {
        return new Promise((resolve, reject) => {
            const formatTag = `${ state.prefix }__${ tag }`
            try {
                if (state.columnsSettings[formatTag]) {
                    resolve(state.columnsSettings[formatTag])
                } else {
                    resolve({
                        fields: [],
                        pinned: 2
                    })
                }
            } catch (error) {
                reject(error)
            }
        })
    },

    async setColumns({
        commit
    }, {
        tag,
        fields,
        pinned
    }) {
        return new Promise((resolve, reject) => {
            const formatTag = `${ state.prefix }__${ tag }`
            try {
                const format = {
                    fields,
                    pinned
                }
                commit('SET_COLUMNS', {
                    tag: formatTag,
                    setting: format
                })
                resolve(format)
            } catch (error) {
                reject(error)
            }
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}