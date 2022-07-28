<template>
  <div class="pb-8">
    <v-card-text v-if="isLoading" class="pt-8 pb-8 text-center">
      <v-progress-circular indeterminate :size="80" :width="2"></v-progress-circular>
    </v-card-text>
    <v-card-text v-if="!isLoading && !userOrderItems.length">
      {{ $t('userBill:noItems') }}
    </v-card-text>
    <v-card-actions v-if="$store.state.user.status === 'admin'" class="mt-7 ml-6">
      <v-btn :to="'/'+buyGroupPath+'/commande-membre/'+userId">
        <v-icon left>edit</v-icon>
        {{ $t('modify') }}
      </v-btn>
    </v-card-actions>
    <v-card-text v-if="!isLoading && userOrderItems.length">
      <ProductsTable
          :products="userOrderItems || []"
          :hasQuantity="true"
          :hasExpectedQuantity="true"
          :showCostUnitPrice="true"
          :showUnitPrice="true"
          :showExpectedCostUnitPrice="true"
          :canToggleAvailability="false"
          :show-taxes="true"
          :hideSearch="true"
      ></ProductsTable>
      <v-row>
        <v-col cols="12" class="text-right text-h5 mt-8 pr-8">
          Total: {{ orderTotal | currency }}
        </v-col>
      </v-row>
      <v-row v-if="buyGroupOrder.howToPay !== null">
        <v-col cols="12" class="text-left body-1 mt-8 pl-8">
          {{ buyGroupOrder.howToPay }}
        </v-col>
      </v-row>
      <v-row v-if="buyGroupOrder.comment !== null">
        <v-col cols="12" class="text-left body-1 mt-8 pl-8">
          {{ buyGroupOrder.comment }}
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script>
import BuyGroupOrderService from "@/service/BuyGroupOrderService";
import I18n from "@/i18n";

export default {
  name: "UserBill",
  props: ['buyGroupId', 'buyGroupOrderId', 'buyGroupPath', 'userId'],
  components: {
    ProductsTable: () => import('@/components/ProductsTable')
  },
  data: function () {
    const text = {
      noItems: "Rien de commandé",
      billOf: "Facture de",
      download: "Télécharger"
    }
    I18n.i18next.addResources("fr", "userBill", text);
    I18n.i18next.addResources("en", "userBill", text);
    return {
      userOrder: null,
      userOrderItems: null,
      buyGroupOrder: null,
      orderTotal: null,
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
    if (this.userOrderItems.length) {
      const memberOrder = this.userOrderItems[0].MemberOrder;
      this.orderTotal = memberOrder.total || memberOrder.expectedTotal
    } else {
      this.orderTotal = 0;
    }
    this.buyGroupOrder = await BuyGroupOrderService.getById(
        this.buyGroupOrderId,
        this.buyGroupId
    );
    this.$emit('dataDefined', {
      items: this.userOrderItems,
      buyGroupOrder: this.buyGroupOrder
    });
    this.isLoading = false;
  }
}
</script>

<style scoped>

</style>
