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
            :loading="isProductsFileLoading"
        ></v-file-input>
      </v-card-actions>
    </v-card>
    <v-card class="mb-12 mt-12" v-if="uploadUuid !== null">
      <v-card-title>
        {{ $t('import:areDataOk') }}
      </v-card-title>
      <v-card-actions>
        <v-btn color="success" @click="acceptImport()"
               :loading="acceptUploadLoading"
               :disabled="acceptUploadLoading">
          {{ $t('import:yesDataOk') }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="refuseImport()" :disabled="acceptUploadLoading">
          {{ $t('import:noDataOk') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <!--    <v-row justify="center" class="">-->
    <!--      <v-col cols="12" class="text-center">-->
    <!--        <v-skeleton-loader-->
    <!--            width="100%"-->
    <!--            type="table"-->
    <!--            color="transparent"-->
    <!--            v-if="isProductsFileLoading"-->
    <!--        ></v-skeleton-loader>-->
    <!--      </v-col>-->
    <!--    </v-row>-->
    <ProductsTable :products="products" v-if="productsFile !== null && !isProductsFileLoading" :groupBy="['action']"></ProductsTable>
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
      "title": "Importer Produits",
      areDataOk: "Est-ce que les données semblent correct ?",
      yesDataOk: "Oui, mettre à jour la base de donnée",
      noDataOk: "Non, je ne suis pas sûr."
    });
    I18n.i18next.addResources("en", "import", {
      "title": "Importer Produits",
      areDataOk: "Est-ce que les données semblent correct ?",
      yesDataOk: "Oui, mettre à jour la base de donnée",
      noDataOk: "Non, je ne suis pas sûr."
    });
    return {
      products: [],
      productsFile: null,
      isProductsFileLoading: false,
      uploadUuid: null,
      acceptUploadLoading: false
    }
  },
  mounted: async function () {
    // this.uploadUuid = null;
    // this.acceptUploadLoading = false;
    // this.isProductsFileLoading = true;
  },
  methods: {
    acceptImport: async function () {
      this.acceptUploadLoading = true;
      await ProductService.acceptImport(this.uploadUuid);
      this.uploadUuid = null;
      this.acceptUploadLoading = false;
      await this.$router.push({
        name: 'AdminProducts'
      });
    },
    refuseImport: async function () {
      await this.$router.push({
        name: 'AdminProducts'
      });
    }
  },
  watch: {
    productsFile: async function () {
      this.isProductsFileLoading = true;
      let formData = new FormData();
      formData.append('file', this.productsFile, this.productsFile.name);
      this.formData = formData;
      const uploadData = await ProductService.uploadSatauProducts(formData);
      this.products = uploadData.formattedData;
      this.uploadUuid = uploadData.uploadUuid;
      this.isProductsFileLoading = false
    }
  }
}
</script>

<style scoped>

</style>
