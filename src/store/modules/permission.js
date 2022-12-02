import { asyncRoutes, constantRoutes } from '@/router'

function transUrl(url) {
    const urlArr = url.split('/')
    if (urlArr.length) {
        if (urlArr[0] === '') {
        urlArr.shift()
        }
        return `?app=${urlArr[0]}&controller=${urlArr[1]}&action=${urlArr[2]}`
    }
}
  
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(route, menus) {
  return menus[transUrl(route.path)]
}

function makeMenus(obj, menus) {
  for (let i = 0; i < menus.length; i++) {
    const menu = menus[i]
    menu.url && (obj[menu.url] = true)
    if (menu.childMenu) {
      makeMenus(obj, menu.childMenu)
    }
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, menus) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (tmp.children || hasPermission(tmp, menus)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, menus)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, menus) {
    return new Promise(resolve => {
      /**
       * 
       * 暂时不过滤权限好像有毒
       * 走权限菜单
       * 
       */
      
      // const menusObj = {}
      // makeMenus(menusObj, menus)
      // let accessedRoutes = filterAsyncRoutes(asyncRoutes, menusObj).filter(item=> {
      //   return item.children.length
      // })
      // commit('SET_ROUTES', accessedRoutes)


      /**
       * 
       * 全部菜单抛出去
       * 
       */
      commit('SET_ROUTES', asyncRoutes)
      resolve(asyncRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
