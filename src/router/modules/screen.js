/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/viewscreen/entry/Index'

const screenRouter = {
    path: '/screenpage',
    component: Layout,
    redirect: 'noRedirect',
    name: 'system',
    meta: {
        title: '大屏',
        icon: 'el-icon-setting'
    },
    children: [
        {
            path: 'demoscreen',
            component: () => import('@/viewscreen/page/DemoScreen/DemoScreen'),
            name: 'DemoScreen',
            meta: {
                title: 'Demo大屏'
            }
        },
        {
            path: 'zhengzhou',
            component: () => import('@/viewscreen/page/ZhengZhou/ZhengZhou'),
            name: 'ZhengZhou',
            meta: {
                title: '郑州大屏'
            }
        }
    ]
}
export default screenRouter