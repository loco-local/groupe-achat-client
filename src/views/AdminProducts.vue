<template>
  <Page>
    <v-card flat class="pt-8" color="transparent">
      <v-card-title class="text-h4">
        {{ $t('productsAdmin:title') }}
      </v-card-title>
    </v-card>
    <v-tabs v-model="tab" grow>
      <v-tab key="putForward" @click="$router.push('/produits/admin')">
        {{ $t('productsAdmin:putForward') }}
      </v-tab>
      <v-tab key="deprecated" @click="$router.push('/produits/admin/deprecated')">
        {{ $t('productsAdmin:deprecate') }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item
          key="putForward"
      >
        <ProductsTable :products="productsPutForward || []" :loading="isLoading"></ProductsTable>
      </v-tab-item>
      <v-tab-item
          key="deprecated"
      >
        <ProductsTable :products="productsDeprecated || []" :loading="isLoading"></ProductsTable>
      </v-tab-item>
    </v-tabs-items>
  </Page>
</template>

<script>
import ProductService from "@/service/ProductService";
import I18n from "@/i18n";

export default {
  name: "Products",
  components: {
    Page: () => import('@/components/Page'),
    ProductsTable: () => import('@/components/ProductsTable'),
  },
  data: function () {
    I18n.i18next.addResources("fr", "productsAdmin", {
      "title": "Produits",
      "import": "Importer Produits",
      putForward: "Valorisé",
      deprecate: "Dévalorisé"
    });
    I18n.i18next.addResources("en", "productsAdmin", {
      "title": "Produits",
      "import": "Importer Produits",
      putForward: "Valorisé",
      deprecate: "Dévalorisé"
    });
    return {
      productsPutForward: null,
      productsDeprecated: null,
      isLoading: false,
      tab: null
    }
  },
  mounted: async function () {
    if (this.$router.currentRoute.name === 'AdminProductsDeprecated') {
      this.tab = 1;
    }
  },
  watch: {
    tab: async function () {
      this.isLoading = true;
      if (this.tab === 0) {
        if (this.productsPutForward === null) {
          this.productsPutForward = await ProductService.listPutForward();
        }
      } else {
        if (this.productsDeprecated === null) {
          this.productsDeprecated = await ProductService.listDeprecated();
        }
      }
      this.isLoading = false;
    }
  }
}
</script>

<style scoped>

</style>
