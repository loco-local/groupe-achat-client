<template>
  <Page>
    <v-card flat class="pt-8" color="transparent">
      <v-card-title class="text-h4">
        {{ $t('products:produits') }}
      </v-card-title>
      <v-card-actions>
        <v-btn >importer</v-btn>
      </v-card-actions>
    </v-card>
    <v-data-table
        :headers="headers"
        :items="products"
        disable-pagination
        :options="tableOptions"
        :no-data-text="$t('products:noProducts')"
        hide-default-footer
        class="elevation-1 mt-8"
    >
    </v-data-table>
  </Page>
</template>

<script>
import ProductService from "@/service/ProductService";

export default {
  name: "Products",
  components: {
    Page: () => import('@/components/Page')
  },
  data: function () {
    return {
      products: [],
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
          text: this.$t('statements:date'),
          value: 'createdAt'
        },
        {
          text: this.$t('products:date'),
          value: 'createdAt'
        },
        {
          text: this.$t('products:name'),
          value: 'name'
        },
        {
          text: this.$t('products:description'),
          value: 'description'
        },
        {
          text: this.$t('products:price'),
          value: 'price'
        },
        {
          text: this.$t('products:isAvailable'),
          value: 'isAvailable'
        }
      ],
    }
  },
  mounted: async function () {
    this.products = await ProductService.list();
  }
}
</script>

<style scoped>

</style>
