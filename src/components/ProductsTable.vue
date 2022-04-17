<template>

  <v-data-table
      :headers="headers"
      :items="products"
      :options="tableOptions"
      :no-data-text="$t('productTable:noProducts')"
      class="elevation-1 mt-8 productsTable"
      :loading="loading"
      :loading-text="$t('productTable:loadingText')"
      :group-by="groupBy"
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
    <template v-slot:item.price="{ item }">
      {{ item.price | currency }}
    </template>
    <template v-slot:group.header="{ group, headers, toggle, isOpen }">
      <td :colspan="headers.length">
        <v-btn @click="toggle" x-small icon :ref="group">
          <v-icon v-if="isOpen">mdi-minus</v-icon>
          <v-icon v-else>mdi-plus</v-icon>
        </v-btn>
        <span class="mx-5 font-weight-bold">{{ $t('productTable:' + group) }}</span>
      </td>
    </template>
  </v-data-table>
</template>

<script>
import ProductTranslation from "@/ProductTranslation";
import I18n from "@/i18n";

export default {
  name: "ProductsTable",
  props: {
    'products': Array,
    'groupBy': {
      type: Array,
      default: function () {
        return []
      }
    },
    loading: Boolean,
    showSelect: {
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
      noProducts: "Pas de produits"
    });
    I18n.i18next.addResources("en", "productTable", {
      create: "Nouveau",
      updatePrice: "Prix mis à jour",
      nothing: "Rien de changé",
      loadingText: "Liste de produits en chargement",
      noProducts: "Pas de produits"
    });
    return {
      selected: [],
      search: null,
      tableOptions: {
        sortBy: ['name'],
        sortDesc: [true],
        page: 1,
        itemsPerPage: 50
      },
      headers: [
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
        }
      ],
    }
  },
  watch: {
    selected: async function () {
      await this.$emit('selectionChanged', this.selected);
    }
  }
}
</script>

<style>
.productsTable .v-data-footer__select {
  display:none;
}
</style>
