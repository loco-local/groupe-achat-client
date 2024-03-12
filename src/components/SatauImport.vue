<template>
  <v-row>
    <v-col cols="12">
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
    </v-col>
  </v-row>
</template>

<script>

import ProductUploadService from "@/service/ProductUploadService";
import {defineAsyncComponent} from "vue";

export default {
  name: "SatauImport",
  components: {
    ImportDetails: defineAsyncComponent(() => import('@/components/ImportDetails'))
  },
  data: function () {
    return {
      productsFile: null,
      isProductsFileLoading: false
    }
  },
  methods: {},
  watch: {
    productsFile: async function () {
      this.isProductsFileLoading = true;
      let formData = new FormData();
      const file = this.productsFile[0];
      formData.append('file', file, file.name);
      const uploadData = await ProductUploadService.uploadSatauProducts(formData);
      this.$refs.import.setProducts(
          uploadData.formattedData,
          uploadData.uploadUuid,
          uploadData.propertiesAssociation,
          uploadData.rawDataTenFirst
      );
      this.isProductsFileLoading = false
    }
  }
}
</script>

<style scoped>

</style>
