<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="products"
        :options="tableOptions"
        :no-data-text="$t('productTable:noProducts')"
        class="elevation-1 mt-8 productsTable"
        :loading="loading"
        :loading-text="$t('productTable:loadingText')"
        :show-select="showSelect"
        v-model="selected"
        :search="search"
    >
      <template v-slot:top>
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
      <template v-slot:item.expectedPrice="{ item }">
        {{ item.expectedPrice | currency }}
      </template>
      <template v-slot:item.price="{ item }">
        {{ item.price | currency }}
      </template>
      <template v-slot:item.expectedCostPrice="{ item }">
        {{ item.expectedCostPrice | currency }}
      </template>
      <template v-slot:item.costPrice="{ item }">
        <v-text-field
            type="number"
            v-model="item.costPrice"
            :placeholder="$t('product:price')"
            @keydown="enterKeyDownAction($event, item, changeCostPrice)"
            @blur="changeCostPrice($event, item)"
            v-if="canChangeQuantity"
            suffix="$"
            hide-details
            hide-spin-buttons
        ></v-text-field>
        <span v-else>{{ item.costPrice | currency }}</span>
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
        v-model="costPriceUpdateSnackbar"
        top
        :timeout="7000"
    >
        <span class="body-1">
          {{ $t('productTable:costPriceUpdated') }}
        </span>
      <template v-slot:action="{ attrs }">
        <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="costPriceUpdateSnackbar = false"
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
    showExpectedCostPrice: {
      type: Boolean,
      default: false
    },
    showCostPrice: {
      type: Boolean,
      default: false
    },
    canEditCostPrice: {
      type: Boolean,
      default: false
    },
    showUnitPrice: {
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
      costPriceUpdated: "Prix coûtant mis à jour"
    });
    I18n.i18next.addResources("en", "productTable", {
      create: "Nouveau",
      updatePrice: "Prix mis à jour",
      nothing: "Rien de changé",
      loadingText: "Liste de produits en chargement",
      noProducts: "Pas de produits",
      quantityUpdated: "Quantité mise à jour",
      costPriceUpdated: "Prix coûtant mis à jour"
    });
    let headers = [
      {
        text: this.$t('product:name'),
        value: 'name'
      },
      {
        text: this.$t('product:format'),
        value: 'format'
      },
      {
        text: this.$t('product:qtyInBox'),
        value: 'qtyInBox'
      },
      {
        text: this.$t('product:expectedPrice'),
        value: 'expectedPrice'
      }
    ]
    if (this.showUnitPrice) {
      headers.push(
          {
            text: this.$t('product:price'),
            value: 'price'
          }
      )
    }
    if (this.showExpectedCostPrice) {
      headers.push(
          {
            text: this.$t('product:expectedCostPrice'),
            value: 'expectedCostPrice'
          }
      )
    }
    if (this.showCostPrice) {
      headers.push(
          {
            text: this.$t('product:costPrice'),
            value: 'costPrice'
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
    if (this.hasQuantity) {
      headers.unshift({
        text: this.$t('product:qtyShortFinal'),
        value: 'quantity'
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
    if (this.hasExpectedQuantity) {
      headers.unshift({
        text: this.$t('product:expectedQuantityShort'),
        value: 'expectedQuantity'
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
      costPriceUpdateSnackbar: false
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
      await this.$emit('quantityUpdate', product)
      product.previousQuantity = product.quantity;
    },
    async changeCostPrice(event, product) {
      if (isNaN(product.costPrice)) {
        return;
      }
      if (parseFloat(product.previousCostPrice) === parseFloat(product.costPrice)) {
        return;
      }
      await this.$emit('costPriceUpdate', product)
    },
    changeExpectedQuantity: async function (event, product) {
      if (isNaN(product.expectedQuantity)) {
        return;
      }
      if (parseFloat(product.previousExpectedQuantity) === parseFloat(product.expectedQuantity)) {
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
    showCostPriceChangedSuccess: async function () {
      const timeout = this.costPriceUpdateSnackbar ? 500 : 0;
      this.costPriceUpdateSnackbar = false;
      await this.$nextTick();
      setTimeout(() => {
        this.costPriceUpdateSnackbar = true;
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
</style>
