<template>
  <PageWrap>
    <v-row>
      <v-col cols="12">
        <GroupOrderStatus @buyGroupDefined="setBuyGroup"
                          :buyGroupId="$store.state.user.BuyGroupId"
                          class="mt-8"
                          :memberId="$store.state.user.id"
                          v-if="$store.state.user !== null"
        ></GroupOrderStatus>
      </v-col>
    </v-row>
    <v-row class="vh-center" style="height:100%" v-if="false">
      <v-col cols="12" md="11" lg="10" xl="9" class="vh-center" style="height:100%">
        <v-row class="vh-center" style="height:100%">
          <v-col cols="12" v-if="isLoading">
            <v-progress-circular indeterminate :size="80" :width="2"></v-progress-circular>
          </v-col>
          <v-col cols="12" v-if="$store.state.user !== null && $store.state.user.status !== 'pending' && !isLoading"
                 class="text-center">
            <router-link :to="'/' + buyGroup.path" class="text-h5">
              <span v-if="latestOrder.status === statusOfOrder.CURRENT">
                {{ $t('dashboard:urlForProducts') }}
              </span>
              <span v-if="latestOrder.status === statusOfOrder.CURRENT">
                {{ $t('dashboard:urlForProducts') }}
              </span>
            </router-link>
          </v-col>
          <v-col cols="12" v-if="$store.state.user !== null && $store.state.user.status === 'admin' && !isLoading"
                 class="text-center">
            <router-link :to="'/' + buyGroup.path" class="text-h5">
              {{ $t('dashboard:adminLatestOrder') }}
            </router-link>
          </v-col>
          <v-col cols="12" v-if="$store.state.user !== null && $store.state.user.status === 'pending' && !isLoading"
                 class="vh-center">
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
import PageWrap from '@/components/PageWrap'
import {defineAsyncComponent} from "vue";
import GroupOrder from "@/GroupOrder";

export default {
  components: {
    PageWrap: PageWrap,
    GroupOrderStatus: defineAsyncComponent(() => import('@/components/GroupOrderStatus'))
  },
  data: function () {
    const text = {
      urlForProducts: "Commandez",
      adminLatestOrder: "Administrer la dernière commande",
      pendingMemberMessage: "Merci pour votre inscription ! Un super bénévole devrait vous contacter lorsque votre compte sera activé. Si cela tarde, n'hésitez pas à recontacter les responsables"
    };
    I18n.i18next.addResources("fr", "dashboard", text);
    I18n.i18next.addResources("en", "dashboard", text);
    return {
      buyGroup: null,
      latestOrder: null,
      isLoading: true,
      statusOfOrder: GroupOrder.STATUS
    }
  },
  methods: {
    setBuyGroup: function (buyGroup, latestOrder) {
      this.buyGroup = buyGroup;
      this.latestOrder = latestOrder;
      this.isLoading = false;
    }
  }
}
</script>
