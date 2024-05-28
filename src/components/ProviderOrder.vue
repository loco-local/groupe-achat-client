<template>
  <v-card>
    <v-card-text v-if="!isLoading && trimmedProviderItems.length > 0">
      <v-expansion-panels variant="popout" dark>
        <v-expansion-panel>
          <v-expansion-panel-title class="text-body-1" color="primary">
            {{ $t('providerOrder:changedQtys1') }}
            {{ trimmedProviderItems.length }}
            {{ $t('providerOrder:changedQtys2') }}
          </v-expansion-panel-title>
          <v-expansion-panel-text>
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
                :hide-categories-filter="true"
                :hide-category="true"
            ></ProductsTable>
          </v-expansion-panel-text>
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
          :hide-categories-filter="true"
          :hide-category="true"
          :canEditCostUnitPrice="true"
          ref="providerOrderTable"
          @costUnitPriceUpdate="updateCostUnitPrice"
      ></ProductsTable>
      <v-row>
        <v-col cols="12" class="text-right text-h5 mt-8 pr-8">
          Total: {{ $filters.currency(orderTotal) }}
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import ProviderOrders from "@/ProviderOrders";
import BuyGroupOrderService from "@/service/BuyGroupOrderService";
import I18n from "@/i18n";
import {defineAsyncComponent} from "vue";
import MemberOrderService from "../service/MemberOrderService";
import ProductService from "../service/ProductService";

export default {
  name: "ProviderOrder",
  props: ['providerName', 'buyGroupId', 'buyGroupOrderId'],
  components: {
    ProductsTable: defineAsyncComponent(() => import('@/components/ProductsTable'))
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
    this.memberOrdersItems = await BuyGroupOrderService.listMemberOrderItems(
        this.buyGroupId,
        this.buyGroupOrderId
    );
    const orderItemsByProvider = ProviderOrders.groupOrderItemsByProviders(this.memberOrdersItems);
    this.providerItems = orderItemsByProvider.providerOrders[this.providerName];
    this.orderTotal = orderItemsByProvider.providerTotals[this.providerName];
    let trimmedOrderItemsByProvider = ProviderOrders.groupOrderItemsByProviders(
        this.memberOrdersItems,
        true
    );
    this.trimmedProviderItems = trimmedOrderItemsByProvider.providerOrders[this.providerName];
    this.$emit('itemsDefined', orderItemsByProvider);
    this.isLoading = false;
  },
  methods: {
    updateCostUnitPrice: async function (updatedItem) {
      const productId = updatedItem.ProductId;
      await ProductService.updateCostUnitPrice(
          productId,
          updatedItem.costUnitPrice
      )
      const orderItemsOfProduct = this.memberOrdersItems.filter((orderItem) => {
        return orderItem.ProductId === productId
      })
      for (const orderItem of orderItemsOfProduct) {
        await MemberOrderService.setCostUnitPrice(
            orderItem.MemberOrderId,
            productId,
            updatedItem.costUnitPrice
        );
      }
      await this.$refs.providerOrderTable.showCostUnitPriceChangedSuccess(updatedItem);
    }
  }
}
</script>

<style scoped>

</style>
