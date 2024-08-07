import Vuex from 'vuex'
import VuexPersistedState from 'vuex-persistedstate'

export default new Vuex.Store({
    plugins: [
        VuexPersistedState({
            paths: [
                "token",
                "user",
                "locale",
                "showOnlyProductsWithRemainingQuantities"
            ]
        })
    ],
    state: {
        token: null,
        user: null,
        locale: 'fr',
        showOnlyProductsWithRemainingQuantities: false
    },
    mutations: {
        setToken: function (state, token) {
            state.token = token
            if (!token) {
                state.user = null;
            }
        },
        setUser: function (state, user) {
            state.user = user;
        },
        setLocale: function (state, locale) {
            if (state.locale === locale) {
                return
            }
            state.locale = locale;
            location.reload();
        },
        setShowOnlyProductsWithRemainingQuantities: function (state, showOnlyProductsWithRemainingQuantities) {
            state.showOnlyProductsWithRemainingQuantities = showOnlyProductsWithRemainingQuantities;
        }
    },
    actions: {
        setToken: function (action, token) {
            action.commit('setToken', token)
        },
        setUser: function (action, user) {
            action.commit('setUser', user)
        },
        setLocale: function (action, locale) {
            action.commit('setLocale', locale)
        },
        setShowOnlyProductsWithRemainingQuantities: function (action, showOnlyProductsWithRemainingQuantities) {
            action.commit('setShowOnlyProductsWithRemainingQuantities', showOnlyProductsWithRemainingQuantities)
        }
    },
    modules: {}
})
