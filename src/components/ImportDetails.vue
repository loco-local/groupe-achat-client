<template>
  <div>
    <v-card class="mb-12 mt-12" v-if="uploadUuid !== null">
      <v-card-title>
        {{ $t('import:areDataOk') }}
      </v-card-title>
      <v-card-actions>
        <v-btn color="success" @click="acceptImport"
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
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ $t('import:productsNotAvailable') }}
          <strong class="ml-2">{{ productsToDisable.length }}</strong>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <ProductsTable
              :products="productsToDisable"
              v-if="!isLoading"
              :canToggleAvailability="false"
              :showExpectedCostUnitPrice="true"
              :hideExpectedUnitPrice="true"
          ></ProductsTable>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ $t('import:priceUpdatedProducts') }}
          <strong class="ml-2">{{ updatePriceProducts.length }}</strong>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <ProductsTable
              :products="updatePriceProducts"
              v-if="!isLoading"
              :canToggleAvailability="false"
              :showExpectedCostUnitPrice="true"
              :hideExpectedUnitPrice="true"
          ></ProductsTable>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ $t('import:newProducts') }}
          <strong class="ml-2">{{ newProducts.length }}</strong>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <ProductsTable
              :products="newProducts"
              v-if="!isLoading"
              :canToggleAvailability="false"
              :showExpectedCostUnitPrice="true"
              :hideExpectedUnitPrice="true"
          ></ProductsTable>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ $t('import:productsNothingChanged') }}
          <strong class="ml-2">{{ doNothingProducts.length }}</strong>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <ProductsTable
              :products="doNothingProducts"
              v-if="!isLoading"
              :canToggleAvailability="false"
              :showExpectedCostUnitPrice="true"
              :hideExpectedUnitPrice="true"
          ></ProductsTable>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import ProductService from "@/service/ProductService";

export default {
  name: "ImportDetails",
  components: {
    ProductsTable: () => import('@/components/ProductsTable')
  },
  props: ['isLoading', 'readyToConfirm'],
  data: function () {
    return {
      acceptUploadLoading: false,
      newProducts: [],
      updatePriceProducts: [],
      productsToDisable: [],
      doNothingProducts: [],
      uploadUuid: null
    }
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
    },
    _productArrayForAction: function (action) {
      switch (action) {
        case "create":
          return this.newProducts
        case "updatePrice":
          return this.updatePriceProducts
        case "remove":
          return this.productsToDisable
        case "nothing":
          return this.doNothingProducts
      }
    },
    setProducts: function (products, uploadUuid) {
      products.forEach((product) => {
        const productArray = this._productArrayForAction(product.action);
        productArray.push(product);
      })
      this.uploadUuid = uploadUuid;
    }
  }
}
</script>

<style scoped>

</style>
