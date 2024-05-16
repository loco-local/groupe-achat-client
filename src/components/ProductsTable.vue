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
        :search="searchTextConfirmed"
        :custom-filter="searchIgnoreAccents"
        :class="{
          'pa-0' : $vuetify.display.smAndDown
        }"
        :items-per-page="nbItemsPerPage"
    >
      <template v-slot:top>
        <v-row v-if="!hideCategoriesFilter" class="mb-8">
          <v-col cols="12">
            <v-expansion-panels variant="accordion" v-model="categoriesPanel">
              <v-expansion-panel value="categories">
                <v-expansion-panel-title>
                  <strong class="text-left text-body-1">
                    {{ $t('productTable:categoriesFilter') }}
                  </strong>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-chip-group
                      v-model="chosenCategory"
                      color="primary"
                      column
                  >
                    <v-chip
                        v-for="category in categories"
                        :key="category"
                        :value="category"
                        label
                    >
                      {{ category }}
                    </v-chip>
                  </v-chip-group>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
        <div v-if="!hideSearch">
          <v-row class="vh-center">
            <v-col cols="12" lg="3">
              <v-text-field
                  prepend-inner-icon="search"
                  :label="$t('productTable:searchPlaceholder')"
                  single-line
                  hide-details
                  v-model="searchText"
                  class="mx-4"
                  clearable
                  :id="searchElementId"
                  variant="outlined"
                  rounded
                  bg-color="primary"
                  @keyup.enter="applySearch"
                  @click:clear="applySearch"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="vh-center mb-6">
            <v-col cols="12" lg="3" class="vh-center">
              <v-btn color="primary" @click="applySearch" prepend-icon="search">
                {{ $t('productTable:search') }}
              </v-btn>
            </v-col>
          </v-row>
        </div>
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
      <template v-slot:header.expectedUnitPriceAfterRebate="{ column }">
        <strong>{{ column.title }}</strong>
      </template>
      <template v-slot:header.unitPrice="{ column }">
        <strong>{{ column.title }}</strong>
      </template>
      <template v-slot:header.expectedTotalAfterRebateWithTaxes="{ column }">
        <strong>{{ column.title }}</strong>
      </template>
      <template v-slot:header.totalAfterRebateWithTaxes="{ column }">
        <strong>{{ column.title }}</strong>
      </template>
      <template v-slot:item.expectedQuantity="{ item }">
        <div v-if="showDecimalQuantityNotFractions">
          <span class="text-no-wrap">{{ item.expectedQuantity.toFixed(2) }}</span>
        </div>
        <div v-else class="vh-center">
          <v-btn v-if="canChangeExpectedQuantity && item.expectedQuantityInput === undefined"
                 icon="add"
                 color="primary"
                 variant="text"
                 @click="enterChangeQuantityFlow(item, true)"
          ></v-btn>
          <v-btn
              v-if="canChangeExpectedQuantity && item.expectedQuantityInput !== undefined"
              color="primary" rounded variant="text"
              @click="enterChangeQuantityFlow(item, true)"
          >
            {{ item.expectedQuantityInput }}
            <v-icon end>edit</v-icon>
          </v-btn>
          <div v-else>
            <span class="text-no-wrap">{{ item.expectedQuantityInput }}</span>
            <br>
            <small class="" v-if="item.expectedQuantityPercentage">{{ item.expectedQuantityPercentage }}%</small>
          </div>
        </div>
      </template>
      <template v-slot:item.allMembersQuantity="{ item }" v-if="showAllMembersQuantity">
        <v-btn variant="text" color="primary"
               :size="item.allMembersQuantity.remainingFraction <= 0 ? 'small' : 'default'"
               v-if="item.allMembersQuantity !== undefined && item.allMembersQuantity.total !== 0 && (item.allMembersQuantity.orderItems.length > 1 || item.allMembersQuantity.remainingFraction > 0)"
               @click.prevent="enterDivideDetails(item, item.allMembersQuantity)"
        >
          <span v-if="item.allMembersQuantity.remainingFraction <= 0" class="">
            {{ $t('productTable:complete1') }}
            <br>
            {{ $t('productTable:complete2') }}
          </span>
          <span v-else>
            <span class="">
            {{ $t('productTable:remainingQty') }}
            </span>
            <br>
            <span class="">
              {{ item.allMembersQuantity.remainingFraction }}
              {{ item.allMembersQuantity.format }}
            </span>
          </span>
          <v-icon class="ml-2" size="x-large">people</v-icon>
        </v-btn>
        <span v-else>
          <v-divider></v-divider>
        </span>
      </template>
      <template v-slot:item.quantity="{ item }" v-if="hasQuantity">
        <div v-if="showDecimalQuantityNotFractions">
          <span class="text-no-wrap">{{ item.quantity.toFixed(2) }}</span>
        </div>
        <div v-else class="vh-center">
          <v-btn v-if="item.quantityInput === undefined"
                 icon="add"
                 color="primary"
                 variant="text"
                 @click="enterChangeQuantityFlow(item, false)"
          ></v-btn>
          <v-btn
              v-if="item.quantityInput !== undefined"
              color="primary" rounded variant="text"
              @click="enterChangeQuantityFlow(item, false)"
          >
            {{ item.quantityInput }}
            <v-icon end>edit</v-icon>
          </v-btn>
          <div v-else>
            <span class="text-no-wrap">{{ item.quantityInput }}</span>
            <br>
            <small class="" v-if="item.quantityPercentage">{{ item.quantityPercentage }}%</small>
          </div>
        </div>
      </template>
      <template v-slot:item.expectedTotalAfterRebateWithTaxes="{ item }">
        <span v-if="item.expectedTotalAfterRebateWithTaxes === undefined">
            <v-divider></v-divider>
        </span>
        <span v-else class="font-weight-bold">
          {{ $filters.currency(item.expectedTotalAfterRebateWithTaxes) }}
        </span>
      </template>
      <template v-slot:item.costTotal="{ item }">
        <span v-if="item.costTotal === undefined">
            <v-divider></v-divider>
        </span>
        <span v-else>
          {{ $filters.currency(item.costTotal) }}
        </span>
      </template>
      <template v-slot:item.totalAfterRebateWithTaxes="{ item }">
        <span v-if="item.totalAfterRebateWithTaxes === undefined">
            <v-divider></v-divider>
        </span>
        <strong v-else class="font-weight-bold">
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
        <strong>
          {{ $filters.currency(item.expectedUnitPrice) }}
        </strong>
      </template>
      <template v-slot:item.expectedUnitPriceAfterRebate="{ item }">
        <strong>
          {{ $filters.currency(item.expectedUnitPriceAfterRebate) }}
        </strong>
      </template>
      <template v-slot:item.unitPrice="{ item }">
        <strong>
          {{ $filters.currency(item.unitPrice) }}
        </strong>
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
            style="width:115px;"
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
      <template v-slot:body.append>
        <td :colspan="headers.length - 1" v-if="totals !== null">
          <v-row class="text-left mb-4" :class="{
            'ml-6' : $vuetify.display.mdAndUp
          }">
            <v-col cols="12">
              <v-row>
                <v-col cols="8"></v-col>
                <v-col cols="4">
                  <v-divider></v-divider>
                </v-col>
              </v-row>
              <v-row class="text-body-1">
                <v-col cols="2" md="1" class="ml-2">
                  {{ $t("productTable:subtotal") }}
                </v-col>
                <v-col cols="2">{{ $filters.currency(totals.subTotal) }}</v-col>
              </v-row>
              <v-row class="">
                <v-col cols="2" md="1" class="ml-2">TPS</v-col>
                <v-col cols="2">{{ $filters.currency(totals.tps) }}</v-col>
              </v-row>
              <v-row class="">
                <v-col cols="2" md="1" class="ml-2">TVQ</v-col>
                <v-col cols="2">{{ $filters.currency(totals.tvq) }}</v-col>
              </v-row>
              <v-row>
                <v-col cols="4" md="2" class="">
                  <v-divider class="ml-2"></v-divider>
                </v-col>
              </v-row>
              <v-row class="text-h6">
                <v-col cols="2" md="1" class="ml-2">Total</v-col>
                <v-col cols="2">{{ $filters.currency(totals.total) }}</v-col>
              </v-row>
            </v-col>
          </v-row>
        </td>
        <slot name="footer"></slot>
      </template>
      <template v-slot:bottom v-if="filteredProducts.length < nbItemsPerPage"></template>
    </v-data-table>
    <v-snackbar
        v-model="quantityUpdateSnackbar"
        location="top"
        :timeout="7000"
    >
        <span class="text-body-1">
          {{ $t('productTable:quantityUpdated') }}
        </span>
      <template v-slot:actions>
        <v-btn
            color="white"
            variant="text"
            @click="quantityUpdateSnackbar = false"
        >
          {{ $t('close') }}
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
        v-model="quantityUnchangedSnackbar"
        location="top"
        :timeout="7000"
    >
        <span class="text-body-1">
          {{ $t('productTable:quantityUnchanged') }}
        </span>
      <template v-slot:actions>
        <v-btn
            color="white"
            variant="text"
            @click="quantityUnchangedSnackbar = false"
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
      <template v-slot:actions>
        <v-btn
            color="white"
            variant="text"
            @click="costUnitPriceUpdateSnackbar = false"
        >
          {{ $t('close') }}
        </v-btn>
      </template>
    </v-snackbar>
    <QuantityChangeDialog ref="quantityChangeDialog" @quantityUpdate="updateQuantity"></QuantityChangeDialog>
    <DivideInfoDialog ref="divideInfoDialog" @quantityUpdate="updateQuantity"></DivideInfoDialog>
  </div>
