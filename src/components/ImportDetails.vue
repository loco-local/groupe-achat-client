<template>
  <div>
    <v-table v-if="propertiesAssociation !==null">
      <template v-slot:default>
        <thead>
        <tr>
          <th class="text-left font-weight-bold">
            Nom
          </th>
          <th class="text-left font-weight-bold">
            Fabriquant
          </th>
          <th class="text-left font-weight-bold">
            Catégorie
          </th>
          <th class="text-left font-weight-bold">
            Code Interne
          </th>
          <th class="text-left font-weight-bold">
            Quantité dans la boîte
          </th>
          <th class="text-left font-weight-bold">
            Format
          </th>
          <th class="text-left font-weight-bold">
            Prix coutant prévu
          </th>
        </tr>
        <tr>
          <th class="text-left font-weight-bold">
            <v-select
                :items="allProperties"
                v-model="propertiesAssociation.name"
                @update:model-value="changeAssociation"
                :loading="isChangingAssociation"
            >
            </v-select>
          </th>
          <th class="text-left font-weight-bold">
            <v-select
                :items="allProperties"
                v-model="propertiesAssociation.maker"
                @update:model-value="changeAssociation"
                :loading="isChangingAssociation"
            >
            </v-select>
          </th>
          <th class="text-left font-weight-bold">
            <v-select
                :items="allProperties"
                v-model="propertiesAssociation.category"
                @update:model-value="changeAssociation"
                :loading="isChangingAssociation"
            >
            </v-select>
          </th>
          <th class="text-left font-weight-bold">
            <v-select
                :items="allProperties"
                v-model="propertiesAssociation.internalCode"
                @update:model-value="changeAssociation"
                :loading="isChangingAssociation"
            >
            </v-select>
          </th>
          <th class="text-left font-weight-bold">
            <v-select
                :items="allProperties"
                v-model="propertiesAssociation.qtyInBox"
                @update:model-value="changeAssociation"
                :loading="isChangingAssociation"
            >
            </v-select>
          </th>
          <th class="text-left font-weight-bold">
            <v-select
                :items="allProperties"
                v-model="propertiesAssociation.format"
                @update:model-value="changeAssociation"
                :loading="isChangingAssociation"
            >
            </v-select>
          </th>
          <th class="text-left font-weight-bold">
            <v-select
                :items="allProperties"
                v-model="propertiesAssociation.expectedCostUnitPrice"
                @update:model-value="changeAssociation"
                :loading="isChangingAssociation"
            >
            </v-select>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(item) in rawDataTenFirst"
            :key="item.internalCode"
        >
          <td>{{ item[propertiesAssociation.name] }}</td>
          <td>{{ item[propertiesAssociation.maker] }}</td>
          <td>{{ item[propertiesAssociation.category] }}</td>
          <td>{{ item[propertiesAssociation.internalCode] }}</td>
          <td>{{ item[propertiesAssociation.qtyInBox] }}</td>
          <td>{{ item[propertiesAssociation.format] }}</td>
          <td>{{ item[propertiesAssociation.expectedCostUnitPrice] }}</td>
        </tr>
        </tbody>
      </template>
    </v-table>
    <v-divider class="mt-8 mb-8"></v-divider>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title>
          {{ $t('import:productsNotAvailable') }}
          <strong class="ml-2">{{ productsToDisable.length }}</strong>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <ProductsTable
              :products="productsToDisable"
              v-if="!isLoading"
              :canToggleAvailability="false"
              :showExpectedCostUnitPrice="true"
              :hideExpectedUnitPrice="true"
          ></ProductsTable>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title>
          {{ $t('import:priceUpdatedProducts') }}
          <strong class="ml-2">{{ updatePriceProducts.length }}</strong>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <ProductsTable
              :products="updatePriceProducts"
              v-if="!isLoading"
              :canToggleAvailability="false"
              :showExpectedCostUnitPrice="true"
              :hideExpectedUnitPrice="true"
          ></ProductsTable>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title>
          {{ $t('import:invalidFormat') }}
          <strong class="ml-2">{{ wrongFormatProducts.length }}</strong>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <ProductsTable
              :products="wrongFormatProducts"
              v-if="!isLoading"
              :canToggleAvailability="false"
              :showExpectedCostUnitPrice="true"
              :hideExpectedUnitPrice="true"
          ></ProductsTable>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title>
          {{ $t('import:newProducts') }}
          <strong class="ml-2">{{ newProducts.length }}</strong>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <ProductsTable
              :products="newProducts"
              v-if="!isLoading"
              :canToggleAvailability="false"
              :showExpectedCostUnitPrice="true"
              :hideExpectedUnitPrice="true"
          ></ProductsTable>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title>
          {{ $t('import:productsNothingChanged') }}
          <strong class="ml-2">{{ doNothingProducts.length }}</strong>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <ProductsTable
              :products="doNothingProducts"
              v-if="!isLoading"
              :canToggleAvailability="false"
              :showExpectedCostUnitPrice="true"
              :hideExpectedUnitPrice="true"
          ></ProductsTable>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-card class="mb-12 mt-12" v-if="uploadUuid !== null">
      <v-card-title>
        {{ $t('import:areDataOk') }}
      </v-card-title>
      <v-card-actions>
        <v-btn color="primary" @click="acceptImport"
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
  </div>
</template>

<script>
import ProductUploadService from "@/service/ProductUploadService";
import {defineAsyncComponent} from "vue";

export default {
  name: "ImportDetails",
  components: {
    ProductsTable: defineAsyncComponent(() => import('@/components/ProductsTable'))
  },
  props: ['isLoading', 'readyToConfirm'],
  data: function () {
    return {
      acceptUploadLoading: false,
      newProducts: [],
      updatePriceProducts: [],
      productsToDisable: [],
      wrongFormatProducts: [],
      doNothingProducts: [],
      uploadUuid: null,
      propertiesAssociation: null,
      rawDataTenFirst: [],
      allProperties: [],
      haveAssociationsChanged: false,
      isChangingAssociation: false
    }
  },
  methods: {
    changeAssociation: async function () {
      this.isChangingAssociation = true;
      this.haveAssociationsChanged = true;
      await ProductUploadService.changeAssociations(
          "Satau",
          this.propertiesAssociation
      )
      this.isChangingAssociation = false;
    },
    acceptImport: async function () {
      this.acceptUploadLoading = true;
      await ProductUploadService.acceptImport(this.uploadUuid, this.haveAssociationsChanged);
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
        case "wrongFormat":
          return this.wrongFormatProducts
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
    setProducts: function (products, uploadUuid, propertiesAssociation, rawDataTenFirst) {
      products.forEach((product) => {
        const productArray = this._productArrayForAction(product.action);
        productArray.push(product);
      })
      this.haveAssociationsChanged = false;
      this.isChangingAssociation = false
      this.uploadUuid = uploadUuid;
      if (propertiesAssociation) {
        this.propertiesAssociation = propertiesAssociation.associations.associations;
        this.allProperties = Object.keys(rawDataTenFirst[0]);
        this.rawDataTenFirst = rawDataTenFirst.slice(1, 9);
      }
    },
    clear: function () {
      this.propertiesAssociation = null;
      this.haveAssociationsChanged = false;
      this.isChangingAssociation = false;
      this.rawDataTenFirst = [];
      this.allProperties = [];
      this.uploadUuid = null;
      this.newProducts = [];
      this.updatePriceProducts = [];
      this.productsToDisable = [];
      this.wrongFormatProducts = [];
      this.doNothingProducts = [];
    }
  }
}
</script>

<style scoped>

</style>
