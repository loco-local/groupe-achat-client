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
        <v-row class="small text-medium-emphasis ps-2">
          <v-col cols="12" class="pa-0">
            {{ itemFormat }}
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-text>
        <v-skeleton-loader v-if="isLoading" type="list-item-two-line"></v-skeleton-loader>
        <v-list v-if="!isLoading">
          <div v-for="(orderItem, index) in allMembersQuantity.orderItems" :key="orderItem.id">
            <v-list-item>
              <v-list-item-title>
                {{ orderItem.member.fullname }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ orderItem.quantityInFraction }}
                <span class="text-uppercase">
                  {{ orderItem.formatUnit }}
                </span>
              </v-list-item-subtitle>
            </v-list-item>
            <v-divider class="mt-2 mb-2" v-if="index < allMembersQuantity.orderItems.length - 1"></v-divider>
          </div>
        </v-list>
      </v-card-text>
      <v-card-text class="text-center text-grey pt-0 pb-0 text-h6">
        {{ $t('productTable:remainingQty') }}
        {{ allMembersQuantity.remainingFraction }}
        {{ allMembersQuantity.format }}
        {{ $t('divide:toShare') }}
      </v-card-text>
      <v-card-actions>
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
import I18n from "@/i18n";

export default defineComponent({
  name: "DivideInfoDialog",
  data: function () {
    const text = {
      toShare: "à partager"
    }
    I18n.i18next.addResources("fr", "divide", text);
    I18n.i18next.addResources("en", "divide", text);
    return {
      itemName: "",
      itemFormat: "",
      allMembersQuantity: [],
      dialog: false,
      isLoading: false,
    }
  },
  methods: {
    enter: async function (itemName, allMembersQuantity, itemFormat) {
      this.dialog = true
      this.itemName = itemName;
      this.itemFormat = itemFormat;
      this.allMembersQuantity = allMembersQuantity;
      this.isLoading = true;
      await Promise.all(this.allMembersQuantity.orderItems.map(async (orderItem) => {
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
      this.allMembersQuantity.orderItems = this.allMembersQuantity.orderItems.sort((a, b) => {
        return a.member.fullname.localeCompare(b.member.fullname);
      })
      this.isLoading = false;
    }
  }
})
</script>

<style scoped>

</style>