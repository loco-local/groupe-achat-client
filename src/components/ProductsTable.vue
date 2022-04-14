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
  </v-data-table>
</template>

<script>
export default {
  name: "ProductsTable",
  props: ['products'],
  data: function () {
    return {
      tableOptions: {
        sortBy: ['updatedAt'],
        sortDesc: [true]
      },
      headers: [
        {
          text: '#',
          value: 'id'
        },
        {
          text: this.$t('productsTable:date'),
          value: 'createdAt'
        },
        {
          text: this.$t('productsTable:date'),
          value: 'createdAt'
        },
        {
          text: this.$t('productsTable:name'),
          value: 'name'
        },
        {
          text: this.$t('productsTable:description'),
          value: 'description'
        },
        {
          text: this.$t('productsTable:price'),
          value: 'price'
        },
        {
          text: this.$t('productsTable:isAvailable'),
          value: 'isAvailable'
        }
      ],
    }
  }
}
</script>

<style scoped>

</style>
