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
          @quantityUpdate="updateOrderQuantity"
          ref="allOrderItemsTable"
      ></ProductsTable>
    </v-card-text>
  </v-card>
</template>

<script>
import BuyGroupOrderService from "@/service/BuyGroupOrderService";
import OrderItem from "@/OrderItem";
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
    updateOrderQuantity: async function (updatedItem) {
      updatedItem.totalAfterRebateWithTaxes = OrderItem.calculateTotal(
          updatedItem,
          updatedItem.quantity,
          updatedItem.price
      );
      updatedItem.tps = OrderItem.calculateTPS(
          updatedItem,
          updatedItem.quantity,
          updatedItem.price
      );
      updatedItem.tvq = OrderItem.calculateTVQ(
          updatedItem,
          updatedItem.quantity,
          updatedItem.price
      );
      this.$set(this.userOrdersItems, this.userOrdersItems.indexOf(updatedItem), updatedItem);
      await MemberOrderService.setQuantity(
          updatedItem.MemberOrderId,
          updatedItem.ProductId,
          updatedItem.quantity
      )
      await this.$refs.allOrderItemsTable.showQuantityChangedSuccess();
    }
  }
}
</script>

<style scoped>

</style>
