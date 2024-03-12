<template>
  <div>
    <v-card class="mb-8" flat>
      <v-card-text class="text-body-1">
        <p>
          Ouvrez le catalogue pdf avec chrome.
        </p>
        <p>
          Faites ctrl+a, ctrl+c.
        </p>
        <p>
          Cliquez dans la boîte de texte ci-dessous et faites ctrl+v.
        </p>
      </v-card-text>
      <v-card-text>
        <v-textarea v-model="hnTextBlock">
        </v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="send" :disabled="hnTextBlock === null || hnTextBlock === '' || isLoading" :loading="isLoading">
          {{ $t('send') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <ImportDetails
        :isLoading="isLoading"
        ref="import"
    ></ImportDetails>
  </div>
</template>

<script>
import ProductUploadService from "@/service/ProductUploadService";
import {defineAsyncComponent} from "vue";
export default {
  name: "HNImport",
  components: {
    ImportDetails: defineAsyncComponent(() => import('@/components/ImportDetails'))
  },
  data: function () {
    return {
      hnTextBlock: null,
      isLoading: false
    }
  },
  methods: {
    send: async function () {
      this.isLoading = true;
      const uploadData = await ProductUploadService.sendHNProducts(this.hnTextBlock);
      this.$refs.import.setProducts(
          uploadData.formattedData,
          uploadData.uploadUuid
      );
      this.isLoading = false;
    }
  }
}
</script>

<style scoped>

</style>
