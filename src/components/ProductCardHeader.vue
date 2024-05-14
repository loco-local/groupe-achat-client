<template>
    <v-card-text class="pl-2 pb-0">
      <v-card-title class="d-flex justify-space-between align-center pl-0 ml-0 mb-2">
        <div class="text-medium-emphasis ps-2"
             :class="{
                  'text-h6': $vuetify.display.mdAndUp,
                  'text-body-2 font-weight-bold': $vuetify.display.smAndDown
               }"
        >
          {{ product.name }}
        </div>
        <v-icon icon="close" @click="$emit('close')" variant="text"></v-icon>
      </v-card-title>
      <v-row class="small text-medium-emphasis pl-5">
        <v-col cols="12" class="pa-0">
          {{ product.format }}
          <v-divider vertical :thickness="2" color="primary" class="ml-1 mr-1"
                     v-if="product.qtyInBox > 1"></v-divider>
          <span v-if="product.qtyInBox > 1">
              <strong>
                {{ product.qtyInBox }}x
              </strong>
              {{ $t('quantity:inBox') }}
            </span>
        </v-col>
        <v-col cols="12" class="pl-0 pr-0 pb-0">
          {{ product.maker }}
        </v-col>
        <v-col cols="12" class="pl-0 pr-0 pb-0">
              <span v-if="isForExpected">
                {{ $t('product:expectedCostUnitPrice') }}:
                {{ $filters.currency(product.expectedUnitPriceAfterRebate) }}
              </span>
          <span v-else>
                {{ $t('product:costUnitPrice') }}:
                {{ $filters.currency(product.unitPriceAfterRebate) }}
              </span>
        </v-col>
        <v-col cols="12" class="pl-0 pr-0 pb-0">
          {{ $filters.currency(product.pricePerUnit) }}
          {{ $t('quantity:per') }}
          {{ product.formatUnit.toUpperCase()}}
        </v-col>
      </v-row>
      <v-divider class="mt-6"></v-divider>
    </v-card-text>
</template>


<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: "ProductCardHeader",
  props:['product', 'isForExpected']
})
</script>


<style scoped>

</style>