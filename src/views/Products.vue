<template>
  <Page>
    PRoduits
    {{ products }}
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
      products: []
    }
  },
  mounted: async function () {
    this.products = await ProductService.list();
  }
}
</script>

<style scoped>

</style>
