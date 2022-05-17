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
              <v-icon color="blueTitle">menu</v-icon>
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
            <v-list-item to="/commandes-de-groupe" v-if="isAdmin">
              <v-list-item-action>
                <v-icon>groups_2</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                {{ $t('app:groupOrder') }}
              </v-list-item-content>
            </v-list-item>
            <v-subheader v-if="isAdmin">
              {{ $t('app:products') }}
            </v-subheader>
            <v-list-item to="/produits/admin">
              <v-list-item-action>
                <v-icon>list</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t('app:listProducts') }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item to="/produits/import">
              <v-list-item-action>
                <v-icon>import_export</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t('app:importProducts') }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="isAdmin"></v-divider>
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
      products: "Produits",
      listProducts: "Lister",
      importProducts: "Importer",
      logout: "Déconnecter",
      groupOrder: "Commandes",
      members: "Membres"
    });
    I18n.i18next.addResources("en", "app", {
      products: "Produits",
      listProducts: "Lister",
      importProducts: "Importer",
      logout: "Déconnecter",
      groupOrder: "Commandes",
      members: "Membres"
    });
    return {};
  },
  computed: {
    isAdmin: function () {
      return this.$store.state.user !== null && this.$store.state.user.status === 'admin';
    }
  },
  methods: {
    logout: function () {
      this.$store.dispatch('setToken', null);
      this.$store.dispatch('setUser', null);
      this.$router.push('/connexion');
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
