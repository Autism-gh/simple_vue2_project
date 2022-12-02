/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/entry/Index'

const demoRouter = {
    path: '/demo',
    component: Layout,
    redirect: 'noRedirect',
    name: 'demo',
    meta: {
        title: 'WEB组件调试',
        icon: 'icon-assetsmanage'
    },
    children: [
        {
            path: '/dispatch/task/index',
            component: () => import('@/views/app/ProductionPlan/ProductionPlan'),
            name: 'ProductionPlan',
            meta: {
                title: '生产计划'
            }
        },
        {
            path: '/dispatch/mission/index',
            component: () => import('@/views/app/ProductWareHouse/ProductWareHouse'),
            name: 'ProductWareHouse',
            meta: {
                title: '成品库存'
            }
        },
        {
            path: '/dispatch/message/index',
            component: () => import('@/views/app/RawMaterialInventory/RawMaterialInventory'),
            name: 'RawMaterialInventory',
            meta: {
                title: '原材料库存'
            }
        }
    ]
}


export default demoRouter