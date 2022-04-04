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
        path: '/admin',
        name: 'Admin',
        component: () => import('../views/AdminPage.vue')
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
