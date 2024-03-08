<template>
  <div id="app">
    <v-app>
      <v-app-bar
          color="white"
      >
        <div class="d-flex align-center">
          <router-link to="/">
            <v-img
                alt="Logo Groupe d'achat"
                class="shrink mr-2"
                cover
                :src="require('@/assets/logo-loco-horizontal-initiale.png')"
                transition="scale-transition"
                width="40"
            />
          </router-link>
        </div>
        <v-toolbar-title class="text-h5 pt-2 pb-2 ml-2">
          <router-link to="/" style="text-decoration: none; color: inherit;">
            Groupe d'achat
          </router-link>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <span v-if="$store.state.user !== null && $vuetify.breakpoint.mdAndUp" class="text-h6 mr-8 font-weight-regular">
                {{ $store.state.user.firstname }}
                {{ $store.state.user.lastname }}
              </span>
        <v-menu
            location="bottom left"
            offset="50"
            v-if="$store.state.user !== null"
        >
          <template v-slot:activator="{ props }">
            <v-btn
                icon
               
                v-bind="props"
            >
              <v-icon color="primary">menu</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-divider v-if="isAdmin"></v-divider>
            <v-list-subheader v-if="isAdmin">
              Administration
            </v-list-subheader>
            <v-list-item :to="'/groupe/'+$store.state.user.BuyGroupId+'/membres'" v-if="isAdmin">
              <v-list-item-action>
                <v-icon>people</v-icon>
              </v-list-item-action>
              
                {{ $t('app:members') }}
              
            </v-list-item>
            <v-list-item to="/commandes-de-groupe" v-if="isAdmin">
              <v-list-item-action>
                <v-icon>groups_2</v-icon>
              </v-list-item-action>
              
                {{ $t('app:groupOrder') }}
              
            </v-list-item>
            <v-list-item :to="'/groupe/' +  $store.state.user.BuyGroupId" v-if="isAdmin">
              <v-list-item-action>
                <v-icon>settings</v-icon>
              </v-list-item-action>
              
                {{ $t('app:yourGroup') }}
              
            </v-list-item>
            <v-list-subheader v-if="isAdmin">
              {{ $t('app:products') }}
            </v-list-subheader>
            <v-list-item to="/produits/admin" v-if="isAdmin">
              <v-list-item-action>
                <v-icon>list</v-icon>
              </v-list-item-action>
              
                <v-list-item-title>
                  {{ $t('app:listProducts') }}
                </v-list-item-title>
              
            </v-list-item>
            <!--            <v-list-item to="/produits/import" v-if="isAdmin">-->
            <!--              <v-list-item-action>-->
            <!--                <v-icon>import_export</v-icon>-->
            <!--              </v-list-item-action>-->
            <!--              <v-list-item-content>-->
            <!--                <v-list-item-title>-->
            <!--                  {{ $t('app:importProducts') }}-->
            <!--                </v-list-item-title>-->
            <!--              </v-list-item-content>-->
            <!--            </v-list-item>-->
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
      <v-footer
          position="bottom"
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
      <v-overlay :model-value="isLoadingFlow">
        <v-progress-circular
            indeterminate
            size="64"
        ></v-progress-circular>
      </v-overlay>
    </v-app>
  </div>
</template>

<script>

import I18n from "@/i18n";
import LoadingFlow from "@/LoadingFlow";
import MemberService from "@/service/MemberService";

export default {
  name: 'App',

  data: () => {
    const text = {
      products: "Produits",
      listProducts: "Lister",
      importProducts: "Importer",
      logout: "Déconnecter",
      groupOrder: "Commandes",
      yourGroup: "Votre groupe",
      members: "Membres"
    };
    I18n.i18next.addResources("fr", "app", text);
    I18n.i18next.addResources("en", "app", text);
    return {
      isLoadingFlow: false,
      loadingFlows: LoadingFlow.loadingFlows
    };
  },
  mounted: async function () {
    if (this.$store.state.user !== null) {
      const member = await MemberService.getForId(this.$store.state.user.id);
      if (member === false) {
        // this.logout();
      } else if (member.status !== this.$store.state.user.status) {
        await this.$store.dispatch('setUser', member);
      }
    }
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
  },
  watch: {
    loadingFlows: function () {
      this.isLoadingFlow = this.loadingFlows.length > 0;
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
