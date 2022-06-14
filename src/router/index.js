import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'About',
        component: () => import('../views/About.vue')
    },
    {
        path: '/connexion',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/tableau-de-bord',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue')
    },
    {
        path: '/produits/admin',
        name: 'AdminProducts',
        component: () => import('../views/AdminProducts.vue')
    },
    {
        path: '/produits/admin/deprecated',
        name: 'AdminProductsDeprecated',
        component: () => import('../views/AdminProducts.vue')
    },
    {
        path: '/produits/import',
        name: 'ImportProducts',
        component: () => import('../views/ImportProducts.vue')
    },
    {
        path: '/commandes-de-groupe',
        name: 'GroupOrders',
        component: () => import('../views/GroupOrders')
    },
    {
        path: '/groupe/:buyGroupId/commande/:orderId',
        name: 'GroupOrder',
        component: () => import('../views/GroupOrder')
    },
    {
        path: '/groupe/:buyGroupId/commande/:orderId/tous-les-items',
        name: 'GroupOrderAllItems',
        component: () => import('../views/GroupOrder')
    },
    {
        path: '/groupe/:buyGroupId/commande/:orderId/factures-membres',
        name: 'GroupOrderMemberBills',
        component: () => import('../views/GroupOrder')
    },
    {
        path: '/groupe/:buyGroupId/commande/:orderId/factures-membres/:userId',
        name: 'GroupOrderMemberBillsForMember',
        component: () => import('../views/GroupOrder')
    },
    {
        path: '/groupe/:buyGroupId/commande/:orderId/commandes-fournisseurs',
        name: 'GroupOrderProvidersOrders',
        component: () => import('../views/GroupOrder')
    },
    {
        path: '/:buyGroup/',
        name: 'Products',
        component: () => import('../views/Products')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
