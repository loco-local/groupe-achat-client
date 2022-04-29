<template>
  <Page>
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
      ></ProductsTable>
    </v-row>
  </Page>
</template>

<script>
import ProductService from "@/service/ProductService";

export default {
  name: "Products",
  components: {
    Page: () => import('@/components/Page'),
    ProductsTable: () => import('@/components/ProductsTable'),
  },
  data: function () {
    return {
      products: [],
      isLoading: false
    }
  },
  mounted: async function () {
    this.isLoading = true;
    this.products = await ProductService.listPutForward();
    this.isLoading = false;
  }
}
</script>

<style scoped>

</style>
