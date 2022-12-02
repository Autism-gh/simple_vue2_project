import defaultSettings from '@/setting'

const {
    showSettings,
    tagsView,
    fixedHeader,
    sidebarLogo,
    firstPage
} = defaultSettings

const state = {
    showSettings: showSettings,
    tagsView: tagsView,
    fixedHeader: fixedHeader,
    sidebarLogo: sidebarLogo,
    firstPage,

    systemSetting: false,

    themeName: 'orange',
    // themeName: 'default',
    themeOptions: {}
}

const mutations = {
    CHANGE_SETTING: (state, { key, value }) => {
        // eslint-disable-next-line no-prototype-builtins
        if (state.hasOwnProperty(key)) {
            state[key] = value
        }
    },

    SWITCH_CHANGE: (state, value) => {
        if (value !== undefined) {
            state.systemSetting = value
        } else {
            state.systemSetting = !state.systemSetting
        }
    }
}

const actions = {
    changeSetting({ commit }, data) {
        commit('CHANGE_SETTING', data)
    },

    switchChange({ commit}, value) {
        commit('SWITCH_CHANGE', value)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}