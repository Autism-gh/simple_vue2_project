import router from './router'
import store from './store'

import {
  Message
} from 'element-ui'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import {
  getToken
} from '@/util/app/auth'
import getPageTitle from '@/util/app/get-page-title'

NProgress.configure({
  showSpinner: false
})

const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  document.title = getPageTitle(to.meta.title)

  const hasToken = getToken()

  if (hasToken && hasToken !== 'undefined') {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {

      const hasMenus = store.getters.menus && store.getters.menus.length > 0
      
      if (hasMenus) {
        next()
      } else {
        try {
          const info = await store.dispatch('user/getUserInfoFromApi')

          const accessRoutes = await store.dispatch('permission/generateRoutes', info.menu)
          
          // 添加路由
          router.addRoutes(accessRoutes)

          next({ ...to, replace: true })
          
        } catch (error) {
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})