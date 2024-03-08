import {createApp} from 'vue'
import I18n from '@/i18n'
import i18next from 'i18next';
import I18NextVue from 'i18next-vue';
import router from './router'
import store from './store'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/lib/styles/main.sass'
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/lib/components'
import * as directives from 'vuetify/lib/directives'
import fr from 'vuetify/lib/locale/fr'
import colors from 'vuetify/lib/util/colors'
import CurrencyFilter from '@/currencyFilter'
import DateUtil from '@/dateUtil'
import VueClipboard from 'vue-clipboard2'
import App from './App.vue'

import {loadFonts} from './plugins/webfontloader'

loadFonts()

const app = createApp(App)
I18n.setup(i18next);
app.use(I18NextVue, {i18next});
app.config.globalProperties.$filters = {};
CurrencyFilter.setup(app);
DateUtil.setup(app);
const vuetify = createVuetify({
    components,
    directives,
    icons: {
        iconfont: 'md'
    },
    lang: {
        locales: {fr},
        current: 'fr'
    },
    theme: {
        defaultTheme: 'light',
        lang: {
            locales: {fr},
            current: 'fr'
        },
        themes: {
            light: {
                dark: false,
                variables: {},
                primary: colors.deepPurple.darken3,
                secondary: '#cdff7e',
                accent: '#389a24',
                error: '#FF5252',
                info: '#2196F3',
                success: '#4CAF50',
                warning: '#FFC107'
            }
        }
    }
})
app.use(vuetify)
app.use(router)
app.use(store)
app.use(VueClipboard)
app.mount('#app')