<template>
  <v-card flat>
    <v-card-text v-if="isLoading">
      <v-progress-circular indeterminate :size="80" :width="2"></v-progress-circular>
    </v-card-text>
    <v-card-text v-if="!isLoading && !orderItems.length">
      {{ $t('groupOrder:noUserOrder') }}
    </v-card-text>
    <v-card-text v-if="!isLoading && orderItems.length">
      <ProductsTable
          :products="orderItems || []"
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
          @quantityUpdate="updateQuantity"
          :showUnitPrice="true"
          :hide-expected-unit-price="true"
          :show-expected-unit-price-after-rebate="true"
          :canEditCostUnitPrice="true"
          :showAllMembersQuantity="true"
          :hideCategory="true"
          :hideCategoriesFilter="true"
          ref="allOrderItemsTable"
      ></ProductsTable>
    </v-card-text>
  </v-card>
</template>

<script>
import BuyGroupOrderService from "@/service/BuyGroupOrderService";
import MemberOrderService from "@/service/MemberOrderService";
import MemberOrdersQuantity from "@/MemberOrdersQuantity";
import {defineAsyncComponent} from "vue";
import QuantityUpdater from "@/QuantityUpdater";

export default {
  name: "AllBuyGroupOrderItems",
  props: ['buyGroupId', 'buyGroupOrderId'],
  components: {
    ProductsTable: defineAsyncComponent(() => import('@/components/ProductsTable'))
  },
  data: function () {
    return {
      isLoading: true,
      orderItems: null
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
    this.orderItems = await BuyGroupOrderService.listMemberOrderItems(
        this.buyGroupId,
        this.buyGroupOrderId
    );
    this.orderItems.forEach((memberOrderItem) => {
      if (allMembersQuantities[memberOrderItem.ProductId]) {
        memberOrderItem.allMembersQuantity = allMembersQuantities[memberOrderItem.ProductId]
      }
    })
    this.quantityUpdater = QuantityUpdater.buildForFinalQuantity(
        this.orderItems,
        this.memberOrdersQuantities
    )
    this.isLoading = false;
  },
  methods: {
    updateQuantity: async function (updatedItem) {
      this.quantityUpdater.setProductsTableRef(this.$refs.allOrderItemsTable);
      await this.quantityUpdater.update(updatedItem);
    },
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
      await this.$refs.allOrderItemsTable.showCostUnitPriceChangedSuccess();
    }
  }
}
</script>

<style scoped>

</style>
