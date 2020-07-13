/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'
import i18n from '@/i18n/i18n'
const orderRouter = {
    path: '/order',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Merchandise',
    meta: {
        title: i18n.t('message.订单管理'),
        icon: 'chart'
    },
    children: [{
        path: 'list',
        component: () =>
            import ('@/views/order/list'),
        name: 'OrderList',
        meta: { title: i18n.t('message.订单列表'), noCache: true }
    }]
}

export default orderRouter