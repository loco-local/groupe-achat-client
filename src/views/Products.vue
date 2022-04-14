<template>
  <Page>
    <v-card flat class="pt-8" color="transparent">
      <v-card-title class="text-h4">
        {{ $t('products:title') }}
      </v-card-title>
      <v-card-actions>
        <v-btn to="/produits/import">
          {{ $t('products:import') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <ProductsTable :products="products"></ProductsTable>
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
      products: []
    }
  },
  mounted: async function () {
    this.products = await ProductService.list();
  },
  methods: {
    importProducts: function () {

      // Use the javascript reader object to load the contents
      // of the file in the v-model prop

    }
  },
  watch: {
    productsFile: async function () {
      this.isProductsFileLoading = true;
      // console.log(this.productsFile);
      // const reader = new FileReader();
      // reader(this.read);
      // reader.onload = () => {
      //   this.data = reader.result;
      // }
      // const workbook = new ExcelJs.Workbook();
      // await workbook.xlsx.load(this.productsFile);
      // const rows = await readXlsFile(this.productsFile)
      // console.log(workbook);
      let formData = new FormData();
      formData.append('file', this.productsFile, this.productsFile.name);
      this.formData = formData;
      await ProductService.satau(formData).catch((err) => {
        console.log(err.response)
      });
      // setTimeout(() => {
      //   this.$set(this.organisation, 'customImage', response.data);
      //   this.rebuildImageUrl();
      //   this.isImageLoading = false;
      // }, 1000);
      this.isProductsFileLoading = false
    }
  }
}
</script>

<style scoped>

</style>
