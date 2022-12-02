import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}

/* Layout */
import Layout from '@/entry/Index'


/**
 * 
 * 
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 * 所有用户都能访问到的权限页面
 * 
 * 
 * 
 */
export const constantRoutes = [{
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [{
            path: '/redirect/:path(.*)',
            component: () => import('@/views/common/Redirect')
        }]
    },

    {
        path: '/login',
        component: () => import('@/entry/Login'),
        hidden: true
    },

    /**
     * 
     * 异常页面
     * 
     */
    {
        path: '/404',
        component: () => import('@/views/error/PageNull'),
        hidden: true
    },
    {
        path: '/401',
        component: () => import('@/views/error/PageNoRoot'),
        hidden: true
    },
    {
        path: '/500',
        component: () => import('@/views/error/PageError'),
        hidden: true
    },


    /**
     * 
     * menutest
     * 
     */


    /**
     * 
     * 业务管理系统入口
     * 
     */
    {
        path: '/',
        component: Layout,
        redirect: '/guide',
        hidden: true,
        children: [{
                path: 'guide',
                component: () => import('@/entry/Guide'),
                name: 'appGuide',
                meta: {
                    title: '首页',
                    affix: true
                }
            },
            {
                path: 'personCenter',
                component: () => import('@/entry/personCenter'),
                name: 'personCenter',
                meta: {
                    title: '个人中心'
                }
            },
            {
                path: 'updataPassword',
                component: () => import('@/entry/updataPassword'),
                name: 'updataPassword',
                meta: {
                    title: '修改密码'
                }
            }
        ]
    }
]


/* Router Modules */
import manageRouter from './modules/manage'
import demoRouter from './modules/webdemo'

/**
 * 
 * 
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 * 需要通过权限判断的路由
 * 根据顺序从上到下
 * 
 * 
 */
export const asyncRoutes = [
    // 层级菜单
    manageRouter,

    // 调试的
    demoRouter,

    // 摊开的菜单
    // ...manageRouter,

    // 404 page must be placed at the end !!!
    {
        path: '*',
        redirect: '/404',
        hidden: true
    }
]



const createRouter = () => new VueRouter({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constantRoutes
})


const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router