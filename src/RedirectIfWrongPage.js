import Store from '@/store'
import router from './router'

const loggedOutAllowedPages = [
    'Login',
    'Register',
    'ForgotPassword',
    'ChangePassword',
    'SendChangePasswordEmail',
    'About',
    'Products'
]

const loggedOutOnlyPages = [
    'Login',
    'Register',
    'ForgotPassword',
    'ChangePassword',
    'SendChangePasswordEmail'
]

export default {
    do: async function () {
        if (Store.state.user === null) {
            const isOnLoggedOutAllowedPage = loggedOutAllowedPages.indexOf(router.currentRoute.name) !== -1
            if (!isOnLoggedOutAllowedPage) {
                await router.push({
                    name: 'Login'
                })
                return true;
            }
            return false;
        } else {
            const isOnLoggedOutOnlyPage = loggedOutOnlyPages.indexOf(router.currentRoute.name) !== -1;
            if (isOnLoggedOutOnlyPage) {
                await router.push({
                    name: 'Dashboard'
                })
                return true;
            }
            return false;
        }
    }
}
