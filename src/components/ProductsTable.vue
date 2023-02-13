<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="filteredProducts"
        :options="tableOptions"
        :no-data-text="$t('productTable:noProducts')"
        :no-results-text="$t('productTable:noProducts')"
        class="elevation-1 mt-8 productsTable body-1"
        :loading="loading"
        :loading-text="$t('productTable:loadingText')"
        :show-select="showSelect"
        v-model="selected"
        :search="search"
        :custom-filter="searchIgnoreAccents"
    >
      <template v-slot:top v-if="!hideSearch">
        <v-select
            v-model="chosenCategories"
            :items="categories"
            :label="$t('productTable:categoriesFilter')"
            multiple
            chips
            class="mx-4 mb-6"
            clearable
            persistent-hint
            :hint="$t('productTable:displayAllIfNoCategory')"
        ></v-select>
        <v-text-field
            prepend-inner-icon="search"
            label="Recherche"
            single-line
            hide-details
            v-model="search"
            class="mx-4 mb-6"
            clearable
            :id="searchElementId"
        ></v-text-field>
      </template>
      <template v-slot:item.expectedQuantity="{ item }" v-if="hasExpectedQuantity">
        <div v-if="showDecimalQuantityNotFractions">
          <span class="text-no-wrap">{{ item.expectedQuantity.toFixed(2) }}</span>
        </div>
        <div v-else>
          <v-text-field
              v-model="item.expectedQuantityInput"
              :placeholder="$t('quantityShort')"
              @keydown="enterKeyDownAction($event, item, changeExpectedQuantity)"
              @blur="changeExpectedQuantity($event, item)"
              v-if="canChangeExpectedQuantity"
              style="width:70px;"
              :hint="item.expectedQuantityHint"
              :persistent-hint="true"
          ></v-text-field>
          <div v-else>
            <span class="text-no-wrap">{{ item.expectedQuantityInput }}</span>
            <br>
            <small class="" v-if="item.expectedQuantityPercentage">{{ item.expectedQuantityPercentage }}%</small>
          </div>
        </div>
      </template>
      <template v-slot:item.allMembersQuantity="{ item }" v-if="showAllMembersQuantity">
        <div v-if="item.allMembersQuantity !== undefined && item.allMembersQuantity.remainingFraction > 0">
          <span class="">
            Il reste
          </span>
          <br>
          <span class="">
