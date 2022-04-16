<template>
  <Page>
    <v-card flat class="pt-8" color="transparent">
      <v-card-title class="text-h4">
        {{ $t('products:title') }}
      </v-card-title>
    </v-card>
    <ProductsTable :products="products" :loading="isLoading"></ProductsTable>
  </Page>
</template>

<script>
import ProductService from "@/service/ProductService";
import I18n from "@/i18n";

export default {
  name: "Products",
  components: {
    Page: () => import('@/components/Page'),
    ProductsTable: () => import('@/components/ProductsTable'),
  },
  data: function () {
    I18n.i18next.addResources("fr", "products", {
      "title": "Produits",
      "import" : "Importer Produits"
    });
    I18n.i18next.addResources("en", "products", {
      "title": "Produits",
      "import" : "Importer Produits"
    });
    return {
      products: [],
      isLoading: false
    }
  },
  mounted: async function () {
    this.isLoading = true;
    this.products = await ProductService.list();
    this.isLoading = false;
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
