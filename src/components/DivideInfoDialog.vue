<template>
  <v-dialog v-model="dialog" width="600">
    <v-card>
      <ProductCardHeader @close="dialog = false" :product="item" :isForExpected="true"></ProductCardHeader>
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
        <v-btn color="primary"
               @click="takeRemaining"
               v-if="remainingToTakeInDecimal > userQuantity"
        >
          {{ $t('divide:take') }} {{ remainingToTakeInFormat }} {{ item.formatUnit }}
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
import I18n from "@/i18n";
import ProductCardHeader from "./ProductCardHeader.vue";

export default defineComponent({
  name: "DivideInfoDialog",
  components: {ProductCardHeader},
  data: function () {
    const text = {
      toShare: "à partager",
      take: "Prendre"
    }
    I18n.i18next.addResources("fr", "divide", text);
    I18n.i18next.addResources("en", "divide", text);
    return {
      item: null,
      allMembersQuantity: [],
      remainingToTakeInDecimal: 0,
      remainingToTakeInFormat: 0,
      userQuantity: 0,
      dialog: false,
      isLoading: false
    }
  },
  methods: {
    takeRemaining: function () {
      this.item.expectedQuantity = this.remainingToTakeInDecimal;
      this.$emit('quantityUpdate', this.item)
      this.dialog = false;
    },
    enter: async function (item, allMembersQuantity) {
      this.dialog = true
      this.item = item
      this.allMembersQuantity = allMembersQuantity;
      this.isLoading = true;
      this.userQuantity = item.expectedQuantity;
      if (this.userQuantity === undefined) {
        this.userQuantity = 0;
      }
      this.remainingToTakeInDecimal = parseFloat(this.userQuantity) + parseFloat(allMembersQuantity.remainingDecimal);
      this.remainingToTakeInFormat = QuantityInterpreter.convertDecimalToFraction(
          this.remainingToTakeInDecimal, item
      );
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
