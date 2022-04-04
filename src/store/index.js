import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [
    VuexPersistedState({
      paths: [
        "token",
        "user",
        "locale"
      ]
    })
  ],
  state: {
    token: null,
    user: null,
    locale: 'fr'
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
  },
  modules: {
  }
})
