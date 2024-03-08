import {createApp} from 'vue'
import I18n from '@/i18n'
import i18next from 'i18next';
import I18NextVue from 'i18next-vue';
import router from './router'
import store from './store'
import CurrencyFilter from '@/currencyFilter'
import DateUtil from '@/dateUtil'
import VueClipboard from 'vue-clipboard2'
import App from './App.vue'
import { registerPlugins } from '@/plugins'

import {loadFonts} from './plugins/webfontloader'

loadFonts()

const app = createApp(App)
registerPlugins(app)
I18n.setup(i18next);
app.use(I18NextVue, {i18next});
app.config.globalProperties.$filters = {};
CurrencyFilter.setup(app);
DateUtil.setup(app);
app.use(router)
app.use(store)
app.use(VueClipboard)
app.mount('#app')