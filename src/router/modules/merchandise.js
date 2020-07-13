/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'
import i18n from '@/i18n/i18n'
const merchandiseRouter = {
    path: '/merchandise',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Merchandise',
    meta: {
        title: i18n.t('message.商品管理'),
        icon: 'chart'
    },
    children: [{
            path: 'new',
            component: () =>
                import ('@/views/merchandise/add'),
            name: 'ProductNew',
            meta: { title: i18n.t('message.新增商品'), noCache: true, roles: ['B', 'b'] },

        },
        {
            path: 'my',
            component: () =>
                import ('@/views/merchandise/list'),
            name: 'LineChart',
            meta: { title: i18n.t('message.我的商品'), noCache: true, roles: ['B', 'b'] },

        },
        {
            path: 'public',
            component: () =>
                import ('@/views/merchandise/public'),
            name: 'MixChart',
            meta: { title: i18n.t('message.商品总池'), noCache: true }
        },
        {
            path: 'update',
            name: 'update',
            component: () =>
                import ('@/views/merchandise/update'),
            meta: { title: i18n.t('message.商品编辑'), icon: 'product-add' },
            hidden: true
        },
        {
            path: 'import',
            name: 'import',
            component: () =>
                import ('@/views/merchandise/import'),
            meta: { title: i18n.t('message.商品代理'), icon: 'product-add' },
            hidden: true
        },
        {
            path: 'view',
            name: 'view',
            component: () =>
                import ('@/views/merchandise/view'),
            meta: { title: i18n.t('message.商品代理'), icon: 'product-add' },
            hidden: true
        },
    ]
}

export default merchandiseRouter