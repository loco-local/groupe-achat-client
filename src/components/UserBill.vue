<template>
  <div>
    <v-card-text v-if="isLoading" class="pt-8 pb-8 text-center">
      <v-progress-circular indeterminate :size="80" :width="2"></v-progress-circular>
    </v-card-text>
    <v-card-text v-if="!isLoading && !userOrderItems.length">
      {{ $t('userBill:noItems') }}
    </v-card-text>
    <v-card-text v-if="!isLoading && userOrderItems.length">
      <ProductsTable
          :products="userOrderItems || []"
          :hasQuantity="true"
          :hasExpectedQuantity="true"
          :canToggleAvailability="false"
      ></ProductsTable>
    </v-card-text>
  </div>
</template>

<script>
import BuyGroupOrderService from "@/service/BuyGroupOrderService";
import I18n from "@/i18n";

export default {
  name: "UserBill",
  props: ['buyGroupId', 'buyGroupOrderId', 'userId'],
  components: {
    ProductsTable: () => import('@/components/ProductsTable')
  },
  data: function () {
    I18n.i18next.addResources("fr", "userBill", {
      noItems: "Rien de commandé",
      billOf: "Facture de",
      download: "Télécharger"
    });
    I18n.i18next.addResources("en", "userBill", {
      noItems: "Rien de commandé",
      billOf: "Facture de",
      download: "Télécharger"
    });
    return {
      userOrder: null,
      userOrderItems: null,
      isLoading: true
    }
  },
  mounted: async function () {
    this.isLoading = true;
    this.userOrderItems = await BuyGroupOrderService.listOrderItemsOfMember(
        this.buyGroupId,
        this.buyGroupOrderId,
        this.userId
    );
    this.$emit('itemsDefined', this.userOrderItems);
    this.isLoading = false;
  }
}
</script>

<style scoped>

</style>