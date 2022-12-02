/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/entry/Index'

const manageRouter = {
    path: '/normal',
    component: Layout,
    redirect: 'noRedirect',
    name: 'normal',
    meta: {
        title: '管理',
        icon: 'icon-assetsmanage'
    },
    children: [
        {
            path: 'maptest',
            component: () => import('@/views/webDemo/MapTest'),
            name: 'MapTest',
            meta: {
                title: '地图调试'
            }
        },
        {
            path: 'treeDemo',
            component: () => import('@/views/webDemo/TreeDemo'),
            name: 'TreeDemo',
            meta: {
                title: 'ElementTree Demo'
            }
        },
        {
            path: 'treeExtand',
            component: () => import('@/views/webDemo/TreeExtand'),
            name: 'TreeExtand',
            meta: {
                title: 'ElementTree 拓展'
            }
        },
        {
            path: 'treeMethods',
            component: () => import('@/views/webDemo/TreeMethods'),
            name: 'TreeMethods',
            meta: {
                title: 'ElementTree 方法'
            }
        },
    ]
}


export default manageRouter