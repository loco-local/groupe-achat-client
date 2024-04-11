<template>
  <v-app>
    <v-app-bar
        color="white"
    >
      <div class="d-flex align-center ml-4">
        <router-link to="/">
          <v-img
              alt="Logo Groupe d'achat"
              class="shrink mr-2"
              cover
              :src="require('@/assets/logo-loco-horizontal-initiale.png')"
              transition="scale-transition"
              :width="logoWidth"
          />
        </router-link>
      </div>
      <v-toolbar-title class="pt-2 pb-2" :class="{
        'text-subtitle-1 ml-0' : $vuetify.display.smAndDown,
        'text-h5 ml-2': $vuetify.display.mdAndUp
      }">
        <router-link to="/" style="text-decoration: none; color: inherit;">
          Groupe d'achat
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <span v-if="$store.state.user !== null && $vuetify.display.mdAndUp" class="text-h6 mr-8 font-weight-regular">
                {{ $store.state.user.firstname }}
                {{ $store.state.user.lastname }}
              </span>
      <v-menu
          location="bottom left"
          v-if="$store.state.user !== null"
      >
        <template v-slot:activator="{ props }">
          <v-btn
              icon="menu"
              v-bind="props"
              color="primary"
          ></v-btn>
        </template>
        <v-list>
          <v-divider v-if="isAdmin"></v-divider>
          <v-list-subheader v-if="isAdmin">
            Administration
          </v-list-subheader>
          <v-list-item :to="'/groupe/'+$store.state.user.BuyGroupId+'/membres'" v-if="isAdmin">
            <template v-slot:prepend>
              <v-icon>people</v-icon>
            </template>

            {{ $t('app:members') }}

          </v-list-item>
          <v-list-item to="/commandes-de-groupe" v-if="isAdmin">
            <template v-slot:prepend>
              <v-icon>groups_2</v-icon>
            </template>

            {{ $t('app:groupOrder') }}

          </v-list-item>
          <v-list-item :to="'/groupe/' +  $store.state.user.BuyGroupId" v-if="isAdmin">
            <template v-slot:prepend>
              <v-icon>settings</v-icon>
            </template>

            {{ $t('app:yourGroup') }}

          </v-list-item>
          <v-list-subheader v-if="isAdmin">
            {{ $t('app:products') }}
          </v-list-subheader>
          <v-list-item to="/produits/admin" v-if="isAdmin">
            <template v-slot:prepend>
              <v-icon>list</v-icon>
            </template>

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
            <template v-slot:prepend>
              <v-icon>exit_to_app</v-icon>
            </template>
            <v-list-item-title>
              {{ $t('app:logout') }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <router-view/>
    <v-footer
        class="bg-black font-weight-medium"
        height="40"
    >
      <v-row justify="center" no-gutters>
        {{ new Date().getFullYear() }} —
        <strong>
          <a href="https://horizonsgaspesiens.net" style="color:white; text-decoration: none;">
            Horizons Gaspésiens
          </a>
        </strong>
      </v-row>
    </v-footer>
    <v-overlay :model-value="isLoadingFlow">
      <v-progress-circular
          indeterminate
          size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-app>
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
      loadingFlows: LoadingFlow.loadingFlows,
      logoWidth: 40
    };
  },
  mounted: async function () {
    if (this.$vuetify.display.smAndDown) {
      this.logoWidth = 25;
    }
    if (this.$store.state.user !== null) {
      const member = await MemberService.getForId(this.$store.state.user.id);
      if (member === false) {
        await this.logout();
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
<style lang="scss">
.vh-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.bigger-hint {
  .v-text-field__details, .v-messages {
    min-height: 20px;
  }

  .v-messages__message {
    font-size: 16px;
    line-height: 1.5;
  }
}
</style>