<!--            {{ item.allMembersQuantity.total }}-->
            {{ item.allMembersQuantity.remainingFraction }}
            {{ item.allMembersQuantity.format }}
          </span>
        </div>
        <!--        <span v-else class="red&#45;&#45;text font-weight-bold">-->
        <!--          {{ item.allMembersQuantity.total }}-->
        <!--        </span>-->
      </template>
      <template v-slot:item.quantity="{ item }" v-if="hasQuantity">
        <div v-if="showDecimalQuantityNotFractions">
          <span class="text-no-wrap">{{ item.quantity.toFixed(2) }}</span>
        </div>
        <div v-else>
          <v-text-field
              v-model="item.quantityInput"
              :placeholder="$t('quantityShort')"
              @keydown="enterKeyDownAction($event, item, changeQuantity)"
              @blur="changeQuantity($event, item)"
              v-if="canChangeQuantity"
              :hint="item.quantityHint"
              :persistent-hint="true"
              style="width:70px;"
          ></v-text-field>
          <div v-else>
            <span class="text-no-wrap">{{ item.quantityInput }}</span>
            <br>
            <small class="" v-if="item.quantityPercentage">{{ item.quantityPercentage }}%</small>
          </div>
        </div>
      </template>
      <template v-slot:item.expectedTotalAfterRebateWithTaxes="{ item }" v-if="hasExpectedQuantity">
        <span v-if="item.expectedTotalAfterRebateWithTaxes === undefined">
            <v-divider></v-divider>
        </span>
        <span v-else>
          {{ item.expectedTotalAfterRebateWithTaxes | currency }}
        </span>
      </template>
      <template v-slot:item.costTotal="{ item }" v-if="onlyShowCostTotal">
        <span v-if="item.costTotal === undefined">
            <v-divider></v-divider>
        </span>
        <span v-else>
          {{ item.costTotal | currency }}
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
      <template v-slot:item.format="{ item }">
        <!--        <span class="text-no-wrap">-->
        <span v-if="item.qtyInBox && item.qtyInBox > 1" class="font-weight-bold">
          {{ item.qtyInBox }}x
        </span>
        <span>
          {{ item.format }}
        </span>
        <!--        </span>-->
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
            v-if="canEditCostUnitPrice"
            suffix="$"
            hide-details
            hide-spin-buttons
            style="max-width:63px;"
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
      <template v-slot:item.isAdminRelated="{ item }" class="vh-center text-center">
        <v-icon v-if="item.isAdminRelated">
          check
        </v-icon>
        <span v-else>
          <v-divider width="25"></v-divider>
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
    <v-snackbar
        v-model="wrongFormatSnackbar"
        top
        :timeout="7000"
    >
        <span class="body-1">
          {{ $t('productTable:wrongFormat1') }}
          '{{ inputFormat }}'
          {{ $t('productTable:wrongFormat2') }}
          '{{ productFormat }}'
        </span>
      <template v-slot:action="{ attrs }">
        <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="wrongFormatSnackbar = false"
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
import QuantityInterpreter from "@/QuantityInterpreter";
import OrderItem from "@/OrderItem";
import VueScrollTo from 'vue-scrollto'
import BuildUniquePropertySetsInProducts from "@/BuildUniquePropertySetsInProducts";
import Search from "@/Search";

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
    showDecimalQuantityNotFractions: {
      type: Boolean,
      default: false
    },
    hideCategory: {
      type: Boolean,
      default: false
    },
    hideCategoriesFilter: {
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
    hideSearch: {
      type: Boolean,
      default: false
    },
    showIsAdminRelated: {
      type: Boolean,
      default: false
    },
    showAllMembersQuantity: {
      type: Boolean,
      default: false
    },
    onlyShowCostTotal: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    ProductTranslation.setup();
    const text = {
      create: "Nouveau",
      updatePrice: "Prix mis à jour",
      nothing: "Rien de changé",
      loadingText: "Liste de produits en chargement",
      noProducts: "Pas de produits",
      quantityUpdated: "Quantité mise à jour",
      costUnitPriceUpdated: "Prix coûtant mis à jour",
      wrongFormat1: "Le format entré",
      wrongFormat2: "ne correspond pas au format du produit",
      categoriesFilter: "Afficher les produits dans ces catégories",
      displayAllIfNoCategory: "Tous les produits s'affichent si rien n'est sélectionné"
    };
    I18n.i18next.addResources("fr", "productTable", text);
    I18n.i18next.addResources("en", "productTable", text);
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
      }
    ]
    if (!this.hideExpectedUnitPrice) {
      headers.push({
        text: this.$t('product:expectedUnitPrice'),
        value: 'expectedUnitPrice'
      });
    }
    if (this.showExpectedUnitPriceAfterRebate) {
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
    if (!this.hideCategory) {
      headers.push(
          {
            text: this.$t('product:category'),
            value: 'category'
          }
      )
    }
    headers = headers.concat([
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
    if (this.showAllMembersQuantity) {
      headers.unshift({
        text: this.$t('product:remainingQtyToDivide'),
        value: 'allMembersQuantity'
      });
    }
    if (this.hasExpectedQuantity) {
      headers.unshift({
        text: this.$t('product:expectedQuantityShort'),
        value: 'expectedQuantity',
        sortable: true
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
    if (this.hasQuantity && !this.onlyShowCostTotal) {
      headers.unshift({
        text: this.$t('product:totalFinal'),
        value: 'totalAfterRebateWithTaxes'
      });
    }
    if (this.hasExpectedQuantity && !this.onlyShowCostTotal) {
      headers.unshift({
        text: this.$t('product:expectedTotal'),
        value: 'expectedTotalAfterRebateWithTaxes'
      });
    }
    if (this.onlyShowCostTotal) {
      headers.unshift({
        text: this.$t('product:totalFinal'),
        value: 'costTotal'
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
    if (this.showIsAdminRelated) {
      headers.push({
        text: this.$t('product:isAdminRelated'),
        value: 'isAdminRelated'
      });
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
      costUnitPriceUpdateSnackbar: false,
      wrongFormatSnackbar: false,
      inputFormat: "",
      productFormat: "",
      searchElementId: "search-" + Math.random(),
      chosenCategories: []
    }
  },
  computed: {
    filteredProducts: function () {
      if (this.chosenCategories.length === 0) {
        return this.products;
      }
      return this.products.filter((product) => {
        return this.chosenCategories.indexOf(product.category) > -1;
      });
    },
    categories: function () {
      if (!this.hideCategoriesFilter && this.products !== undefined) {
        const sets = BuildUniquePropertySetsInProducts.build(
            this.products
        );
        return sets.categories;
      }
      return [];
    }
  },
  watch: {
    selected: async function () {
      await this.$emit('selectionChanged', this.selected);
    }
  },
  methods: {
    searchItem: function (item) {
      this.search = item.description === undefined ? item.name : item.description;
      VueScrollTo.scrollTo(
          document.getElementById(this.searchElementId), 500, {
            easing: 'linear',
            offset: 60
          }
      );
    },
    searchIgnoreAccents(value, search) {
      return Search.matches(value, search);
    },
    enterKeyDownAction: function (event, entity, action) {
      if (event.keyCode === ENTER_KEY_CODE) {
        action(event, entity);
      }
    }
    ,
    async changeCostUnitPrice(event, product) {
      if (isNaN(product.costUnitPrice)) {
        return;
      }
      if (parseFloat(product.previousCostUnitPrice) === parseFloat(product.costUnitPrice)) {
        return;
      }
      await this.$emit('costUnitPriceUpdate', product)
    }
    ,
    changeQuantity: async function (event, product) {
      await this._tryToChangeExpectedOrFinalQuantity(
          event,
          product,
          false
      );
    }
    ,
    changeExpectedQuantity: async function (event, product) {
      await this._tryToChangeExpectedOrFinalQuantity(
          event,
          product,
          true
      );
    }
    ,
    _tryToChangeExpectedOrFinalQuantity: async function (event, product, isForExpected) {
      const propertyName = isForExpected ? 'expectedQuantity' : 'quantity';
      const propertyNameUpper = isForExpected ? 'ExpectedQuantity' : 'Quantity';
      const inputPropertyName = propertyName + 'Input';
      const previousPropertyName = 'previous' + propertyNameUpper + 'Input'
      const hasChanged = await this._changeExpectedOrFinalQuantity(event, product, isForExpected);
      if (hasChanged === false) {
        if (product[previousPropertyName] === undefined) {
          product[previousPropertyName] = "";
        }
        event.target.value = product[inputPropertyName] = product[previousPropertyName];
        if (product[previousPropertyName] !== "") {
          if (isForExpected) {
            OrderItem.defineExpectedQuantityFraction(product);
          } else {
            OrderItem.defineQuantityFraction(product);
          }
        }
      } else {
        product[previousPropertyName] = product[inputPropertyName];
      }
    }
    ,
    _changeExpectedOrFinalQuantity: async function (event, product, isForExpected) {
      const propertyName = isForExpected ? 'expectedQuantity' : 'quantity';
      const inputPropertyName = propertyName + 'Input';
      const propertyNameUpper = isForExpected ? 'ExpectedQuantity' : 'Quantity';
      const previousPropertyName = 'previous' + propertyNameUpper + 'Input';
      if (String(product[inputPropertyName]).trim() === "") {
        product[propertyName] = 0;
      }
      const inputFormat = QuantityInterpreter.getFormat(String(product[inputPropertyName]));
      if (inputFormat === 'unit') {
        if (product[inputPropertyName] === undefined || isNaN(product[inputPropertyName].replaceAll(",", "."))) {
          return false;
        }
      } else if (inputFormat === 'nb') {
        if (QuantityInterpreter.getQty(product[inputPropertyName]) === null) {
          return false;
        }
      } else {
        const productFormat = QuantityInterpreter.getFormat(product.format)
        if (productFormat !== inputFormat) {
          this.inputFormat = inputFormat;
          this.productFormat = productFormat;
          this.wrongFormatSnackbar = true;
          return false;
        }
      }
      if (product[previousPropertyName] == product[inputPropertyName]) {
        return false;
      }
      const qty = QuantityInterpreter.getQty(String(product[inputPropertyName]));
      if (qty < 0) {
        return false;
      }
      if (isForExpected) {
        OrderItem.defineExpectedQuantityFraction(product);
      } else {
        OrderItem.defineQuantityFraction(product);
      }

      await this.$emit('quantityUpdate', product)
    }
    ,
    showQuantityChangedSuccess: async function () {
      const timeout = this.quantityUpdateSnackbar ? 500 : 0;
      this.quantityUpdateSnackbar = false;
      await this.$nextTick();
      setTimeout(() => {
        this.quantityUpdateSnackbar = true;
      }, timeout)
    }
    ,
    showCostUnitPriceChangedSuccess: async function () {
      const timeout = this.costUnitPriceUpdateSnackbar ? 500 : 0;
      this.costUnitPriceUpdateSnackbar = false;
      await this.$nextTick();
      setTimeout(() => {
        this.costUnitPriceUpdateSnackbar = true;
      }, timeout)
    }
    ,
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

.productsTable tbody .v-messages__message {
  font-weight: normal;
  color: black;
  font-size: 17px !important;
  padding-top: 6px;
  padding-bottom: 8px;
}
</style>
