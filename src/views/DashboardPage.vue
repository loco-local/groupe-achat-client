<template>
  <PageWrap>
    <v-row class="vh-center" style="height:100%">
      <v-col cols="12" md="11" lg="10" xl="9" class="vh-center" style="height:100%">
        <v-row class="vh-center" style="height:100%">
          <v-col cols="12" v-if="isLoading">
            <v-progress-circular indeterminate :size="80" :width="2"></v-progress-circular>
          </v-col>
          <v-col cols="12" v-if="$store.state.user === null && !isLoading">
          </v-col>
          <v-col cols="12" v-if="$store.state.user !== null && $store.state.user.status !== 'pending' && !isLoading" class="text-center">
            <router-link :to="'/' + buyGroup.path" class="text-h5">
              {{ $t('dashboard:urlForProducts') }}
            </router-link>
          </v-col>
          <v-col cols="12" v-if="$store.state.user !== null && $store.state.user.status === 'pending' && !isLoading" class="vh-center">
            <v-alert
                variant="outlined"
                type="success"
                max-width="800"
            >
              {{ $t('dashboard:pendingMemberMessage') }}.
            </v-alert>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </PageWrap>
</template>

<script>
import I18n from "@/i18n";
import BuyGroupService from "@/service/BuyGroupService";
import PageWrap from '@/components/PageWrap'
export default {
  components: {
    PageWrap: PageWrap
  },
  data: function () {
    const text = {
      urlForProducts: "Commandez",
      pendingMemberMessage: "Merci pour votre inscription ! Un super bénévole devrait vous contacter lorsque votre compte sera activé. Si cela tarde, n'hésitez pas à recontacter les responsables"
    };
    I18n.i18next.addResources("fr", "dashboard", text);
    I18n.i18next.addResources("en", "dashboard", text);
    return {
      buyGroup: null,
      isLoading: true
    }
  },
  mounted: async function () {
    if (this.$store.state.user === null) {
      this.isLoading = false;
      return;
    }
    this.isLoading = true;
    this.buyGroup = await BuyGroupService.getForId(this.$store.state.user.BuyGroupId);
    this.isLoading = false;
  }
}
</script>
