<template>
  <Page>
    <GroupOrderStatus @buyGroupDefined="setBuyGroup"></GroupOrderStatus>
    <v-card flat class="pt-8" color="transparent">
      <v-card-title class="text-h4">
        {{ $t('products:title') }}
      </v-card-title>
    </v-card>
    <v-row>
      <v-col v-if="products.length === 0" cols="12" class="text-h6">
        <v-sheet height="400" class="grey--text">
          {{ $t('products:noResults') }}
        </v-sheet>
      </v-col>
      <!--      <v-col v-else cols="12" md="4" class="text-center" v-for="product in products"-->
      <!--             :key="product.id">-->
      <!--        <ProductCard :product="product"></ProductCard>-->
      <!--      </v-col>-->
      <ProductsTable
          :products="products || []"
          :loading="isLoading"
          :canToggleAvailability="false"
          :canOrder="true"
          @quantityUpdate="updateOrderQuantity"
      ></ProductsTable>
    </v-row>
  </Page>
</template>

<script>
import ProductService from "@/service/ProductService";
import I18n from "@/i18n";
import UserOrderService from "@/service/UserOrderService";

export default {
  name: "Products",
  components: {
    Page: () => import('@/components/Page'),
    ProductsTable: () => import('@/components/ProductsTable'),
    GroupOrderStatus: () => import('@/components/GroupOrderStatus')
  },
  data: function () {
    I18n.i18next.addResources("fr", "products", {
      "title": "Produits"
    });
    I18n.i18next.addResources("en", "products", {
      "title": "Produits"
    });
    return {
      products: [],
      userOrderId: null,
      isLoading: false
    }
  },
  mounted: async function () {
    this.isLoading = true;
  },
  methods: {
    setBuyGroup: async function (buyGroup) {
      const userOrder = await UserOrderService.get(
          buyGroup.id,
          buyGroup.relevantOrder.id,
          this.$store.state.user.id,
          true
      );
      this.userOrderId = userOrder.id;
      const items = await UserOrderService.listForOrderId(userOrder.id);
      this.products = await ProductService.listPutForward(buyGroup.id);
      items.forEach((item) => {
        const matchingProduct = this.products.filter((product) => {
          return product.id === item.ProductId;
        });
        if (matchingProduct.length) {
          matchingProduct[0].orderQuantity = item.quantity;
        }
      });
      this.isLoading = false;
    },
    updateOrderQuantity: async function (product) {
      await UserOrderService.setQuantity(
          this.userOrderId,
          product.id,
          product.orderQuantity
      )
    }
  }
}
</script>

<style scoped>

</style>
