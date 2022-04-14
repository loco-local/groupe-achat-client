<template>
  <Page>
    <v-card flat class="pt-8" color="transparent">
      <v-card-title class="text-h4">
        {{ $t('import:title') }}
      </v-card-title>
      <v-card-actions>
        <v-file-input
            truncate-length="15"
            v-model="productsFile"
        ></v-file-input>
      </v-card-actions>
    </v-card>
    <ProductsTable :products="products"></ProductsTable>
  </Page>
</template>

<script>
import ProductService from "@/service/ProductService";
import I18n from "@/i18n";

export default {
  name: "ImportProducts",
  components: {
    Page: () => import('@/components/Page'),
    ProductsTable: () => import('@/components/ProductsTable'),
  },
  data: function () {
    I18n.i18next.addResources("fr", "import", {
      "title": "Importer Produits"
    });
    I18n.i18next.addResources("en", "import", {
      "title": "Importer Produits"
    });
    return {
      products: [],
      productsFile: null,
      isProductsFileLoading: false,
    }
  },
  mounted: async function () {
  },
  methods: {
    enterImportFlow: function () {

    },
  },
  watch: {
    productsFile: async function () {
      this.isProductsFileLoading = true;
      let formData = new FormData();
      formData.append('file', this.productsFile, this.productsFile.name);
      this.formData = formData;
      this.products = await ProductService.uploadSatauProducts(formData);
      this.isProductsFileLoading = false
    }
  }
}
</script>

<style scoped>

</style>
