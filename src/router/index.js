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
        path: '/produits',
        name: 'Products',
        component: () => import('../views/Products.vue')
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
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
