/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'
import i18n from '@/i18n/i18n'
const warehouseRouter = {
    path: '/warehouse',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Warehouse',
    meta: {
        title: i18n.t('message.仓库管理'),
        icon: 'chart'
    },
    children: [{
            path: 'warehousein',
            component: () =>
                import ('@/views/warehouse/in'),
            name: 'warehouseIn',
            meta: { title: i18n.t('message.入库单确认'), noCache: true }
        },
        {
            path: 'warehouseout',
            component: () =>
                import ('@/views/warehouse/out'),
            name: 'warehouseOut',
            meta: { title: i18n.t('message.订单出库'), noCache: true }
        }
    ]
}

export default warehouseRouter