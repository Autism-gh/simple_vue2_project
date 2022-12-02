import Cookies from 'js-cookie'

const state = {
    sidebar: {
        opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
        withoutAnimation: false
    },
    
    device: 'desktop',

    size: Cookies.get('size') || 'mini',

    loading: {
        fixed: false,
        timeout: 30 * 1000, // 超时时间
        modal: false, // 遮罩
        show: false // 状态
    }
}

const mutations = {
    TOGGLE_LOADING: (state, options) => {
        const type = toString.call(options)
        if (type === '[object Object]') {
          Object.assign(state.loading, options)
        } else if (type === '[object Boolean]') {
          state.loading.show = options
        } else {
          state.loading.show = !state.loading.show
        }
    },

    TOGGLE_SIDEBAR: state => {
        state.sidebar.opened = !state.sidebar.opened
        state.sidebar.withoutAnimation = false
        if (state.sidebar.opened) {
            Cookies.set('sidebarStatus', 1)
        } else {
            Cookies.set('sidebarStatus', 0)
        }
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
        Cookies.set('sidebarStatus', 0)
        state.sidebar.opened = false
        state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
        state.device = device
    },
    SET_SIZE: (state, size) => {
        state.size = size
        Cookies.set('size', size)
    }
}

const actions = {
    toggleSideBar({
        commit
    }) {
        commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({
        commit
    }, {
        withoutAnimation
    }) {
        commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({
        commit
    }, device) {
        commit('TOGGLE_DEVICE', device)
    },
    setSize({
        commit
    }, size) {
        commit('SET_SIZE', size)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
