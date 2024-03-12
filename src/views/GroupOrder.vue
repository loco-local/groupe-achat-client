<template>
  <PageWrap>
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
      <v-tab key="productsToDivide" @click="setRouteToProductsToDivide">
        {{ $t('groupOrder:productsToDivide') }}
      </v-tab>
      <v-tab key="memberBills" @click="setRouteToMemberBills">
        <v-icon start>receipt</v-icon>
        {{ $t('groupOrder:memberBills') }}
      </v-tab>
      <v-tab key="feeOnAllBills" @click="setRouteToFeeOnAllBills">
        <v-icon start>receipt</v-icon>
        {{ $t('groupOrder:feeOnAllBills') }}
      </v-tab>
      <v-tab key="providerOrders" @click="setRouteToProviderOrders">
        {{ $t('groupOrder:ordersForProviders') }}
      </v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item
          key="allItems"
      >
        <AllBuyGroupOrderItems
            v-if="tab === 0"
            :buyGroupId="buyGroupId"
            :buyGroupOrderId="buyGroupOrderId"
        ></AllBuyGroupOrderItems>
      </v-window-item>
      <v-window-item key="productsToDivide">
        <ProductsToDivide
            v-if="tab === 1 && buyGroup !== null"
            :buyGroupId="buyGroupId"
            :buyGroupOrderId="buyGroupOrderId"
        ></ProductsToDivide>
      </v-window-item>
      <v-window-item
          key="memberBills"
      >
        <GroupOrderMembersBill
            v-if="tab === 2 && buyGroup !== null"
            :buyGroupId="buyGroupId"
            :buyGroupOrderId="buyGroupOrderId"
            :buyGroupPath="buyGroup.path"
        ></GroupOrderMembersBill>
      </v-window-item>
      <v-window-item
          key="feeOnAllBills"
      >
        <FeeOnAllBills
            v-if="tab === 3 && buyGroup !== null"
            :buyGroupId="buyGroupId"
            :buyGroupOrderId="buyGroupOrderId"
        ></FeeOnAllBills>
      </v-window-item>
      <v-window-item
          key="providerOrders"
      >
        <ProviderOrders
            :buyGroupId="buyGroupId"
            :buyGroupOrderId="buyGroupOrderId"
        ></ProviderOrders>
      </v-window-item>
    </v-window>
  </PageWrap>
</template>

<script>
import I18n from "@/i18n";
import AllBuyGroupOrderItems from "@/components/AllBuyGroupOrderItems";
import FeeOnAllBills from "@/components/FeeOnAllBills";
import ProviderOrders from "@/components/ProviderOrders";
import ProductsToDivide from "@/components/ProductsToDivide";
import PageWrap from '@/components/PageWrap'
import {defineAsyncComponent} from "vue";

export default {
  name: "GroupOrder",
  components: {
    ProviderOrders,
    FeeOnAllBills,
    AllBuyGroupOrderItems,
    ProductsToDivide,
    PageWrap,
    GroupOrderStatus: defineAsyncComponent(() => import('@/components/GroupOrderStatus')),
    GroupOrderMembersBill: defineAsyncComponent(() => import('@/components/GroupOrderMembersBill'))
  },
  data: function () {
    const text = {
      noUserOrder: "Aucunes commandes",
      memberBills: "Factures membres",
      allItems: "Tous les items commandés",
      ordersForProviders: "Commandes fournisseurs",
      allGroupOrders: "Toutes les commandes du groupe",
      noAdminProducts: 'Aucun produit de type "Visible seulement pour les supers bénévoles"',
      feeOnAllBills: "Frais pour toutes les factures",
      productsToDivide: "Produits à partager"
    };
    I18n.i18next.addResources("fr", "groupOrder", text);
    I18n.i18next.addResources("en", "groupOrder", text);
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
    if (this.$route.name === 'ProductsToDivide') {
      this.tab = 1;
    } else if (['GroupOrderMemberBillsForMember', 'GroupOrderMemberBills'].indexOf(this.$route.name) > -1) {
      this.tab = 2;
    } else if (this.$route.name === 'GroupOrderFeeOnAllBills') {
      this.tab = 3;
    } else if (['GroupOrderProvidersOrderForProvider', 'GroupOrderProvidersOrders'].indexOf(this.$route.name) > -1) {
      this.tab = 4;
    }
  },
  methods: {
    setBuyGroup: async function (buyGroup) {
      this.buyGroup = buyGroup;
    },
    basePath: function () {
      return "/groupe/" + this.$route.params.buyGroupId + "/commande/" + this.$route.params.orderId;
    },
    setRouteToProductsToDivide: function () {
      this.$router.push(
          this.basePath() + "/diviser"
      );
    },
    setRouteToAllItems: function () {
      this.$router.push(
          this.basePath() + "/tous-les-items"
      );
    },
    setRouteToMemberBills: function () {
      this.$router.push(
          this.basePath() + "/factures-membres"
      );
    },
    setRouteToFeeOnAllBills: function () {
      this.$router.push(
          this.basePath() + "/frais-pour-tous"
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
