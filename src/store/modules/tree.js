import Vue from 'vue'
import { isString, isObject } from '@/util/common/type-check'
import { vehicleModel, JapanModel } from '@/components/ElementTree/util/treeMockData'
const request = {
    /**
     * 走 API 用的
     * @param {*} type 
     * @returns 
     */
    refreshDataInfo: async(type) => {
        let apiReturn
        switch (type) {
            case 'vehicleModel':
                apiReturn = vehicleModel
                break;
            case 'japanModel':
                apiReturn = JapanModel
                break;
        }
        request[type] = apiReturn
        return apiReturn
    },


    /**
     * 
     * @param {树的sign} type 
     * @returns 
     * 
     * 防止频繁的调用接口找数据，先去 request 底下找找看
     */
    getTypeTree: async(type) => {
        if (request[type]) {
            return request[type]
        }
        const res = await request.refreshDataInfo(type)
        return res
    },

    clear(type) {
        request[type] = null
    }
}

const state = {
    treeData: {

    }
}

const mutations = {
    SET_TREE_DATA(state, { key, value }) {
        Vue.set(state.treeData, key, { data: value })
    },

    CLEAR_ALL(state) {
        for (const key of Object.keys(state.treeData)) {
            state.treeData[key].data = null
            request[key] = null
        }
    }
}


const actions = {
    //  如果没有在vuex 中拿到数据那么重新请求一下
    async getTreeData({ state, commit }, params) {
        let type
        // 是否在去服务器上拿一份？？ fromServer  true 去， false  不去
        let fromServer = true

        if (isString(params)) {
            type = params
        } else if (isObject(params)) {
            type = params.type
            fromServer = params.fromServer
        } else {
            throw new Error('params must be String or Object')
        }

        // 去 vuex 看看数据在不在
        if (!fromServer && state.treeData[type] && state.treeData[type]?.data) {
            return state.treeData[type].data
        } else {
            // 重新置空容易抽搐
            // commit('TOGGLE_TREE_LOADING', { key: type, value: true })
            // commit('SET_TREE_DATA', { key: type, value: [] })
            
            fromServer && request.clear(type)
            const result = await request.getTypeTree(type)
            commit('SET_TREE_DATA', { key: type, value: result || [] })
            // commit('TOGGLE_TREE_LOADING', { key: type, value: false })
            return result
        }
    }
}


export default {
    namespaced: true,
    state,
    mutations,
    actions
}