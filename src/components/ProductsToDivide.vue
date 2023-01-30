<template>
  <v-card>
    <v-card-text v-if="isLoading">
      <v-progress-circular indeterminate :size="80" :width="2"></v-progress-circular>
    </v-card-text>
    <v-card-text v-if="!isLoading && !Object.keys(productsToDivide).length">
      {{ $t('divide:nothingToDivide') }}
    </v-card-text>
    <v-card-text v-if="!isLoading && Object.keys(productsToDivide).length">
      <v-text-field :placeholder="$t('divide:searchPlaceholder')" v-model="search"></v-text-field>
      <v-card v-for="productId in Object.keys(productsToDivideFiltered)" :key="productId" class="mb-6 mt-6">
        <v-card-title class="text-h6">
          {{ productsToDivide[productId][0].description }}
          <strong v-if="productsToDivide[productId][0].qtyInBox > 1" class="ml-2 mr-2">
            {{ productsToDivide[productId][0].qtyInBox }}x
          </strong>
          {{ productsToDivide[productId][0].format }}
        </v-card-title>
        <v-divider class="mb-6"></v-divider>
        <v-card-text class="body-1 text-left">
          <v-simple-table class="text-left">
            <thead>
            <tr>
              <th class="text-left">
                {{ $t('divide:member') }}
              </th>
              <th class="text-left">
                {{ $t('divide:quantity') }}
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in productsToDivide[productId]" :key="item.id">
              <td>
                {{ item.MemberOrder.Member.firstname }}
                {{ item.MemberOrder.Member.lastname }}
              </td>
              <td>
                {{ item.quantityInput }}
              </td>
            </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
import I18n from "@/i18n";
import BuyGroupOrderService from "@/service/BuyGroupOrderService";
import OrderItem from "@/OrderItem";
import latinize from "latinize";
import Search from "@/Search";

export default {
  name: "ProductsToDivide",
  props: ['buyGroupId', 'buyGroupOrderId'],
  data: function () {
    const text = {
      nothingToDivide: "Aucun produit à diviser",
      member: "Membre",
      quantity: "Quantité",
      searchPlaceholder: "Produit ou membre"
    };
    I18n.i18next.addResources("fr", "divide", text);
    I18n.i18next.addResources("en", "divide", text);
    return {
      isLoading: true,
      productsToDivide: [],
      search: ""
    }
  },
  mounted: async function () {
    const orderItems = await BuyGroupOrderService.listMemberOrderItems(
        this.buyGroupId,
        this.buyGroupOrderId
    );
    this.productsToDivide = orderItems.reduce((productsToDivide, orderItem) => {
      const quantity = OrderItem.getQty(orderItem);
      if (quantity % 1 === 0) {
        return productsToDivide;
      }
      if (productsToDivide[orderItem.ProductId] === undefined) {
        productsToDivide[orderItem.ProductId] = [];
      }
      productsToDivide[orderItem.ProductId].push(orderItem);
      return productsToDivide;
    }, {})
    this.isLoading = false;
  },
  computed: {
    productsToDivideFiltered: function () {
      if (this.search.trim() === "") {
        return this.productsToDivide;
      }
      return Object.keys(this.productsToDivide).reduce((filteredProducts, productId) => {
        let items = this.productsToDivide[productId];
        const filteredItems = items.filter((item) => {
          return Search.matchesAnyValues([
            item.description,
            item.MemberOrder.Member.firstname,
            item.MemberOrder.Member.lastname
          ], this.search);
        });
        if (filteredItems.length) {
          filteredProducts[productId] = filteredItems;
        }
        return filteredProducts;
      }, {})
    }
  },
  methods: {
    searchMatch: function (value, search) {
      return value != null &&
          search != null &&
          typeof value === 'string' &&
          latinize(value.toString().toLowerCase()).indexOf(latinize(search.toLowerCase())) !== -1
    }
  }
}
</script>

<style scoped>

</style>
