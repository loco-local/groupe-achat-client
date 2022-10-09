<template>
  <v-card>
    <v-card-text v-if="!isLoading && providerItems.length">
      <ProductsTable
          :products="providerItems || []"
          :hasQuantity="true"
          :hasExpectedQuantity="false"
          :showCostUnitPrice="true"
          :showUnitPrice="false"
          :showExpectedCostUnitPrice="false"
          :canToggleAvailability="false"
          :hideExpectedUnitPrice="true"
          :show-taxes="true"
          :hideSearch="true"
          :onlyShowCostTotal="true"
      ></ProductsTable>
      <v-row>
        <v-col cols="12" class="text-right text-h5 mt-8 pr-8">
          Total: {{ orderTotal | currency }}
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import ProviderOrders from "@/ProviderOrders";

export default {
  name: "ProviderOrder",
  props: ['providerName', 'buyGroupId', 'buyGroupOrderId'],
  components: {
    ProductsTable: () => import('@/components/ProductsTable')
  },
  data: function () {
    return {
      providerItems: null,
      orderTotal: null,
      isLoading: true
    }
  },
  mounted: async function () {
    this.isLoading = true;
    const orderItemsByProvider = await ProviderOrders.getOrderItemsForEachProvider(this.buyGroupId, this.buyGroupOrderId);
    this.providerItems = orderItemsByProvider.providerOrders[this.providerName];
    this.orderTotal = orderItemsByProvider.providerTotals[this.providerName];
    this.$emit('itemsDefined', orderItemsByProvider);
    this.isLoading = false;
  }
}
</script>

<style scoped>

</style>
