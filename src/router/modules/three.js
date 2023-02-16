/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/entry/Index'

const manageRouter = {
    path: '/manage',
    component: Layout,
    redirect: 'noRedirect',
    name: 'manage',
    meta: {
        title: 'ThreeJS',
        icon: 'el-icon-coin'
    },
    children: [
        
    ]
}


export default manageRouter