<template>
  <v-dialog v-model="dialog" width="600">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="text-medium-emphasis ps-2"
             :class="{
                  'text-h6': $vuetify.display.mdAndUp,
                  'text-body-2 font-weight-bold': $vuetify.display.smAndDown
               }"
        >
          {{ itemName }}
        </div>
      </v-card-title>
      <v-card-text>
        <v-skeleton-loader v-if="isLoading" type="list-item-two-line"></v-skeleton-loader>
        <v-list v-if="!isLoading">
          <div v-for="orderItem in allMembersQuantity.orderItems" :key="orderItem.id">
            <v-list-item>
              <v-list-item-title>
                {{ orderItem.member.fullname }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ orderItem.quantityInFraction }}
                <span class="text-uppercase">
                  {{orderItem.formatUnit}}
                </span>
              </v-list-item-subtitle>
            </v-list-item>
            <v-divider class="mt-2"></v-divider>
          </div>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary">
<!--               @click="confirmQuantityChange"-->
<!--               :loading="confirmQuantityLoading"-->
          {{ $t('confirm') }}
<!--          {{ newQuantities.inFormatQuantity }}-->
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="dialog = false">
          {{ $t('close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {defineComponent} from 'vue'
import MemberService from "../service/MemberService";
import QuantityInterpreter from "../QuantityInterpreter";

export default defineComponent({
  name: "DivideInfoDialog",
  data: function () {
    return {
      itemName: "",
      allMembersQuantity: [],
      dialog: false,
      isLoading: false,
    }
  },
  methods: {
    enter: async function (itemName, allMembersQuantity) {
      this.dialog = true
      this.itemName = itemName;
      this.allMembersQuantity = allMembersQuantity;
      this.isLoading = true;
      await Promise.all(allMembersQuantity.orderItems.map(async (orderItem) => {
        orderItem.quantityInFraction = QuantityInterpreter.convertDecimalToFraction(
            orderItem.quantity, orderItem.item
        )
        orderItem.formatUnit = QuantityInterpreter.getFormat(orderItem.item.format)
        if (orderItem.member !== undefined) {
          return;
        }
        orderItem.member = await MemberService.getPublicForId(orderItem.item.MemberOrder.MemberId)
        return orderItem;
      }))
      this.isLoading = false;
    }
  }
})
</script>

<style scoped>

</style>