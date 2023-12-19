import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import fr from 'vuetify/lib/locale/fr'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'md'
    },
    lang: {
        locales: {fr},
        current: 'fr'
    },
    theme: {
        dark: false,
        lang: {
            locales: {fr},
            current: 'fr'
        },
        default: 'light',
        disable: false,
        themes: {
            light: {
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
});
