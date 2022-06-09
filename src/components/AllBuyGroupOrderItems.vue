<template>
  <v-card flat>
    <v-card-text v-if="isLoading">
      <v-progress-circular indeterminate :size="80" :width="2"></v-progress-circular>
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
</template>

<script>
import BuyGroupOrderService from "@/service/BuyGroupOrderService";

export default {
  name: "AllBuyGroupOrderItems",
  props: ['buyGroupId', 'buyGroupOrderId'],
  components: {
    ProductsTable: () => import('@/components/ProductsTable')
  },
  data: function () {
    return {
      isLoading: true,
      userOrdersItems: null
    }
  },
  mounted: async function () {
    this.isLoading = true;
    this.userOrdersItems = await BuyGroupOrderService.listUserOrderItems(
        this.buyGroupId,
        this.buyGroupOrderId
    );
    this.isLoading = false;
  }
}
</script>

<style scoped>

</style>
