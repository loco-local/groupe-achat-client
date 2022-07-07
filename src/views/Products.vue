<template>
  <Page>
    <GroupOrderStatus @buyGroupDefined="setBuyGroup"
                      :buyGroupPath="$route.params.buyGroup"
                      class="mt-8"
    ></GroupOrderStatus>
    <v-alert
        text
        dense
        color="teal"
        icon="mdi-clock-fast"
        border="left"
        class="mt-8 body-1"
    >
      {{ $t('products:info1') }}
      <br>
      {{ $t('products:info2') }}
    </v-alert>
    <v-card flat class="" color="transparent">
      <!--      <v-card-title class="text-h4">-->
      <!--        {{ $t('products:title') }}-->
      <!--      </v-card-title>-->
      <v-card-text class="font-weight-bold text-left body-1">
        <span class="">{{ $t('total') }} : </span>
        {{ total | currency }}
      </v-card-text>
    </v-card>
    <v-row>
      <v-col v-if="!isLoading && products.length === 0" cols="12" class="text-h6">
        <v-sheet height="400" class="grey--text">
          {{ $t('products:noResults') }}
        </v-sheet>
      </v-col>
      <!--      <v-col v-else cols="12" md="4" class="text-center" v-for="product in products"-->
      <!--             :key="product.id">-->
      <!--        <ProductCard :product="product"></ProductCard>-->
      <!--      </v-col>-->

      <v-col cols="12" class="vh-center" v-if="isLoading">
        <v-progress-circular indeterminate :size="80" :width="2"></v-progress-circular>
      </v-col>
      <ProductsTable
          v-else
          :products="products || []"
          :canToggleAvailability="false"
          :canChangeExpectedQuantity="canChangeExpectedQuantity"
          :hasExpectedQuantity="hasExpectedQuantity"
          :showExpectedCostUnitPrice="true"
          :showTaxes="true"
          @quantityUpdate="updateOrderQuantity"
          ref="productsTable"
      ></ProductsTable>
    </v-row>
  </Page>
</template>

<script>
import ProductService from "@/service/ProductService";
import I18n from "@/i18n";
import MemberOrderService from "@/service/MemberOrderService";
import GroupOrder from "@/GroupOrder";
import OrderItem from "@/OrderItem";

export default {
  name: "Products",
  components: {
    Page: () => import('@/components/Page'),
    ProductsTable: () => import('@/components/ProductsTable'),
    GroupOrderStatus: () => import('@/components/GroupOrderStatus')
  },
  data: function () {
    I18n.i18next.addResources("fr", "products", {
      "title": "Produits",
      info1: "Il n'y a pas de bouton de confirmation pour votre panier de commande.",
      info2: "À la date de fin de la commande, les dernières quantités que vous aurez inscrites seront commandées aux fournisseurs."
    });
    I18n.i18next.addResources("en", "products", {
      "title": "Produits",
      info1: "Il n'y a pas de bouton de confirmation pour votre panier de commande.",
      info2: "À la date de fin de la commande, les dernières quantités que vous aurez inscrites seront commandées aux fournisseurs."
    });
    return {
      products: [],
      orderItems: [],
      userOrderId: null,
      isLoading: false,
      canChangeExpectedQuantity: false,
      hasExpectedQuantity: false
    }
  },
  mounted: async function () {
    this.isLoading = true;
  },
  methods: {
    setBuyGroup: async function (buyGroup) {
      if (buyGroup.relevantOrder) {
        this.hasExpectedQuantity = true;
        this.canChangeExpectedQuantity = buyGroup.relevantOrder.status === GroupOrder.STATUS.CURRENT;
      }
      const userOrder = await MemberOrderService.get(
          buyGroup.id,
          buyGroup.relevantOrder.id,
          this.$store.state.user.id,
          true
      );
      this.userOrderId = userOrder.id;
      this.orderItems = await MemberOrderService.listForOrderId(userOrder.id);
      this.products = await ProductService.listPutForward(
          buyGroup.id,
          buyGroup.relevantOrder.salePercentage
      );
      this.orderItems.forEach((item) => {
        const matchingProduct = this.products.filter((product) => {
          return product.id === item.ProductId;
        });
        if (matchingProduct.length) {
          matchingProduct[0].expectedQuantity = item.expectedQuantity;
          matchingProduct[0].previousExpectedQuantity = item.expectedQuantity;
          matchingProduct[0].expectedTotalAfterRebateWithTaxes = OrderItem.calculateTotal(
              item,
              item.expectedQuantity,
              item.expectedUnitPrice
          )
          matchingProduct[0].tps = OrderItem.calculateTPS(
              item,
              item.expectedQuantity,
              item.expectedUnitPrice
          )
          matchingProduct[0].tvq = OrderItem.calculateTVQ(
              item,
              item.expectedQuantity,
              item.expectedUnitPrice
          )
        }
      });
      this.products = this.products.sort((a, b) => {
        return (b.expectedQuantity || 0) - (a.expectedQuantity || 0);
      });
      this.isLoading = false;
    },
    updateOrderQuantity: async function (updatedProduct) {
      let orderItem = this.orderItems.filter((orderItem) => {
        return orderItem.ProductId === updatedProduct.id;
      });
      if (!orderItem.length) {
        orderItem = {...updatedProduct};
        orderItem.expectedQuantity = 0;
        this.orderItems.push(
            orderItem
        )
      } else {
        orderItem = orderItem[0];
      }
      orderItem.expectedQuantity = updatedProduct.expectedQuantity;
      const prices = await MemberOrderService.setExpectedQuantity(
          this.userOrderId,
          updatedProduct.id,
          orderItem.expectedQuantity
      )
      updatedProduct.expectedTotalAfterRebateWithTaxes = prices.expectedTotalAfterRebateWithTaxes;
      updatedProduct.tps = prices.tps;
      updatedProduct.tvq = prices.tvq;
      updatedProduct.expectedQuantity = prices.expectedQuantity;
      this.$set(this.products, this.products.indexOf(updatedProduct), updatedProduct);
      await this.$refs.productsTable.showQuantityChangedSuccess();
    }
  },
  computed: {
    total: function () {
      return this.orderItems.reduce((total, orderItem) => {
        return OrderItem.calculateTotal(
            orderItem,
            orderItem.expectedQuantity,
            orderItem.expectedUnitPrice
        ) + total;
      }, 0)
    }
  }
}
</script>

<style scoped>

</style>
