<template>
  <div id="app">
    <v-app>
      <v-app-bar
          app
          color="white"
      >
        <div class="d-flex align-center">
          <v-img
              alt="Vuetify Logo"
              class="shrink mr-2"
              contain
              :src="require('@/assets/logo-loco-horizontal-initiale.png')"
              transition="scale-transition"
              width="40"
          />
        </div>
        <v-toolbar-title class="text-h5 pt-2 pb-2 ml-2">
          Groupe d'achat
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <v-menu
            bottom
            left
            nudge-bottom="50"
            v-if="$store.state.user !== null"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                icon
                v-bind="attrs"
                v-on="on"
            >
              <v-icon color="blueTitle">account_circle</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-divider v-if="isAdmin"></v-divider>
            <v-subheader v-if="isAdmin">
              Administration
            </v-subheader>
            <v-list-item to="/membres" v-if="isAdmin">
              <v-list-item-action>
                <v-icon>people</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                {{ $t('app:members') }}
              </v-list-item-content>
            </v-list-item>
            <v-list-item to="/produits">
              <v-list-item-action>
                <v-icon>assignment</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t('app:products') }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="isAdmin"></v-divider>
            <v-divider></v-divider>
            <v-subheader>
              {{ $t('app:agreements') }}
            </v-subheader>
            <v-list-item to="/charte">
              <v-list-item-action>
                <v-icon>assignment</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t('app:charter') }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item to="/vie-prive">
              <v-list-item-action>
                <v-icon>privacy_tip</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t('app:privacy') }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item to="/partenaires">
              <v-list-item-action>
                <v-icon>volunteer_activism</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  <v-btn text>{{ $t('app:partners') }}</v-btn>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="logout">
              <v-list-item-action>
                <v-icon>exit_to_app</v-icon>
              </v-list-item-action>
              <v-list-item-title>
                {{ $t('app:logout') }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>

      <router-view/>
    </v-app>
    <v-footer
        fixed
        class="font-weight-medium"
        dark
    >
      <v-col
          class="vh-center"
          cols="12"
      >
        {{ new Date().getFullYear() }} —
        <strong>
          <a href="https://horizonsgaspesiens.net" style="color:white; text-decoration: none;">
            Horizons Gaspésiens
          </a>
        </strong>
      </v-col>
    </v-footer>
  </div>
</template>

<script>

import I18n from "@/i18n";

export default {
  name: 'App',

  data: () => {
    I18n.i18next.addResources("fr", "app", {
      products: "Produits"
    });
    I18n.i18next.addResources("en", "app", {
      products: "Produits"
    });
    return {};
  },
  computed: {
    isAdmin: function () {
      return false;
    }
  },
  methods:{
    logout: function(){

    }
  }
};
</script>
<style>
.vh-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
