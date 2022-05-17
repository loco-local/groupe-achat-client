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
        ></v-text-field>
      </template>
      <template v-slot:item.orderQuantity="{ item }" v-if="canOrder">
        <v-text-field
            type="number"
            v-model="item.orderQuantity"
            :placeholder="$t('quantity')"
            @keydown="quantityKeydown($event, item)"
            @blur="changeQuantity(item)"
        ></v-text-field>
      </template>
      <template v-slot:item.price="{ item }">
        {{ item.price | currency }}
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
    canOrder: {
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
      quantityUpdated: "Quantité mise à jour"
    });
    I18n.i18next.addResources("en", "productTable", {
      create: "Nouveau",
      updatePrice: "Prix mis à jour",
      nothing: "Rien de changé",
      loadingText: "Liste de produits en chargement",
      noProducts: "Pas de produits",
      quantityUpdated: "Quantité mise à jour"
    });
    const headers = [
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
        text: this.$t('product:price'),
        value: 'price'
      },
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
    ];
    if (this.canOrder) {
      headers.unshift({
        text: "",
        value: 'orderQuantity'
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
    return {
      selected: [],
      search: null,
      tableOptions: {
        sortBy: ['name'],
        sortDesc: [true],
        page: 1,
        itemsPerPage: 50
      },
      headers: headers,
      showEditButton: showEditButton,
      quantityUpdateSnackbar: false
    }
  },
  watch: {
    selected: async function () {
      await this.$emit('selectionChanged', this.selected);
    }
  },
  methods: {
    quantityKeydown: function (event, product) {
      if (event.keyCode === ENTER_KEY_CODE) {
        this.changeQuantity(product);
      }
    },
    changeQuantity: async function (product) {
      const timeout = this.quantityUpdateSnackbar ? 500 : 0;
      this.quantityUpdateSnackbar = false;
      await this.$emit('quantityUpdate', product)
      await this.$nextTick();
      setTimeout(() => {
        this.quantityUpdateSnackbar = true;
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
