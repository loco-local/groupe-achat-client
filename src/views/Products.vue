<template>
  <Page>
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
      ></ProductsTable>
    </v-row>
  </Page>
</template>

<script>
import ProductService from "@/service/ProductService";
import I18n from "@/i18n";
import BuyGroupService from "@/service/BuyGroupService";

export default {
  name: "Products",
  components: {
    Page: () => import('@/components/Page'),
    ProductsTable: () => import('@/components/ProductsTable'),
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
      isLoading: false
    }
  },
  mounted: async function () {
    this.isLoading = true;
    const buyGroupPath = this.$route.params.buyGroup;
    const buyGroup = await BuyGroupService.getForPath(buyGroupPath);
    this.products = await ProductService.listPutForward(buyGroup.id);
    this.isLoading = false;
  }
}
</script>

<style scoped>

</style>
