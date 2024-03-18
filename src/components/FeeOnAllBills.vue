<template>
  <v-card flat>
    <v-card-text v-if="isLoading">
      <v-progress-circular indeterminate :size="80" :width="2"></v-progress-circular>
    </v-card-text>
    <v-card-text v-if="!isLoading && !adminProducts.length">
      {{ $t('groupOrder:noAdminProducts') }}
    </v-card-text>
    <v-card-text v-if="!isLoading && adminProducts.length">
      <ProductsTable
          :products="adminProducts"
          :hasQuantity="true"
          :canChangeQuantity="true"
          :hasExpectedQuantity="false"
          :showTaxes="true"
          :showUnitPrice="true"
          :hide-search="true"
          :hide-expected-unit-price="true"
          :canToggleAvailability="false"
          :hideCategoriesFilter="true"
          @quantityUpdate="updateQuantity"
          ref="feeOnAllBillsTable"
      >
      </ProductsTable>
    </v-card-text>
  </v-card>
</template>

<script>
import ProductService from "@/service/ProductService";
import MemberOrderService from "@/service/MemberOrderService";
import BuyGroupOrderService from "@/service/BuyGroupOrderService";
import GroupOrderAllBillsFeesService from "@/service/GroupOrderAllBillsFeesService";
import {defineAsyncComponent} from "vue";
export default {
  name: "FeeOnAllBills",
  props: ['buyGroupId', 'buyGroupOrderId'],
  components: {
    ProductsTable: defineAsyncComponent(() => import('@/components/ProductsTable'))
  },
  data: function () {
    return {
      isLoading: true,
      adminProducts: []
    }
  },
  mounted: async function () {
    this.isLoading = true;
    const fees = await GroupOrderAllBillsFeesService.listForBuyGroupOrder(
        this.buyGroupId,
        this.buyGroupOrderId
    );
    this.adminProducts = await ProductService.listAdminRelated(
        this.buyGroupId,
        0,
        {}
    );
    fees.forEach((fee) => {
      const matchingProduct = this.adminProducts.filter((product) => {
        return product.id === fee.ProductId;
      });
      if (matchingProduct.length) {
        matchingProduct[0].quantity = fee.quantity;
        matchingProduct[0].totalAfterRebateWithTaxes = fee.total;
        matchingProduct[0].tps = fee.tps;
        matchingProduct[0].tvq = fee.tvq;
      }
    });
    this.isLoading = false;
  },
  methods: {
    updateQuantity: async function (updatedItem) {
      const memberOrders = await BuyGroupOrderService.listMemberOrders(
          this.buyGroupId,
          this.buyGroupOrderId
      );
      const prices = await Promise.all(
          memberOrders.map((memberOrder) => {
            return MemberOrderService.setQuantity(
                memberOrder.id,
                updatedItem.id,
                updatedItem.quantity
            )
          })
      )
      await GroupOrderAllBillsFeesService.setQuantity(
          updatedItem.quantity,
          this.buyGroupId,
          this.buyGroupOrderId,
          updatedItem.id
      );
      updatedItem.totalAfterRebateWithTaxes = prices[0].totalAfterRebateWithTaxes;
      updatedItem.tps = prices[0].tps;
      updatedItem.tvq = prices[0].tvq;
      await this.$refs.feeOnAllBillsTable.showQuantityChangedSuccess();
    }
  }
}
</script>

<style scoped>

</style>
