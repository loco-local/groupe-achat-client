<template>
  <v-data-table
      :headers="headers"
      :items="products"
      disable-pagination
      :options="tableOptions"
      :no-data-text="$t('productTable:noProducts')"
      hide-default-footer
      class="elevation-1 mt-8"
      :loading="loading"
      :loading-text="$t('productTable:loadingText')"
      :group-by="groupBy"
  >
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
    loading: Boolean
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
      tableOptions: {
        sortBy: ['updatedAt'],
        sortDesc: [true]
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
  }
}
</script>

<style scoped>

</style>
