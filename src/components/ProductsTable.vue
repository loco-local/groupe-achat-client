<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="products"
        :options="tableOptions"
        :no-data-text="$t('productTable:noProducts')"
        class="elevation-1 mt-8 productsTable body-1"
        :loading="loading"
        :loading-text="$t('productTable:loadingText')"
        :show-select="showSelect"
        v-model="selected"
        :search="search"
    >
      <template v-slot:top v-if="!hideSearch">
        <v-text-field
            prepend-inner-icon="search"
            label="Recherche"
            single-line
            hide-details
            v-model="search"
            class="mx-4 mb-6"
            clearable
        ></v-text-field>
      </template>
      <template v-slot:item.expectedQuantity="{ item }" v-if="hasExpectedQuantity">
        <v-text-field
            type="number"
            v-model="item.expectedQuantity"
            :placeholder="$t('quantityShort')"
            @keydown="enterKeyDownAction($event, item, changeExpectedQuantity)"
            @blur="changeExpectedQuantity($event, item)"
            v-if="canChangeExpectedQuantity"
            style="max-width: 50px;"
        ></v-text-field>
        <span v-else>{{ item.expectedQuantity }}</span>
      </template>
      <template v-slot:item.quantity="{ item }" v-if="hasQuantity">
        <v-text-field
            type="number"
            v-model="item.quantity"
            :placeholder="$t('quantityShort')"
            @keydown="enterKeyDownAction($event, item, changeQuantity)"
            @blur="changeQuantity($event, item)"
            v-if="canChangeQuantity"
        ></v-text-field>
        <span v-else>{{ item.quantity }}</span>
      </template>
      <template v-slot:item.expectedTotalAfterRebateWithTaxes="{ item }" v-if="hasExpectedQuantity">
        <span v-if="item.expectedTotalAfterRebateWithTaxes === undefined">
            <v-divider></v-divider>
        </span>
        <span v-else>
          {{ item.expectedTotalAfterRebateWithTaxes | currency }}
        </span>
      </template>
      <template v-slot:item.totalAfterRebateWithTaxes="{ item }" v-if="hasQuantity">
        <span v-if="item.totalAfterRebateWithTaxes === undefined">
            <v-divider></v-divider>
        </span>
        <strong v-else>
          {{ item.totalAfterRebateWithTaxes | currency }}
        </strong>
      </template>
      <template v-slot:item.tps="{ item }">
        <span v-if="item.hasTPS">
          {{ item.tps | currency }}
        </span>
        <span v-else>
          <v-divider></v-divider>
        </span>
      </template>
      <template v-slot:item.tvq="{ item }">
        <span v-if="item.hasTVQ">
          {{ item.tvq | currency }}
        </span>
        <span v-else>
          <v-divider></v-divider>
        </span>
      </template>
      <template v-slot:item.expectedUnitPrice="{ item }">
        {{ item.expectedUnitPrice | currency }}
      </template>
      <template v-slot:item.expectedUnitPriceAfterRebate="{ item }">
        {{ item.expectedUnitPriceAfterRebate | currency }}
      </template>
      <template v-slot:item.unitPrice="{ item }">
        {{ item.unitPrice | currency }}
      </template>
      <template v-slot:item.expectedCostUnitPrice="{ item }">
        {{ item.expectedCostUnitPrice | currency }}
      </template>
      <template v-slot:item.costUnitPrice="{ item }">
        <v-text-field
            type="number"
            v-model="item.costUnitPrice"
            :placeholder="$t('product:unitPrice')"
            @keydown="enterKeyDownAction($event, item, changeCostUnitPrice)"
            @blur="changeCostUnitPrice($event, item)"
            v-if="canChangeQuantity"
            suffix="$"
            hide-details
            hide-spin-buttons
        ></v-text-field>
        <span v-else>{{ item.costUnitPrice | currency }}</span>
      </template>
      <template v-slot:item.hasTPS="{ item }">
        <span v-if="item.hasTPS">
          {{ $t('yes') }}
        </span>
        <span v-else>
          {{ $t('no') }}
        </span>
      </template>
      <template v-slot:item.hasTVQ="{ item }">
        <span v-if="item.hasTVQ">
          {{ $t('yes') }}
        </span>
        <span v-else>
          {{ $t('no') }}
        </span>
      </template>
      <template v-slot:item.isAvailable="{ item }" v-if="canToggleAvailability">
        <v-checkbox
            v-model="item.isAvailable"
            @change="toggleIsAvailable(item)"
        ></v-checkbox>
      </template>
      <template v-slot:item.edit="{ item }" v-if="showEditButton">
        <v-btn icon class="mx-0" @click="$emit('modify', item)">
          <v-icon color="primary">edit</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-snackbar
        v-model="quantityUpdateSnackbar"
        top
        :timeout="7000"
    >
        <span class="body-1">
          {{ $t('productTable:quantityUpdated') }}
        </span>
      <template v-slot:action="{ attrs }">
        <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="quantityUpdateSnackbar = false"
        >
          {{ $t('close') }}
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
        v-model="costUnitPriceUpdateSnackbar"
        top
        :timeout="7000"
    >
        <span class="body-1">
          {{ $t('productTable:costUnitPriceUpdated') }}
        </span>
      <template v-slot:action="{ attrs }">
        <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="costUnitPriceUpdateSnackbar = false"
        >
          {{ $t('close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import ProductTranslation from "@/ProductTranslation";
import I18n from "@/i18n";
import ProductService from "@/service/ProductService";
import Product from "@/Product";

const ENTER_KEY_CODE = 13;
export default {
  name: "ProductsTable",
  props: {
    'products': Array,
    loading: Boolean,
    showSelect: {
      type: Boolean,
      default: false
    },
    canToggleAvailability: {
      type: Boolean,
      default: true
    },
    canChangeExpectedQuantity: {
      type: Boolean,
      default: false
    },
    canChangeQuantity: {
      type: Boolean,
      default: false
    },
    hasQuantity: {
      type: Boolean,
      default: false
    },
    hasExpectedQuantity: {
      type: Boolean,
      default: false
    },
    showPersonName: {
      type: Boolean,
      default: false
    },
    showTaxes: {
      type: Boolean,
      default: false
    },
    showHasTaxes: {
      type: Boolean,
      default: false
    },
    showExpectedCostUnitPrice: {
      type: Boolean,
      default: false
    },
    showCostUnitPrice: {
      type: Boolean,
      default: false
    },
    canEditCostUnitPrice: {
      type: Boolean,
      default: false
    },
    showUnitPrice: {
      type: Boolean,
      default: false
    },
    hideExpectedUnitPrice: {
      type: Boolean,
      default: false
    },
    showExpectedUnitPriceAfterRebate: {
      type: Boolean,
      default: false
    },
    hideSearch:{
      type: Boolean,
      default: false
    }
  },
  data: function () {
    ProductTranslation.setup();
    I18n.i18next.addResources("fr", "productTable", {
      create: "Nouveau",
      updatePrice: "Prix mis à jour",
      nothing: "Rien de changé",
      loadingText: "Liste de produits en chargement",
      noProducts: "Pas de produits",
      quantityUpdated: "Quantité mise à jour",
      costUnitPriceUpdated: "Prix coûtant mis à jour"
    });
    I18n.i18next.addResources("en", "productTable", {
      create: "Nouveau",
      updatePrice: "Prix mis à jour",
      nothing: "Rien de changé",
      loadingText: "Liste de produits en chargement",
      noProducts: "Pas de produits",
      quantityUpdated: "Quantité mise à jour",
      costUnitPriceUpdated: "Prix coûtant mis à jour"
    });
    let headers = [
      {
        text: this.$t('product:name'),
        value: 'name'
      },
      {
        text: this.$t('product:format'),
        value: 'format',
        sort: function (a, b) {
          return Product.formatInKg(a) - Product.formatInKg(b);
        }
      },
      {
        text: this.$t('product:qtyInBox'),
        value: 'qtyInBox'
      }
    ]
    if (!this.hideExpectedUnitPrice) {
      headers.push({
        text: this.$t('product:expectedUnitPrice'),
        value: 'expectedUnitPrice'
      });
    }
    if(this.showExpectedUnitPriceAfterRebate){
      headers.push({
        text: this.$t('product:expectedUnitPrice'),
        value: 'expectedUnitPriceAfterRebate'
      });
    }
    if (this.showUnitPrice) {
      headers.push(
          {
            text: this.$t('product:unitPrice'),
            value: 'unitPrice'
          }
      )
    }
    if (this.showExpectedCostUnitPrice) {
      headers.push(
          {
            text: this.$t('product:expectedCostUnitPrice'),
            value: 'expectedCostUnitPrice'
          }
      )
    }
    if (this.showCostUnitPrice) {
      headers.push(
          {
            text: this.$t('product:costUnitPrice'),
            value: 'costUnitPrice'
          }
      )
    }
    headers = headers.concat([
          {
            text: this.$t('product:category'),
            value: 'category'
          },
          {
            text: this.$t('product:internalCode'),
            value: 'internalCode'
          },
          {
            text: this.$t('product:maker'),
            value: 'maker'
          },
          {
            text: this.$t('product:provider'),
            value: 'provider'
          },
        ]
    );
    if (this.hasQuantity) {
      headers.unshift({
        text: this.$t('product:qtyShortFinal'),
        value: 'quantity'
      });
    }
    if (this.hasExpectedQuantity) {
      headers.unshift({
        text: this.$t('product:expectedQuantityShort'),
        value: 'expectedQuantity'
      });
    }
    if (this.showTaxes) {
      headers.unshift({
        text: this.$t('product:tps'),
        value: 'tps'
      });
      headers.unshift(
          {
            text: this.$t('product:tvq'),
            value: 'tvq'
          }
      );
    }
    if (this.hasQuantity) {
      headers.unshift({
        text: this.$t('product:totalFinal'),
        value: 'totalAfterRebateWithTaxes'
      });
    }
    if (this.hasExpectedQuantity) {
      headers.unshift({
        text: this.$t('product:expectedTotal'),
        value: 'expectedTotalAfterRebateWithTaxes'
      });
    }
    if (this.showHasTaxes) {
      headers.push({
        text: this.$t('product:addTPS'),
        value: 'hasTPS'
      });
      headers.push(
          {
            text: this.$t('product:addTVQ'),
            value: 'hasTVQ'
          }
      );
    }
    if (this.canToggleAvailability) {
      headers.push({
        text: this.$t('product:isAvailable'),
        value: 'isAvailable'
      });
    }
    const showEditButton = new Boolean(this.$listeners && this.$listeners.modify).valueOf()
    if (showEditButton) {
      headers.push({
        text: '',
        sortable: false,
        value: 'edit'
      });
    }
    if (this.showPersonName) {
      headers.unshift({
        text: this.$t('product:personName'),
        sortable: true,
        value: 'personFullname'
      });
    }
    const tableOptions = {
      sortBy: ['name'],
      sortDesc: [true],
      page: 1,
      itemsPerPage: 50
    };
    if (this.canChangeQuantity || this.hasQuantity || this.canChangeExpectedQuantity || this.hasExpectedQuantity) {
      tableOptions.sortBy = [];
    }
    return {
      selected: [],
      search: null,
      tableOptions: tableOptions,
      headers: headers,
      showEditButton: showEditButton,
      quantityUpdateSnackbar: false,
      costUnitPriceUpdateSnackbar: false
    }
  },
  watch: {
    selected: async function () {
      await this.$emit('selectionChanged', this.selected);
    }
  },
  methods: {
    enterKeyDownAction: function (event, entity, action) {
      if (event.keyCode === ENTER_KEY_CODE) {
        action(event, entity);
      }
    },
    changeQuantity: async function (event, product) {
      if (isNaN(product.quantity)) {
        return;
      }
      if (parseFloat(product.previousQuantity) === parseFloat(product.quantity)) {
        return;
      }
      if (parseFloat(product.quantity) < 0) {
        event.target.value = product.quantity = product.previousQuantity;
        return;
      }
      await this.$emit('quantityUpdate', product)
      product.previousQuantity = product.quantity;
    },
    async changeCostUnitPrice(event, product) {
      if (isNaN(product.costUnitPrice)) {
        return;
      }
      if (parseFloat(product.previousCostUnitPrice) === parseFloat(product.costUnitPrice)) {
        return;
      }
      await this.$emit('costUnitPriceUpdate', product)
    },
    changeExpectedQuantity: async function (event, product) {
      if (product.expectedQuantity.trim() === "") {
        product.expectedQuantity = 0;
      }
      if (isNaN(product.expectedQuantity)) {
        return;
      }
      if (parseFloat(product.previousExpectedQuantity) === parseFloat(product.expectedQuantity)) {
        return;
      }
      if (parseFloat(product.expectedQuantity) < 0) {
        event.target.value = product.expectedQuantity = product.previousExpectedQuantity;
        return;
      }
      await this.$emit('quantityUpdate', product)
      product.previousExpectedQuantity = product.expectedQuantity;
    },
    showQuantityChangedSuccess: async function () {
      const timeout = this.quantityUpdateSnackbar ? 500 : 0;
      this.quantityUpdateSnackbar = false;
      await this.$nextTick();
      setTimeout(() => {
        this.quantityUpdateSnackbar = true;
      }, timeout)
    },
    showCostUnitPriceChangedSuccess: async function () {
      const timeout = this.costUnitPriceUpdateSnackbar ? 500 : 0;
      this.costUnitPriceUpdateSnackbar = false;
      await this.$nextTick();
      setTimeout(() => {
        this.costUnitPriceUpdateSnackbar = true;
      }, timeout)
    },
    toggleIsAvailable: async function (product) {
      if (product.isAvailable) {
        await ProductService.makeAvailable(product.id);
      } else {
        await ProductService.makeUnavailable(product.id);
      }
    }
  }
}
</script>

<style>
.productsTable .v-data-footer__select {
  display: none;
}

.productsTable td {
  font-size: 1em !important;
}

.productsTable th {
  font-size: 0.9em !important;
}
</style>