</template>

<script>
import ProductTranslation from "@/ProductTranslation";
import I18n from "@/i18n";
import ProductService from "@/service/ProductService";
import Product from "@/Product";
import BuildUniquePropertySetsInProducts from "@/BuildUniquePropertySetsInProducts";
import Search from "@/Search";
import OrderToCsv from "@/OrderToCsv";
import QuantityChangeDialog from "@/components/ChangeQuantityDialog.vue";
import DivideInfoDialog from "./DivideInfoDialog.vue";

const ENTER_KEY_CODE = 13;
export default {
  name: "ProductsTable",
  components: {DivideInfoDialog, QuantityChangeDialog},
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
    },
    totals: {
      type: Object,
      default: null
    },
    hideInternalCode: {
      type: Boolean,
      default: false
    },
    hideMaker: {
      type: Boolean,
      default: false
    },
    hideProvider: {
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
      quantityUnchanged: "La quantité est la même et n'a pas été mise à jour.",
      costUnitPriceUpdated: "Prix coûtant mis à jour",
      categoriesFilter: "Catégories",
      displayAllIfNoCategory: "Tous les produits s'affichent si rien n'est sélectionné",
      searchPlaceholder: "Produit",
      search: "Recherche",
      subtotal: "Sous-total",
      quantity: "Quantité",
      expectedFemale: "Prévue",
      finalFemale: "Finale",
      expected: "Prévu",
      final: "Final",
      price: "Prix",
      total: "Total",
      costPrice: "Prix Coûtant",
      confirmQuantityChange: "Quantité non sauvegardée",
      yesIwant: "Oui j'en veux",
      noKeep: "Non, garder",
      remainingQty: "Il reste",
      complete1: "caisses",
      complete2: "complètes"
    };
    I18n.i18next.addResources("fr", "productTable", text);
    I18n.i18next.addResources("en", "productTable", text);
    let headers = [
      {
        title: this.$t('productTable:quantity'),
        align: 'center',
        children: [
          {
            title: this.$t('productTable:expectedFemale'),
            titleWhenNoParent: this.$t('product:expectedQuantityShort'),
            value: 'expectedQuantity',
            align: 'center',
            show: this.hasExpectedQuantity
          },
          {
            title: this.$t('productTable:finalFemale'),
            titleWhenNoParent: this.$t('product:qtyShortFinal'),
            value: 'quantity',
            align: 'center',
            show: this.hasQuantity
          },
        ]
      },
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
      },
      {
        title: this.$t('productTable:costPrice'),
        align: 'center',
        children: [
          {
            title: this.$t('productTable:expected'),
            titleWhenNoParent: this.$t('product:expectedCostUnitPrice'),
            value: 'expectedCostUnitPrice',
            align: 'center',
            show: this.showExpectedCostUnitPrice
          },
          {
            title: this.$t('productTable:final'),
            titleWhenNoParent: this.$t('product:costUnitPrice'),
            value: 'costUnitPrice',
            align: 'center',
            show: this.showCostUnitPrice
          },
        ]
      },
      {
        title: this.$t('productTable:price'),
        align: 'center',
        children: [
          {
            title: this.$t('productTable:expected'),
            titleWhenNoParent: this.$t('product:expectedUnitPrice'),
            value: 'expectedUnitPrice',
            align: 'center',
            show: !this.hideExpectedUnitPrice
          },
          {
            title: this.$t('productTable:expected'),
            titleWhenNoParent: this.$t('product:expectedUnitPrice'),
            value: 'expectedUnitPriceAfterRebate',
            align: 'center',
            show: this.showExpectedUnitPriceAfterRebate
          },
          {
            title: this.$t('productTable:final'),
            titleWhenNoParent: this.$t('product:unitPrice'),
            value: 'unitPrice',
            align: 'center',
            show: this.showUnitPrice
          },
        ]
      },
      {
        title: this.$t('productTable:total'),
        align: 'center',
        children: [
          {
            title: this.$t('productTable:expected'),
            titleWhenNoParent: this.$t('product:expectedTotal'),
            value: 'expectedTotalAfterRebateWithTaxes',
            align: 'center',
            show: this.hasExpectedQuantity && !this.onlyShowCostTotal
          },
          {
            title: this.$t('productTable:final'),
            titleWhenNoParent: this.$t('product:totalFinal'),
            value: 'totalAfterRebateWithTaxes',
            align: 'center',
            show: this.hasQuantity && !this.onlyShowCostTotal
          },
        ]
      },
      {
        title: this.$t('product:remainingQtyToDivide'),
        value: 'allMembersQuantity',
        align: 'center',
        show: this.showAllMembersQuantity
      },
      {
        title: this.$t('product:category'),
        value: 'category',
        align: 'start',
        show: !this.hideCategory
      },
      {
        title: this.$t('product:internalCode'),
        value: 'internalCode',
        align: 'start',
        show: !this.hideInternalCode
      },
      {
        title: this.$t('product:maker'),
        value: 'maker',
        align: 'start',
        show: !this.hideMaker
      },
      {
        title: this.$t('product:provider'),
        value: 'provider',
        align: 'start',
        show: !this.hideProvider
      },
      {
        title: this.$t('product:tps'),
        value: 'tps',
        align: 'start',
        show: this.showTaxes
      },
      {
        title: this.$t('product:tvq'),
        value: 'tvq',
        align: 'start',
        show: this.showTaxes
      },
      {
        title: this.$t('product:totalFinal'),
        value: 'costTotal',
        align: 'start',
        show: this.onlyShowCostTotal
      },
      {
        title: this.$t('product:addTPS'),
        value: 'hasTPS',
        align: 'start',
        show: this.showHasTaxes
      },
      {
        title: this.$t('product:addTVQ'),
        value: 'hasTVQ',
        align: 'start',
        show: this.showHasTaxes
      },
      {
        title: this.$t('product:isAdminRelated'),
        value: 'isAdminRelated',
        align: 'start',
        show: this.showIsAdminRelated
      },
      {
        title: this.$t('product:isAvailable'),
        value: 'isAvailable',
        align: 'start',
        show: this.canToggleAvailability
      },
      {
        title: '',
        sortable: false,
        value: 'edit',
        align: 'start',
        show: this.showEditButton
      },
      {
        title: "ID",
        sortable: true,
        value: 'MemberOrder.MemberId',
        align: 'start',
        show: this.showMemberId
      },
      {
        title: this.$t('product:personName'),
        sortable: true,
        value: 'personFullname',
        align: 'start',
        show: this.showPersonName
      }
    ]
    headers = headers.map((header) => {
      if (header.children) {
        header.children = header.children.filter((subheader) => {
          return subheader.show === undefined || subheader.show
        })
      }
      return header;
    }).filter((header) => {
      if (header.children && header.children.length === 0) {
        return false;
      }
      return header.show === undefined || header.show
    }).map((header) => {
      if (header.children && header.children.length === 1) {
        const childHeader = header.children[0];
        header.title = childHeader.titleWhenNoParent;
        header.value = childHeader.value;
        delete header.children;
      }
      return header;
    })
    const tableOptions = {
      sortBy: ['name'],
      sortDesc: [true],
      page: 1
    };
    if (this.canChangeQuantity || this.hasQuantity || this.canChangeExpectedQuantity || this.hasExpectedQuantity) {
      tableOptions.sortBy = [];
    }
    return {
      selected: [],
      searchText: null,
      searchTextConfirmed: null,
      tableOptions: tableOptions,
      headers: headers,
      showEditButton: new Boolean(this.$attrs && this.$attrs.onModify).valueOf(),
      quantityUpdateSnackbar: false,
      quantityUnchangedSnackbar: false,
      costUnitPriceUpdateSnackbar: false,
      searchElementId: "search-" + Math.random(),
      chosenCategory: undefined,
      minHeightStyle: this.preventSearchFlickr ? "min-height: 1000px;" : "",
      categoriesPanel: 'categories',
      nbItemsPerPage: 50
    }
  },
  mounted: function () {
    this.categoriesPanel = this.$vuetify.display.smAndDown ? null : 'categories';
  },
  computed: {
    filteredProducts: function () {
      if (this.chosenCategory === undefined) {
        return this.products;
      }
      return this.products.filter((product) => {
        return this.chosenCategory === product.category;
      });
    },
    categories: function () {
      if (!this.hideCategoriesFilter && this.products !== undefined) {
        const sets = BuildUniquePropertySetsInProducts.build(
            this.products
        );
        return sets.categories.filter((category) => {
          const categoryIsString = typeof category === 'string' || category instanceof String
          if (category === null || category === undefined || !categoryIsString) {
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
    enterDivideDetails: function (item, allMembersQuantity) {
      this.$refs.divideInfoDialog.enter(
          item,
          allMembersQuantity
      );
    },
    enterChangeQuantityFlow: async function (item, isForExpected) {
      this.$refs.quantityChangeDialog.show(item, isForExpected)
    },
    updateQuantity: async function (item) {
      await this.$emit('quantityUpdate', item)
    },
    applySearch: function () {
      this.searchTextConfirmed = this.searchText
    },
    downloadAsCsv: function () {
      OrderToCsv.exportForOnlyItems(this.filteredProducts)
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
    },
    showQuantityChangedSuccess: async function () {
      const timeout = this.quantityUpdateSnackbar ? 500 : 0;
      this.quantityUpdateSnackbar = false;
      await this.$nextTick();
      setTimeout(() => {
        this.quantityUpdateSnackbar = true;
      }, timeout)
    },
    showQuantityUnchangedSnackbar: async function () {
      const timeout = this.quantityUnchangedSnackbar ? 500 : 0;
      this.quantityUnchangedSnackbar = false;
      await this.$nextTick();
      setTimeout(() => {
        this.quantityUnchangedSnackbar = true;
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

.productsTable tbody .v-messages__message {
  font-weight: normal;
  color: black;
  font-size: 17px !important;
  padding-top: 6px;
  padding-bottom: 8px;
}
</style>
