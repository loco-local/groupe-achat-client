<template>
  <v-data-table
      :headers="headers"
      :items="products"
      disable-pagination
      :options="tableOptions"
      :no-data-text="$t('productsTable:noProducts')"
      hide-default-footer
      class="elevation-1 mt-8"
  >
    <template v-slot:item.price="{ item }">
      {{ item.price | currency }}
    </template>
  </v-data-table>
</template>

<script>
import ProductTranslation from "@/ProductTranslation";

export default {
  name: "ProductsTable",
  props: ['products'],
  data: function () {
    ProductTranslation.setup();
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
