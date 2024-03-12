<template>
  <div :style="minHeightStyle">
    <v-data-table
        :headers="headers"
        :items="filteredProducts"
        :options="tableOptions"
        :no-data-text="$t('productTable:noProducts')"
        :no-results-text="$t('productTable:noProducts')"
        class="elevation-1 mt-8 productsTable text-body-1"
        :loading="loading"
        :loading-text="$t('productTable:loadingText')"
        :show-select="showSelect"
        v-model="selected"
        :search="search"
        :custom-filter="searchIgnoreAccents"
    >
      <template v-slot:top>
        <v-card class="mb-8" v-if="!hideCategoriesFilter">
          <v-card-title color="primary" class="text-body-1">
            <strong class="text-left text-body-1">
              {{ $t('productTable:categoriesFilter') }}
            </strong>
          </v-card-title>
          <v-card-text>
            <v-chip-group
                v-model="chosenCategories"
                color="primary"
                column
                multiple
            >
              <v-chip
                  v-for="category in categories"
                  :key="category"
                  :value="category"
                  variant="outlined"
              >
                {{ category }}
              </v-chip>
            </v-chip-group>
          </v-card-text>
        </v-card>
        <v-row class="vh-center pb-0" v-if="!hideSearch">
          <v-col cols="12" lg="3">
            <v-text-field
                prepend-inner-icon="search"
                label="Recherche"
                single-line
                hide-details
                v-model="search"
                class="mx-4 mb-6"
                clearable
                :id="searchElementId"
                variant="outlined"
                rounded
                bg-color="primary"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="mb-8 pt-0 mt-0" v-if="showDownload">
          <v-col cols="12" class="text-right mt-0 pt-0">
            <v-spacer></v-spacer>
            <v-btn @click="downloadAsCsv()">
              <v-icon start>download</v-icon>
              {{ $t('download') }}
            </v-btn>
          </v-col>
        </v-row>
        <v-card-title v-if="title !== ''" class="pt-0">
          {{ title }}
        </v-card-title>
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
              style="width:125px;"
              :hint="item.expectedQuantityHint"
              :persistent-hint="true"
              clearable
          >
          </v-text-field>
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
              style="width:125px;"
              clearable
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
          {{ $filters.currency(item.expectedTotalAfterRebateWithTaxes) }}
        </span>
      </template>
      <template v-slot:item.costTotal="{ item }" v-if="onlyShowCostTotal">
        <span v-if="item.costTotal === undefined">
            <v-divider></v-divider>
        </span>
        <span v-else>
          {{ $filters.currency(item.costTotal) }}
        </span>
      </template>
      <template v-slot:item.totalAfterRebateWithTaxes="{ item }" v-if="hasQuantity">
        <span v-if="item.totalAfterRebateWithTaxes === undefined">
            <v-divider></v-divider>
        </span>
        <strong v-else>
          {{ $filters.currency(item.totalAfterRebateWithTaxes) }}
        </strong>
      </template>
      <template v-slot:item.tps="{ item }">
        <span v-if="item.tps !== null && item.tps !== undefined && item.tps !== 0">
          {{ $filters.currency(item.tps) }}
        </span>
        <span v-else>
          <v-divider></v-divider>
        </span>
      </template>
      <template v-slot:item.tvq="{ item }">
        <span v-if="item.tvq !== null && item.tvq !== undefined && item.tvq !== 0">
          {{ $filters.currency(item.tvq) }}
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
        {{ $filters.currency(item.expectedUnitPrice) }}
      </template>
      <template v-slot:item.expectedUnitPriceAfterRebate="{ item }">
        {{ $filters.currency(item.expectedUnitPriceAfterRebate) }}
      </template>
      <template v-slot:item.unitPrice="{ item }">
        {{ $filters.currency(item.unitPrice) }}
      </template>
      <template v-slot:item.expectedCostUnitPrice="{ item }">
        {{ $filters.currency(item.expectedCostUnitPrice) }}
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
            style="max-width:125px;"
        ></v-text-field>
        <span v-else>{{ $filters.currency(item.costUnitPrice) }}</span>
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
      <template v-slot:item.isAdminRelated="{ item }">
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
            @update:model-value="toggleIsAvailable(item)"
        ></v-checkbox>
      </template>
      <template v-slot:item.edit="{ item }" v-if="showEditButton">
        <v-btn icon="edit" class="mx-0" @click="$emit('modify', item)" variant="text"></v-btn>
      </template>
      <template v-slot:footer>
        <slot name="footer"></slot>
      </template>
    </v-data-table>
    <v-snackbar
        v-model="quantityUpdateSnackbar"
        location="top"
        :timeout="7000"
    >
        <span class="text-body-1">
          {{ $t('productTable:quantityUpdated') }}
        </span>
      <template v-slot:action="{ attrs }">
        <v-btn
            color="white"
            variant="text"
            v-bind="attrs"
            @click="quantityUpdateSnackbar = false"
        >
          {{ $t('close') }}
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
        v-model="costUnitPriceUpdateSnackbar"
        location="top"
        :timeout="7000"
    >
        <span class="text-body-1">
          {{ $t('productTable:costUnitPriceUpdated') }}
        </span>
      <template v-slot:action="{ attrs }">
        <v-btn
            color="white"
            variant="text"
            v-bind="attrs"
            @click="costUnitPriceUpdateSnackbar = false"
        >
          {{ $t('close') }}
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
        v-model="wrongFormatSnackbar"
        location="top"
        :timeout="7000"
    >
        <span class="text-body-1">
          {{ $t('productTable:wrongFormat1') }}
          '{{ inputFormat }}'
          {{ $t('productTable:wrongFormat2') }}
          '{{ productFormat }}'
        </span>
      <template v-slot:action="{ attrs }">
        <v-btn
            color="white"
            variant="text"
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
import OrderToCsv from "@/OrderToCsv";

