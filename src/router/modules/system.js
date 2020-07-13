/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'
import i18n from '@/i18n/i18n'
const systemRouter = {
    path: '/system',
    component: Layout,
    redirect: 'noRedirect',
    name: 'System',
    meta: {
        title: i18n.t('message.系统设置'),
        icon: 'chart'
    },
    children: [{
            path: 'user',
            component: () =>
                import ('@/views/system/user'),
            name: 'User',
            meta: {
                title: i18n.t('message.用户管理'),
                noCache: true,
                roles: ['admin', 'B', 'b']
            }
        },
        {
            path: 'customer',
            component: () =>
                import ('@/views/system/customer'),
            name: 'Customer',
            meta: {
                title: i18n.t('message.客户管理'),
                noCache: true,
                roles: ['admin', 'B', 'b']
            }
        },
        // {
        //     path: 'mix-chart',
        //     component: () =>
        //         import ('@/views/charts/mix-chart'),
        //     name: 'MixChart',
        //     meta: { title: '角色管理', noCache: true }
        // },
        // {
        //   path: 'cartge',
        //   component: () =>
        //     import('@/views/system/cartageGroup'),
        //   name: 'MixChart',
        //   meta: { title: '品类管理', noCache: true }
        // },
        {
            path: 'cartge',
            component: () =>
                import ('@/views/system/cartge'),
            name: 'MixChart',
            meta: { title: i18n.t('message.品类管理'), noCache: true }
        },
        {
            path: 'store',
            component: () =>
                import ('@/views/system/store'),
            name: 'Store',
            meta: {
                title: i18n.t('message.商铺管理'),
                noCache: true,
                roles: ['admin', 'B', 'b']
            }
        },
    ]
}

export default systemRouter