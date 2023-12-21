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
          :show-member-id="true"
          :showTaxes="true"
          :showExpectedCostUnitPrice="true"
          :showCostUnitPrice="true"
          @costUnitPriceUpdate="updateCostUnitPrice"
          @quantityUpdate="updateOrderQuantity"
          :showUnitPrice="true"
          :hide-expected-unit-price="true"
          :show-expected-unit-price-after-rebate="true"
          :canEditCostUnitPrice="true"
          :showAllMembersQuantity="true"
          :hideCategory="true"
          ref="allOrderItemsTable"
      ></ProductsTable>
    </v-card-text>
  </v-card>
</template>

<script>
import BuyGroupOrderService from "@/service/BuyGroupOrderService";
import MemberOrderService from "@/service/MemberOrderService";
import MemberOrdersQuantity from "@/MemberOrdersQuantity";

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
    const allMemberOrders = await BuyGroupOrderService.listMemberOrdersItemsQuantities(
        this.buyGroupId,
        this.buyGroupOrderId
    );
    this.memberOrdersQuantities = new MemberOrdersQuantity(
        allMemberOrders
    );
    const allMembersQuantities = this.memberOrdersQuantities.buildQuantities();
    this.userOrdersItems = await BuyGroupOrderService.listMemberOrderItems(
        this.buyGroupId,
        this.buyGroupOrderId
    );
    this.userOrdersItems.forEach((memberOrderItem) => {
      if (allMembersQuantities[memberOrderItem.ProductId]) {
        memberOrderItem.allMembersQuantity = allMembersQuantities[memberOrderItem.ProductId]
      }
    })
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
      this.memberOrdersQuantities.updateMemberOrder(updatedItem);
      this.memberOrdersQuantities.buildQuantities();
      this.userOrdersItems.forEach((orderItem) => {
        if (orderItem.ProductId === updatedItem.ProductId) {
          orderItem.allMembersQuantity = this.memberOrdersQuantities.getAllMembersQuantityForProductId(orderItem.ProductId);
          this.$set(this.userOrdersItems, this.userOrdersItems.indexOf(orderItem), orderItem);
        }
      })
      await this.$refs.allOrderItemsTable.showQuantityChangedSuccess();
    }
  }
}
</script>

<style scoped>

</style>