const ENTER_KEY_CODE = 13;
export default {
  name: "ProductsTable",
  props: {
    title: {
      type: String,
      default: ""
    },
    preventSearchFlickr: {
      type: Boolean,
      default: true
    },
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
    showMemberId: {
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
    },
    showDownload: {
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
      categoriesFilter: "Catégories",
      displayAllIfNoCategory: "Tous les produits s'affichent si rien n'est sélectionné"
    };
    I18n.i18next.addResources("fr", "productTable", text);
    I18n.i18next.addResources("en", "productTable", text);
    let headers = [
      {
        title: this.$t('product:name'),
        value: 'name',
        align: 'start',
      },
      {
        title: this.$t('product:format'),
        value: 'format',
        align: 'start',
        sort: function (a, b) {
          return Product.formatInKg(a) - Product.formatInKg(b);
        }
      }
    ]
    if (!this.hideExpectedUnitPrice) {
      headers.push({
        title: this.$t('product:expectedUnitPrice'),
        value: 'expectedUnitPrice',
        align: 'start',
      });
    }
    if (this.showExpectedUnitPriceAfterRebate) {
      headers.push({
        title: this.$t('product:expectedUnitPrice'),
        value: 'expectedUnitPriceAfterRebate',
        align: 'start',
      });
    }
    if (this.showUnitPrice) {
      headers.push(
          {
            title: this.$t('product:unitPrice'),
            value: 'unitPrice',
            align: 'start',
          }
      )
    }
    if (this.showExpectedCostUnitPrice) {
      headers.push(
          {
            title: this.$t('product:expectedCostUnitPrice'),
            value: 'expectedCostUnitPrice',
            align: 'start',
          }
      )
    }
    if (this.showCostUnitPrice) {
      headers.push(
          {
            title: this.$t('product:costUnitPrice'),
            value: 'costUnitPrice',
            align: 'start',
          }
      )
    }
    if (!this.hideCategory) {
      headers.push(
          {
            title: this.$t('product:category'),
            value: 'category',
            align: 'start',
          }
      )
    }
    headers = headers.concat([
          {
            title: this.$t('product:internalCode'),
            value: 'internalCode',
            align: 'start',
          },
          {
            title: this.$t('product:maker'),
            value: 'maker',
            align: 'start',
          },
          {
            title: this.$t('product:provider'),
            value: 'provider',
            align: 'start',
          },
        ]
    );
    if (this.hasQuantity) {
      headers.unshift({
        title: this.$t('product:qtyShortFinal'),
        value: 'quantity',
        align: 'start',
      });
    }
    if (this.showAllMembersQuantity) {
      headers.unshift({
        title: this.$t('product:remainingQtyToDivide'),
        value: 'allMembersQuantity',
        align: 'start',
      });
    }
    if (this.hasExpectedQuantity) {
      headers.unshift({
        title: this.$t('product:expectedQuantityShort'),
        value: 'expectedQuantity',
        align: 'start',
        sortable: true
      });
    }
    if (this.showTaxes) {
      headers.unshift({
        title: this.$t('product:tps'),
        value: 'tps',
        align: 'start',
      });
      headers.unshift(
          {
            title: this.$t('product:tvq'),
            value: 'tvq',
            align: 'start',
          }
      );
    }
    if (this.hasQuantity && !this.onlyShowCostTotal) {
      headers.unshift({
        title: this.$t('product:totalFinal'),
        value: 'totalAfterRebateWithTaxes',
        align: 'start',
      });
    }
    if (this.hasExpectedQuantity && !this.onlyShowCostTotal) {
      headers.unshift({
        title: this.$t('product:expectedTotal'),
        value: 'expectedTotalAfterRebateWithTaxes',
        align: 'start',
      });
    }
    if (this.onlyShowCostTotal) {
      headers.unshift({
        title: this.$t('product:totalFinal'),
        value: 'costTotal',
        align: 'start',
      });
    }
    if (this.showHasTaxes) {
      headers.push({
        title: this.$t('product:addTPS'),
        value: 'hasTPS',
        align: 'start',
      });
      headers.push(
          {
            title: this.$t('product:addTVQ'),
            value: 'hasTVQ',
            align: 'start',
          }
      );
    }
    if (this.showIsAdminRelated) {
      headers.push({
        title: this.$t('product:isAdminRelated'),
        value: 'isAdminRelated',
        align: 'start',
      });
    }
    if (this.canToggleAvailability) {
      headers.push({
        title: this.$t('product:isAvailable'),
        value: 'isAvailable',
        align: 'start',
      });
    }
    const showEditButton = new Boolean(this.$attrs && this.$attrs.onModify).valueOf()
    if (showEditButton) {
      headers.push({
        title: '',
        sortable: false,
        value: 'edit',
        align: 'start',
      });
    }
    if (this.showMemberId) {
      headers.unshift({
        title: "ID",
        sortable: true,
        value: 'MemberOrder.MemberId',
        align: 'start',
      });
    }
    if (this.showPersonName) {
      headers.unshift({
        title: this.$t('product:personName'),
        sortable: true,
        value: 'personFullname',
        align: 'start',
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
      chosenCategories: [],
      minHeightStyle: this.preventSearchFlickr ? "min-height: 1000px;" : ""
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
        return sets.categories.filter((category) => {
          if (category === null || category === undefined) {
            return false;
          }
          return category.trim() !== ""
        }).sort((a, b) => {
          return a.localeCompare(b);
        })
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
    downloadAsCsv: function () {
      OrderToCsv.exportForOnlyItems(this.filteredProducts)
    },
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
      if (product[inputPropertyName] === null || String(product[inputPropertyName]).trim() === "") {
        product[propertyName] = 0;
        product[inputPropertyName] = "0";
      }
      const inputFormat = QuantityInterpreter.getFormat(String(product[inputPropertyName]));
      if (inputFormat === 'unit') {
        if (product[inputPropertyName] === undefined || isNaN(String(product[inputPropertyName]).replaceAll(",", "."))) {
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
      let qty = QuantityInterpreter.getQty(String(product[inputPropertyName]));
      if (qty === null) {
        qty = 0;
      }
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
