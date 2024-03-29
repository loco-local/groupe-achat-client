<template>
  <v-card>
    <v-card-text v-if="!isLoading && trimmedProviderItems.length > 0">
      <v-expansion-panels popout dark>
        <v-expansion-panel>
          <v-expansion-panel-header class="body-1" color="primary">
            {{ $t('providerOrder:changedQtys1') }}
            {{ trimmedProviderItems.length }}
            {{ $t('providerOrder:changedQtys2') }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <ProductsTable
                :products="trimmedProviderItems || []"
                :hasQuantity="true"
                :hasExpectedQuantity="false"
                :showDecimalQuantityNotFractions="true"
                :showCostUnitPrice="true"
                :showUnitPrice="false"
                :showExpectedCostUnitPrice="false"
                :canToggleAvailability="false"
                :hideExpectedUnitPrice="true"
                :show-taxes="true"
                :hideSearch="true"
                :onlyShowCostTotal="true"
                :prevent-search-flickr="false"
            ></ProductsTable>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
    <v-card-text v-if="!isLoading && providerItems.length">
      <ProductsTable
          :products="providerItems || []"
          :hasQuantity="true"
          :hasExpectedQuantity="false"
          :showDecimalQuantityNotFractions="true"
          :showCostUnitPrice="true"
          :showUnitPrice="false"
          :showExpectedCostUnitPrice="false"
          :canToggleAvailability="false"
          :hideExpectedUnitPrice="true"
          :show-taxes="true"
          :hideSearch="true"
          :onlyShowCostTotal="true"
          :prevent-search-flickr="false"
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
import BuyGroupOrderService from "@/service/BuyGroupOrderService";
import I18n from "@/i18n";

export default {
  name: "ProviderOrder",
  props: ['providerName', 'buyGroupId', 'buyGroupOrderId'],
  components: {
    ProductsTable: () => import('@/components/ProductsTable')
  },
  data: function () {
    const text = {
      changedQtys1: "Voir les",
      changedQtys2: "produits dont la quantité commandée est réduite parce que les caisses à diviser ne sont pas complètes"
    };
    I18n.i18next.addResources("fr", "providerOrder", text);
    I18n.i18next.addResources("en", "providerOrder", text);
    return {
      providerItems: null,
      trimmedProviderItems: [],
      orderTotal: null,
      isLoading: true
    }
  },
  mounted: async function () {
    this.isLoading = true;
    const memberOrdersItems = await BuyGroupOrderService.listMemberOrderItems(
        this.buyGroupId,
        this.buyGroupOrderId
    );
    const orderItemsByProvider = ProviderOrders.groupOrderItemsByProviders(memberOrdersItems);
    this.providerItems = orderItemsByProvider.providerOrders[this.providerName];
    this.orderTotal = orderItemsByProvider.providerTotals[this.providerName];
    let trimmedOrderItemsByProvider = ProviderOrders.groupOrderItemsByProviders(
        memberOrdersItems,
        true
    );
    this.trimmedProviderItems = trimmedOrderItemsByProvider.providerOrders[this.providerName];
    this.$emit('itemsDefined', orderItemsByProvider);
    this.isLoading = false;
  }
}
</script>

<style scoped>

</style>
