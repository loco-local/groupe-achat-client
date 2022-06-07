<template>
  <Page>
    <v-card flat>
      <v-card-title>
      </v-card-title>
      <v-card-text v-if="isLoading">
        <v-progress-circular indeterminate></v-progress-circular>
      </v-card-text>
      <v-card-text v-if="!isLoading && !userOrdersItems.length">
        {{ $t('groupOrder:noUserOrder') }}
      </v-card-text>
      <v-card-text v-if="!isLoading && userOrdersItems.length">
        <ProductsTable
            :products="userOrdersItems || []"
            :hasOrderQuantity="true"
            :canToggleAvailability="false"
            :showPersonName="true"
        ></ProductsTable>
      </v-card-text>
    </v-card>
  </Page>
</template>

<script>
import BuyGroupOrderService from "@/service/BuyGroupOrderService";
import I18n from "@/i18n";
import ProductsTable from "@/components/ProductsTable";

export default {
  name: "GroupOrder",
  components: {
    ProductsTable,
    Page: () => import('@/components/Page'),
  },
  data: function () {
    I18n.i18next.addResources("fr", "groupOrder", {
      noUserOrder: "Aucunes commandes"
    });
    I18n.i18next.addResources("en", "groupOrder", {
      noUserOrder: "Aucunes commandes"
    });
    return {
      userOrdersItems: [],
      isLoading: false
    }
  },
  mounted: async function () {
    const buyGroupId = parseInt(this.$route.params.buyGroupId);
    const buyGroupOrderId = parseInt(this.$route.params.orderId);
    this.isLoading = true;
    this.userOrdersItems = await BuyGroupOrderService.listUserOrderItems(buyGroupId, buyGroupOrderId);
    this.isLoading = false;
  }
}
</script>

<style scoped>

</style>
