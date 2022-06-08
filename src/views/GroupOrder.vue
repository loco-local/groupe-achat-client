<template>
  <Page>
    <v-row class="mt-4">
      <v-col cols="12" class="text-left">
        <router-link to="/commandes-de-groupe">
          {{ $t('groupOrder:allGroupOrders') }}
        </router-link>
      </v-col>
    </v-row>
    <GroupOrderStatus @buyGroupDefined="setBuyGroup" :buyGroupId="$route.params.buyGroupId"
                      class="mb-6 mt-0"></GroupOrderStatus>
    <v-tabs v-model="tab" grow>
      <v-tab key="allItems" @click="setRouteToAllItems">
        {{ $t('groupOrder:allItems') }}
      </v-tab>
      <v-tab key="memberBills" @click="setRouteTomemberBills">
        <v-icon left>receipt</v-icon>
        {{ $t('groupOrder:memberBills') }}
      </v-tab>
      <v-tab key="providerOrders" @click="setRouteToProviderOrders">
        {{ $t('groupOrder:ordersForProviders') }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item
          key="allItems"
      >
        <AllBuyGroupOrderItems
            v-if="tab === 0"
            :buyGroupId="buyGroupId"
            :buyGroupOrderId="buyGroupOrderId"
        ></AllBuyGroupOrderItems>
      </v-tab-item>
      <v-tab-item
          key="memberBills"
      >
        <GroupOrderMembersBill
            v-if="tab === 1"
            :buyGroupId="buyGroupId"
            :buyGroupOrderId="buyGroupOrderId"
        ></GroupOrderMembersBill>
      </v-tab-item>
      <v-tab-item
          key="providerOrders"
      >
        <v-card flat>
          <v-card-text>
            moufou
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </Page>
</template>

<script>
import I18n from "@/i18n";
import AllBuyGroupOrderItems from "@/components/AllBuyGroupOrderItems";

export default {
  name: "GroupOrder",
  components: {
    AllBuyGroupOrderItems,
    Page: () => import('@/components/Page'),
    GroupOrderStatus: () => import('@/components/GroupOrderStatus'),
    GroupOrderMembersBill: () => import('@/components/GroupOrderMembersBill')
  },
  data: function () {
    I18n.i18next.addResources("fr", "groupOrder", {
      noUserOrder: "Aucunes commandes",
      memberBills: "Factures membres",
      allItems: "Tous les items commandés",
      ordersForProviders: "Commandes fournisseurs",
      allGroupOrders: "Toutes les commandes du groupe"
    });
    I18n.i18next.addResources("en", "groupOrder", {
      noUserOrder: "Aucunes commandes",
      memberBills: "Factures membres",
      allItems: "Tous les items commandés",
      ordersForProviders: "Commandes fournisseurs",
      allGroupOrders: "Toutes les commandes du groupe"
    });
    return {
      userOrdersItems: [],
      isLoading: false,
      buyGroup: null,
      tab: null,
      buyGroupId: null,
      buyGroupOrderId: null
    }
  },
  mounted: async function () {
    this.buyGroupId = parseInt(this.$route.params.buyGroupId);
    this.buyGroupOrderId = parseInt(this.$route.params.orderId);
    if (this.$router.currentRoute.name === 'GroupOrderMemberBills') {
      this.tab = 1;
    } else if (this.$router.currentRoute.name === 'GroupOrderProvidersOrders') {
      this.tab = 2;
    }
  },
  methods: {
    setBuyGroup: async function (buyGroup) {
      this.buyGroup = buyGroup;
    },
    basePath: function () {
      return "/groupe/" + this.$route.params.buyGroupId + "/commande/" + this.$route.params.orderId;
    },
    setRouteToAllItems: function () {
      this.$router.push(
          this.basePath() + "/tous-les-items"
      );
    },
    setRouteTomemberBills: function () {
      this.$router.push(
          this.basePath() + "/factures-membres"
      );
    },
    setRouteToProviderOrders: function () {
      this.$router.push(
          this.basePath() + "/commandes-fournisseurs"
      );
    },
  }
}
</script>

<style scoped>

</style>
