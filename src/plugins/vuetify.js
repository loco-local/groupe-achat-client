import 'vuetify/lib/styles/main.sass'

// Vuetify
import {createVuetify} from 'vuetify'
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import colors from "vuetify/util/colors";
import {fr} from 'vuetify/locale'

import {aliases, md} from 'vuetify/iconsets/md'

export default createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'md',
        aliases,
        sets: {
            md,
        },
    },
    locale: {
        locale: 'fr',
        fallback: 'en',
        messages: {fr}
    },
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                dark: false,
                variables: {},
                colors: {
                    primary: colors.deepPurple.darken3,
                    secondary: '#cdff7e',
                    accent: '#389a24',
                    error: '#FF5252',
                    info: '#2196F3',
                    success: '#FFFFFF',
                    warning: '#FFC107'
                }
            }
        }
    }
})
