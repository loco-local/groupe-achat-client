<template>
  <div>
    <v-card>
      <v-card-actions>
        <v-file-input
            truncate-length="15"
            v-model="productsFile"
            :loading="isProductsFileLoading"
            placeholder="Bon de commande excel"
        ></v-file-input>
      </v-card-actions>
    </v-card>
    <ImportDetails
        :isLoading="productsFile === null || isProductsFileLoading"
        ref="import"
    >
    </ImportDetails>
  </div>
</template>

<script>

import ProductService from "@/service/ProductService";

export default {
  name: "SatauImport",
  components: {
    ImportDetails: () => import('@/components/ImportDetails')
  },
  data: function () {
    return {
      productsFile: null,
      isProductsFileLoading: false
    }
  },
  methods: {

  },
  watch: {
    productsFile: async function () {
      this.isProductsFileLoading = true;
      let formData = new FormData();
      formData.append('file', this.productsFile, this.productsFile.name);
      const uploadData = await ProductService.uploadSatauProducts(formData);
      this.$refs.import.setProducts(uploadData.formattedData, uploadData.uploadUuid);
      this.isProductsFileLoading = false
    }
  }
}
</script>

<style scoped>

</style>
