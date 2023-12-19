import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'AboutApp',
        component: () => import('../views/AboutApp.vue')
    },
    {
        path: '/connexion',
        name: 'LoginPage',
        component: () => import('../views/LoginPage.vue')
    },
    {
        path: '/change-password/:token',
        name: 'ChangePassword',
        component: () => import('../views/ChangePassword.vue')
    },
    {
        path: '/send-change-password-email',
        name: 'SendChangePasswordEmail',
        component: () => import('../views/SendChangePasswordEmail.vue')
    },
    {
        path: '/tableau-de-bord',
        name: 'DashboardPage',
        component: () => import('../views/DashboardPage.vue')
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
        path: '/groupe/:buyGroupId/membres',
        name: 'MembersAdmin',
        component: () => import('../views/MembersAdmin')
    },
    {
        path: '/groupe/:buyGroupId',
        name: 'GroupInfo',
        component: () => import('../views/GroupInfo')
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
        path: '/groupe/:buyGroupId/commande/:orderId/diviser',
        name: 'ProductsToDivide',
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
        path: '/groupe/:buyGroupId/commande/:orderId/commandes-fournisseurs/:providerName',
        name: 'GroupOrderProvidersOrderForProvider',
        component: () => import('../views/GroupOrder')
    },
    {
        path: '/groupe/:buyGroupId/commande/:orderId/frais-pour-tous',
        name: 'GroupOrderFeeOnAllBills',
        component: () => import('../views/GroupOrder')
    },
    {
        path: '/:buyGroup/',
        name: 'ProductsPage',
        component: () => import('../views/ProductsPage')
    },
    {
        path: '/:buyGroup/votre-commande',
        name: 'ProductsPageYourOrder',
        component: () => import('../views/ProductsPage')
    },
    {
        path: '/:buyGroup/diviser',
        name: 'ProductsPageToDivide',
        component: () => import('../views/ProductsPage')
    },
    {
        path: '/:buyGroup/tous-les-produits',
        name: 'ProductsPageAllProducts',
        component: () => import('../views/ProductsPage')
    },
    {
        path: '/:buyGroup/inscription',
        name: 'RegisterPage',
        component: () => import('../views/RegisterPage.vue')
    },
    {
        path: '/:buyGroup/commande-membre/:memberId',
        name: 'ProductsOrderOfMember',
        component: () => import('../views/ProductsPage')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
