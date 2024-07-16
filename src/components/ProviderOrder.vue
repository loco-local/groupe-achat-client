<template>
  <div>
    <v-card>
      <v-card v-if="!isLoading && nbExcludedProducts > 0" class="mt-4" variant="flat">
        <v-card-title>
          {{ $t('providerOrder:excludedProducts') }}
        </v-card-title>
        <v-card-text class="mt-4">
          <v-expansion-panels variant="popout" dark>
            <v-expansion-panel>
              <v-expansion-panel-title class="text-body-1" color="primary">
                {{ incompleteQtyProviderItems.length }}
                <v-divider vertical class="ml-3 mr-3" :thickness="2"></v-divider>
                {{ $t('providerOrder:changedQtys') }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <ProductsTable
                    :products="incompleteQtyProviderItems || []"
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
            <v-expansion-panel>
              <v-expansion-panel-title class="text-body-1" color="primary">
                {{ zeroQuantityItems.length }}
                <v-divider vertical class="ml-3 mr-3" :thickness="2"></v-divider>
                {{ $t('providerOrder:excludedForZeroFinalQuantity1') }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <ProductsTable
                    :products="zeroQuantityItems || []"
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
        <v-card-text class="text-h6  ml-6">
          {{ $t('providerOrder:totalExcluded') }}: {{ nbExcludedProducts }}
        </v-card-text>
      </v-card>
      <v-divider class="mt-4 mb-4"></v-divider>
      <v-card class="mb-8">
        <v-card-title>
          {{ $t('providerOrder:productsToOrder') }}
        </v-card-title>
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
              @modify="enterIsBackOrderFlow"
          ></ProductsTable>
<!--          <v-row class="text-left text-body-1 font-weight-bold mt-8 ml-8 font-weight-regular">-->
<!--            <v-col cols="12">-->
<!--              {{ $t('providerOrder:totalPrice') }}: {{ $filters.currency(orderTotal) }}-->
<!--            </v-col>-->
<!--            <v-col cols="12" md="3" lg="2" xl="1">-->
<!--              <v-divider></v-divider>-->
<!--            </v-col>-->
<!--            <v-col cols="12">-->
<!--              {{ $t('providerOrder:nbItemsToOrder') }}: {{ nbItemsToOrder }}-->
<!--            </v-col>-->
<!--            <v-col cols="12" md="3" lg="2" xl="1">-->
<!--              <v-divider></v-divider>-->
<!--            </v-col>-->
<!--            <v-col cols="12">-->
<!--              {{ $t('providerOrder:nbDifferentProductsToOrder') }} : {{ nbDifferentProductsToOrder }}-->
<!--            </v-col>-->
<!--            <v-col cols="12" md="3" lg="2" xl="1">-->
<!--              <v-divider></v-divider>-->
<!--            </v-col>-->
<!--          </v-row>-->
          <v-row class="mt-2 mb-2">
            <v-col cols="12" md="6" lg="4" xl="3">
              <v-table width="200" class="text-h6 font-weight-regular" color="primary" density="default">
                <tbody>
                <tr>
                  <td class="">{{ $t('providerOrder:totalPrice') }}</td>
                  <td class="">{{ $filters.currency(orderTotal) }}</td>
                </tr>
                <tr>
                  <td class="">{{ $t('providerOrder:nbDifferentProductsToOrder') }}</td>
                  <td class="">{{nbDifferentProductsToOrder}}</td>
                </tr>
                <tr>
                  <td class="">{{ $t('providerOrder:nbItemsToOrder') }}</td>
                  <td class="">{{nbItemsToOrder}}</td>
                </tr>
                </tbody>
              </v-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-card>
    <v-dialog
        v-model="isBackOrderDialog"
        max-width="600px"
        v-if="editedItem !== null"
    >
      <v-card class="">
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="text-h5 text-medium-emphasis ps-2">
            {{ editedItem.name }}
          </div>
          <v-icon icon="close" @click="isBackOrderDialog = false" variant="text"></v-icon>
        </v-card-title>
        <v-divider class="mb-4"></v-divider>
        <v-alert
            color="warning"
            variant="outlined"
            class="ml-2 mr-2"
        >
          <p class="text-h6 font-weight-regular text-black">
            <span class="font-italic">
              {{ $t('providerOrder:productBackOrderInfo1') }},
            </span>
            {{ $t('providerOrder:productBackOrderInfo2') }}
          </p>
        </v-alert>
        <v-card-actions class="my-2 d-flex justify-end">
          <v-btn
              color="error"
              @click="setProductAsBackOrder"
              :loading="isSaveBackOrderLoading"
              :disabled="isSaveBackOrderLoading"
          >
            {{ $t('providerOrder:productIsBackOrder') }}
            <!--            <v-icon end>close</v-icon>-->
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              variant="text"
              @click="isBackOrderDialog = false"
          >
            {{ $t('cancel') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
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
      excludedProducts: "Produits exclus de la commande",
      changedQtys: "Caisses incomplètes",
      excludedForZeroFinalQuantity1: "Quantité à zéro",
      totalExcluded: "Total exclus",
      productsToOrder: "Produits à commander",
      productIsBackOrder: "Définir comme backorder",
      productBackOrderInfo1: "Définir comme backorder",
      productBackOrderInfo2: "mettra la quantité finale à zéro dans toutes les factures où ce produit est commandé.",
      nbDifferentProductsToOrder: "Produits différents",
      nbItemsToOrder: "Caisses",
      totalPrice: "Prix total"
    };
    I18n.i18next.addResources("fr", "providerOrder", text);
    I18n.i18next.addResources("en", "providerOrder", text);
    return {
      providerItems: null,
      incompleteQtyProviderItems: [],
      zeroQuantityItems: [],
      orderTotal: null,
      isLoading: true,
      isBackOrderDialog: false,
      editedItem: null,
      isSaveBackOrderLoading: false
    }
  },
  mounted: async function () {
    this.isLoading = true;
    this.memberOrdersItems = await BuyGroupOrderService.listMemberOrderItems(
        this.buyGroupId,
        this.buyGroupOrderId
    );
    const orderItemsByProvider = ProviderOrders.groupOrderItemsByProviders(this.memberOrdersItems);
    this.zeroQuantityItems = [];
    this.providerItems = orderItemsByProvider.providerOrders[this.providerName].filter((item) => {
      if (item.quantity === 0) {
        this.zeroQuantityItems.push(item)
        return false;
      }
      return true;
    })
    this.orderTotal = orderItemsByProvider.providerTotals[this.providerName];
    let incompleteOrderItemsByProvider = ProviderOrders.groupOrderItemsByProviders(
        this.memberOrdersItems,
        true
    );
    this.incompleteQtyProviderItems = incompleteOrderItemsByProvider.providerOrders[this.providerName];
    this.$emit('itemsDefined', orderItemsByProvider);
    this.isLoading = false;
  },
  methods: {
    setProductAsBackOrder: async function () {
      this.isSaveBackOrderLoading = true;
      const orderItemsOfProduct = this.memberOrdersItems.filter((orderItem) => {
        return orderItem.ProductId === this.editedItem.ProductId
      })
      for (const orderItem of orderItemsOfProduct) {
        await MemberOrderService.setQuantity(
            orderItem.MemberOrderId,
            this.editedItem.ProductId,
            0
        );
      }
      const providerItem = this.providerItems.filter((orderItem) => {
        return orderItem.ProductId === this.editedItem.ProductId
      })
      providerItem[0].quantity = 0;
      this.isSaveBackOrderLoading = false;
      this.isBackOrderDialog = false;
    },
    enterIsBackOrderFlow: function (item) {
      this.editedItem = item;
      this.isBackOrderDialog = true;
    },
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
  },
  computed: {
    nbExcludedProducts: function () {
      return this.incompleteQtyProviderItems.length + this.zeroQuantityItems.length;
    },
    nbDifferentProductsToOrder: function () {
      return this.providerItems.length
    },
    nbItemsToOrder: function () {
      return this.providerItems.reduce((sum, item) => {
        return sum + item.quantity
      }, 0)
    }
  }
}
</script>

<style scoped>

</style>
