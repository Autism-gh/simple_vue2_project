/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/entry/Index'

const manageRouter = {
    path: '/manage',
    component: Layout,
    redirect: 'noRedirect',
    name: 'manage',
    meta: {
        title: '管理',
        icon: 'el-icon-coin'
    },
    children: [
        {
            path: 'ontable',
            component: () => import('@/views/pageDemo/OnlyTable/OnlyTable'),
            name: 'OnlyTable',
            meta: {
                title: '只有一个表格'
            }
        },
        {
            path: 'doubletable',
            component: () => import('@/views/pageDemo/DoubleTable/DoubleTable'),
            name: 'DoubleTable',
            meta: {
                title: '只有两个表格'
            }
        },
        {
            path: 'treeAndTable',
            component: () => import('@/views/pageDemo/TreeAndTable/TreeAndTable'),
            name: 'TreeAndTable',
            meta: {
                title: '树和表格'
            }
        }
    ]
}


export default manageRouter