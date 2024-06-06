<template>
  <div class="pb-8">
    <v-card-text v-if="isLoading" class="pt-8 pb-8 text-center">
      <v-progress-circular indeterminate :size="80" :width="2"></v-progress-circular>
    </v-card-text>
    <v-card-text v-if="!isLoading && !orderItems.length">
      {{ $t('userBill:noItems') }}
    </v-card-text>
    <v-card-text class="pb-0">
      <v-alert
          border="bottom"
          border-color="info"
          type="info"
          elevation="2"
          color="info"
          class="ml-6 mr-6 info-accent-4"
          variant="outlined"
      >
        <p class="text-body-1 text-black">
          {{ $t('userBill:subjectToChange') }}
        </p>
        <p class="text-body-1 text-black">
          {{ $t('userBill:subjectToChange2') }}
        </p>
        <p class="text-body-1 text-black">
          {{ $t('userBill:subjectToChange3') }}
        </p>
      </v-alert>
    </v-card-text>
    <v-card-actions v-if="!print && $store.state.user.status === 'admin'" class="mt-7 ml-6 pb-0">
      <v-row>
        <v-col cols="12">
          <AddProduct :buy-group-id="buyGroupId" :sale-percentage="salePercentage" :rebates="rebates"
                      @quantityUpdate="updateQuantity"></AddProduct>
        </v-col>
      </v-row>
    </v-card-actions>
    <v-card-text v-if="print && memberOrder !== null" class="text-h6">
      {{memberOrder.Member.firstname}}
      {{memberOrder.Member.lastname}}
    </v-card-text>
    <v-card-text v-if="!isLoading && orderItems.length" class="pt-0">
      <ProductsTable
          :products="orderItems || []"
          :hasQuantity="true"
          :hasExpectedQuantity="!print"
          :showUnitPrice="!print"
          :canToggleAvailability="false"
          :show-taxes="true"
          :hideSearch="true"
          :prevent-search-flickr="false"
          :hide-categories-filter="true"
          :hide-category="true"
          @quantityUpdate="updateQuantity"
          ref="userBillItemsTable"
          :totals="quantityUpdater.getTotals()"
          :hideProvider="print"
          :hideExpectedUnitPrice="print"
          :canChangeQuantity="!print && $store.state.user.status === 'admin'"
      ></ProductsTable>
      <v-row v-if="buyGroupOrder.howToPay !== null">
        <v-col cols="12" class="text-left text-body-1 mt-8 pl-8">
          <v-card variant="outlined">
            <v-card-text>
              {{ buyGroupOrder.howToPay }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="buyGroupOrder.comment !== null">
        <v-col cols="12" class="text-left text-body-1 mt-8 pl-8">
          <v-card variant="outlined">
            <v-card-text>
              {{ buyGroupOrder.comment }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script>
import BuyGroupOrderService from "@/service/BuyGroupOrderService";
import I18n from "@/i18n";
import {defineAsyncComponent} from "vue";
import QuantityUpdater from "../QuantityUpdater";
import AddProduct from "./AddProduct.vue";

export default {
  name: "UserBill",
  props: ['buyGroupId', 'buyGroupOrderId', 'buyGroupPath', 'userId', 'print'],
  components: {
    AddProduct,
    ProductsTable: defineAsyncComponent(() => import('@/components/ProductsTable'))
  },
  data: function () {
    const text = {
      noItems: "Rien de commandé",
      billOf: "Facture de",
      download: "Télécharger",
      subjectToChange: "Les prix et les quantités peuvent changer.",
      subjectToChange2: "Un membre du groupe d'achat vous contactera lorsque le montant final sera déterminé et qu'il sera le moment de payer.",
      subjectToChange3: "La manière de payer est indiquée dans le bas de cette page.",
    }
    I18n.i18next.addResources("fr", "userBill", text);
    I18n.i18next.addResources("en", "userBill", text);
    return {
      orderItems: null,
      buyGroupOrder: null,
      isLoading: true,
      quantityUpdater: null,
      salePercentage: null,
      rebates: null,
      memberOrder:null
    }
  },
  mounted: async function () {
    this.isLoading = true;
    this.orderItems = await BuyGroupOrderService.listOrderItemsOfMember(
        this.buyGroupId,
        this.buyGroupOrderId,
        this.userId
    );
    if (this.orderItems.length) {
      this.memberOrder = this.orderItems[0].MemberOrder;
      this.rebates = this.memberOrder.Member.rebates;
      if (this.orderTotal === null || this.orderTotal === undefined) {
        this.orderTotal = this.memberOrder.expectedTotal;
      }
    }
    this.buyGroupOrder = await BuyGroupOrderService.getById(
        this.buyGroupOrderId,
        this.buyGroupId
    );
    this.salePercentage = this.buyGroupOrder.salePercentage
    this.$emit('dataDefined', {
      items: this.orderItems,
      buyGroupOrder: this.buyGroupOrder
    });
    this.quantityUpdater = QuantityUpdater.buildForFinalQuantity(
        this.orderItems
    )
    this.isLoading = false;
  },
  methods: {
    updateQuantity: function (updatedItem) {
      this.quantityUpdater.setProductsTableRef(this.$refs.userBillItemsTable)
      this.quantityUpdater.update(
          updatedItem,
          this.memberOrder.Member.id,
          this.memberOrder.id
      );
    },
  }
}
</script>

<style scoped>

</style>
