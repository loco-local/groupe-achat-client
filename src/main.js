import Vue from 'vue'
import I18n from '@/i18n'
import App from './App.vue'
import router from './router'
import store from './store'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import vuetify from './plugins/vuetify'
import CurrencyFilter from '@/currencyFilter'
import DateUtil from '@/dateUtil'
import VueClipboard from 'vue-clipboard2'

Vue.config.productionTip = false

Vue.use(VueClipboard);

CurrencyFilter.setup();

DateUtil.setup();

const vueI18nExt = I18n.setup();

new Vue({
  i18n: vueI18nExt,
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
