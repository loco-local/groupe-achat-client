<template>
  <v-card flat class="pl-8 pr-8" max-width="375" color="transparent"
          :class="{
            'pl-8 pr-8': $vuetify.breakpoint.mdAndUp,
            'pl-8 pr-8': $vuetify.breakpoint.smAndDown
        }">
    <v-card class="text-center" @click="$emit('customAction')" color="transparent">
      <v-row class="vh-center">
        <v-col cols="12" md="8" class="pr-0">
          <v-card-text class="text-subtitle-1 text-left pr-0">
            {{product.name}}
          </v-card-text>
        </v-col>
        <v-col cols="12" md="4" class="pl-0">
          <v-card-text class="text-body-2 text-right pl-0 outlined" >
            <v-badge
                :content="product.qtyInBox + 'x'"
                location="bottom"
                color="black"
                tile
                :value="product.qtyInBox && product.qtyInBox > 1"
            >
              <v-chip color="black" variant="outlined" label>
                {{ product.format }}
                <!--              <v-divider class="ml-2 mr-2" v-if="product.qtyInBox && product.qtyInBox > 1"></v-divider>-->
              </v-chip>
            </v-badge>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </v-card>
</template>

<script>
export default {
  name: "ProductCard",
  props: ['product']
}
</script>

<style scoped>

</style>
