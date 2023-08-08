import Store from '@/store'
import router from './router'

const loggedOutAllowedPages = [
    'LoginPage',
    'RegisterPage',
    'ForgotPassword',
    'ChangePassword',
    'SendChangePasswordEmail',
    'AboutApp',
    'ProductsPage'
]

const loggedOutOnlyPages = [
    'LoginPage',
    'RegisterPage',
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
                    name: 'LoginPage'
                })
                return true;
            }
            return false;
        } else {
            const isOnLoggedOutOnlyPage = loggedOutOnlyPages.indexOf(router.currentRoute.name) !== -1;
            if (isOnLoggedOutOnlyPage) {
                await router.push({
                    name: 'DashboardPage'
                })
                return true;
            }
            return false;
        }
    }
}
