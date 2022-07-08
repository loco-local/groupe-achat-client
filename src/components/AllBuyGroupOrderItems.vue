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
          :hasQuantity="true"
          :hasExpectedQuantity="true"
          :canChangeQuantity="true"
          :canToggleAvailability="false"
          :showPersonName="true"
          :showTaxes="true"
          :showExpectedCostUnitPrice="true"
          :showCostUnitPrice="true"
          @costUnitPriceUpdate="updateCostUnitPrice"
          @quantityUpdate="updateOrderQuantity"
          :showUnitPrice="true"
          :hide-expected-unit-price="true"
          :show-expected-unit-price-after-rebate="true"
          ref="allOrderItemsTable"
      ></ProductsTable>
    </v-card-text>
  </v-card>
</template>

<script>
import BuyGroupOrderService from "@/service/BuyGroupOrderService";
import MemberOrderService from "@/service/MemberOrderService";

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
    this.userOrdersItems = await BuyGroupOrderService.listMemberOrderItems(
        this.buyGroupId,
        this.buyGroupOrderId
    );
    this.isLoading = false;
  },
  methods: {
    updateCostUnitPrice: async function (updatedItem) {
      const prices = await MemberOrderService.setCostUnitPrice(
          updatedItem.MemberOrderId,
          updatedItem.ProductId,
          updatedItem.costUnitPrice
      );
      updatedItem.totalAfterRebateWithTaxes = prices.totalAfterRebateWithTaxes;
      updatedItem.tps = prices.tps;
      updatedItem.tvq = prices.tvq;
      updatedItem.unitPrice = prices.unitPrice;
      this.$set(this.userOrdersItems, this.userOrdersItems.indexOf(updatedItem), updatedItem);
      await this.$refs.allOrderItemsTable.showCostUnitPriceChangedSuccess();
    },
    updateOrderQuantity: async function (updatedItem) {
      const prices = await MemberOrderService.setQuantity(
          updatedItem.MemberOrderId,
          updatedItem.ProductId,
          updatedItem.quantity
      )
      updatedItem.totalAfterRebateWithTaxes = prices.totalAfterRebateWithTaxes;
      updatedItem.tps = prices.tps;
      updatedItem.tvq = prices.tvq;
      this.$set(this.userOrdersItems, this.userOrdersItems.indexOf(updatedItem), updatedItem);
      await this.$refs.allOrderItemsTable.showQuantityChangedSuccess();
    }
  }
}
</script>

<style scoped>

</style>
