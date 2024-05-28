<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <v-autocomplete
            :label="$t('addItem:addProduct')"
            :items="allProducts"
            :item-props="itemProps"
            @update:modelValue="addItem"
            :custom-filter="searchProduct"
        >
        </v-autocomplete>
      </v-col>
    </v-row>
    <QuantityChangeDialog ref="userBillQuantityChangeDialog" @quantityUpdate="updateQuantity"></QuantityChangeDialog>
  </div>
</template>

<script>
import I18n from "@/i18n";
import ProductService from "../service/ProductService";
import QuantityChangeDialog from "@/components/ChangeQuantityDialog.vue";
import Search from "../Search";

export default {
  name: "AddProduct",
  components: {QuantityChangeDialog},
  props: ['buyGroupId', 'salePercentage', 'rebates'],
  data: function () {
    const text = {
      addProduct: "Ajouter un produit"
    }
    I18n.i18next.addResources("fr", "addItem", text);
    I18n.i18next.addResources("en", "addItem", text);
    return {
      allProducts: []
    }
  },
  mounted: async function () {
    this.allProducts = await ProductService.listPutForward(
        this.buyGroupId,
        this.salePercentage,
        this.rebates
    )
  },
  methods: {
    itemProps(item) {
      return {
        title: item.name,
        subtitle: [item.format, item.maker, item.internalCode].join(' | '),
      }
    },
    addItem: function (item) {
      item.quantity = item.expectedQuantity = 0;
      this.$refs.userBillQuantityChangeDialog.show(item, false)
    },
    updateQuantity: async function (item) {
      await this.$emit('quantityUpdate', item)
    },
    searchProduct: function(productTitle, searchTerm, item){
      return Search.matchesAnyValues([
        productTitle,
        item.props.subtitle
      ], searchTerm);
    }
  }
}
</script>
<style scoped>

</style>