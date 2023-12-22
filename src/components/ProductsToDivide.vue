<template>
  <v-card>
    <v-card-text v-if="isLoading">
      <v-progress-circular indeterminate :size="80" :width="2"></v-progress-circular>
    </v-card-text>
    <v-card-text v-if="!isLoading && !Object.keys(productsToDivide).length">
      {{ $t('divide:nothingToDivide') }}
    </v-card-text>
    <v-card-text v-if="!isLoading && Object.keys(productsToDivide).length">
      <v-switch
          v-model="showOnlyProductsWithRemainingQuantities"
          :label="$t('divide:showOnlyProductsWithRemainingQuantities')"
      ></v-switch>
      <v-text-field :placeholder="$t('divide:searchPlaceholder')" v-model="search" prepend-icon="search"></v-text-field>
      <v-card v-for="productId in productsIdToDivideFiltered" :key="productId" class="mb-6 mt-6 text-left">
        <v-card-title class="text-h6">
          {{ productsToDivide[productId][0].description }}
          <strong v-if="productsToDivide[productId][0].qtyInBox > 1" class="ml-2 mr-2">
            {{ productsToDivide[productId][0].qtyInBox }}x
          </strong>
          {{ productsToDivide[productId][0].format }}
        </v-card-title>
        <v-chip outlined class="mr-4 mb-4 text-h6 font-weight-regular text-left ml-4" label
                color="red"
                v-if="remainingQuantities[productId].remainingFraction > 0"
        >
          {{ $t('divide:remaining') }}
          {{ remainingQuantities[productId].remainingFraction }}
          {{ remainingQuantities[productId].format }}
          {{ $t('divide:toDivide') }}
        </v-chip>
        <v-divider class="mb-6"></v-divider>
        <v-card-text class="body-1 text-left">
          <ProductsTable
              :products="productsToDivide[productId]"
              :hide-search="true"
              :preventSearchFlickr="false"
              :show-person-name="true"
              :canChangeQuantity="true"
              :can-toggle-availability="false"
              :has-quantity="true"
              :hideExpectedUnitPrice="true"
              :showMemberId="true"
              @quantityUpdate="updateOrderQuantity"
          >
            <div slot="footer" class="d-inline-block">
              <v-select
                  :items="members"
                  item-text="fullnameAndId"
                  item-value="memberId"
                  :label="$t('divide:addMember')"
                  return-object
                  class="ml-2 mb-2"
                  @change="addMemberToProduct($event, productsToDivide[productId], productId)"
              ></v-select>
            </div>
          </ProductsTable>
        </v-card-text>
      </v-card>
    </v-card-text>
    <v-snackbar
        v-model="memberAlreadyHasProductSnackbar"
        top
        :timeout="12000"
    >
        <span class="body-1">
          {{ $t('divide:memberAlreadyHasProduct') }}
        </span>
      <template v-slot:action="{ attrs }">
        <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="memberAlreadyHasProductSnackbar = false"
        >
          {{ $t('close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
import I18n from "@/i18n";
import BuyGroupOrderService from "@/service/BuyGroupOrderService";
import OrderItem from "@/OrderItem";
import latinize from "latinize";
import Search from "@/Search";
import MemberOrdersQuantity from "@/MemberOrdersQuantity";
import ProductsTable from "@/components/ProductsTable.vue";
import MemberOrderService from "@/service/MemberOrderService";
import Member from "@/Member";

export default {
  name: "ProductsToDivide",
  components: {ProductsTable},
  props: ['buyGroupId', 'buyGroupOrderId'],
  data: function () {
    const text = {
      nothingToDivide: "Aucun produit à diviser",
      member: "Membre",
      quantity: "Quantité",
      searchPlaceholder: "Produit ou membre",
      remaining: "Il reste",
      toDivide: "à partager",
      addMember: "Membre à ajouter",
      memberAlreadyHasProduct: "Ce membre ne peut être ajouté, il a déjà ce produit",
      showOnlyProductsWithRemainingQuantities: "Afficher seulement les produits qui ont des quantités restantes à diviser"
    };
    I18n.i18next.addResources("fr", "divide", text);
    I18n.i18next.addResources("en", "divide", text);
    return {
      isLoading: true,
      productsToDivide: {},
      remainingQuantities: {},
      search: "",
      members: [],
      memberAlreadyHasProductSnackbar: false
    }
  },
  mounted: async function () {
    this.orderItems = await BuyGroupOrderService.listMemberOrderItems(
        this.buyGroupId,
        this.buyGroupOrderId
    );
    const membersMap = {};
    this.orderItems.forEach((orderItem) => {
      const memberOrder = orderItem.MemberOrder;
      membersMap[orderItem.MemberOrder.MemberId] = {
        memberId: memberOrder.MemberId,
        memberOrderId: memberOrder.id,
        fullname: orderItem.personFullname,
        fullnameAndId: orderItem.personFullname + ", id:" + memberOrder.MemberId,
        firstname: memberOrder.Member.firstname,
        lastname: memberOrder.Member.lastname,
      }
    })
    this.members = Member.sortAlphabetically(Object.values(membersMap));
    this.productsToDivide = this.orderItems.reduce((productsToDivide, orderItem) => {
      const quantity = OrderItem.getQty(orderItem);
      if (quantity % 1 === 0) {
        return productsToDivide;
      }
      if (productsToDivide[orderItem.ProductId] === undefined) {
        productsToDivide[orderItem.ProductId] = [];
      }
      productsToDivide[orderItem.ProductId].push(orderItem);
      return productsToDivide;
    }, {})
    this.memberOrdersQuantities = new MemberOrdersQuantity(
        this.orderItems
    );
    this.remainingQuantities = this.memberOrdersQuantities.buildQuantities();
    this.isLoading = false;
  },
  computed: {
    showOnlyProductsWithRemainingQuantities: {
      get: function () {
        return this.$store.state.showOnlyProductsWithRemainingQuantities
      },
      set: async function (value) {
        return this.$store.dispatch('setShowOnlyProductsWithRemainingQuantities', value)
      }
    },
    productsIdToDivideFiltered: function () {
      return Object.keys(this.productsToDivide).filter((productId) => {
        let items = this.productsToDivide[productId];
        const filteredItems = items.filter((item) => {
          if (this.search.trim() === "") {
            return true;
          }
          return Search.matchesAnyValues([
            item.description,
            item.MemberOrder.Member.firstname,
            item.MemberOrder.Member.lastname,
            item.format
          ], this.search);
        });
        return filteredItems.length &&
            (!this.showOnlyProductsWithRemainingQuantities || this.remainingQuantities[productId].remainingFraction > 0);
      }).sort((a, b) => {
        return a.description.localeCompare(b.description);
      })
    }
  },
  methods: {
    addMemberToProduct: async function (memberInfo, itemsInProduct, productId) {
      const memberAlreadyHasItem = itemsInProduct.some((item) => {
        return item.MemberOrder.MemberId === memberInfo.memberId
      });
      this.memberAlreadyHasProductSnackbar = false;
      await this.$nextTick();
      if (memberAlreadyHasItem) {
        this.memberAlreadyHasProductSnackbar = true;
        return;
      }
      const orderItem = {
        MemberOrder: {},
        ProductId: productId,
        format: itemsInProduct[0].format,
        name: itemsInProduct[0].name,
        expectedUnitPrice: itemsInProduct[0].expectedUnitPrice,
        category: itemsInProduct[0].category,
        internalCode: itemsInProduct[0].internalCode,
        maker: itemsInProduct[0].maker,
        provider: itemsInProduct[0].provider,
        qtyInBox: itemsInProduct[0].qtyInBox
      };
      orderItem.MemberOrder.MemberId = memberInfo.memberId;
      orderItem.MemberOrder.Member = {
        id: memberInfo.memberId,
        firstname: memberInfo.firstname,
        lastname: memberInfo.lastname
      }
      orderItem.personFullname = memberInfo.fullname
      orderItem.MemberOrder.id = memberInfo.memberOrderId;
      orderItem.MemberOrderId = memberInfo.memberOrderId
      orderItem.id = Math.random();
      orderItem.quantity = 0;
      orderItem.quantityInput = 0;
      orderItem.previousQuantityInput = 0;
      orderItem.totalAfterRebateWithTaxes = 0;
      OrderItem.defineQuantitiesFraction(orderItem);
      itemsInProduct.push(orderItem)
    },
    updateOrderQuantity: async function (updatedItem) {
      const prices = await MemberOrderService.setQuantity(
          updatedItem.MemberOrderId,
          updatedItem.ProductId,
          updatedItem.quantity
      )
      updatedItem.totalAfterRebateWithTaxes = prices.totalAfterRebateWithTaxes;
      updatedItem.quantity = prices.quantity;
      updatedItem.tps = prices.tps;
      updatedItem.tvq = prices.tvq;
      updatedItem.id = prices.id;
      this.$set(this.orderItems, this.orderItems.indexOf(updatedItem), updatedItem);
      this.memberOrdersQuantities.updateMemberOrder(updatedItem);
      this.remainingQuantities = this.memberOrdersQuantities.buildQuantities();
    },
    searchMatch: function (value, search) {
      return value != null &&
          search != null &&
          typeof value === 'string' &&
          latinize(value.toString().toLowerCase()).indexOf(latinize(search.toLowerCase())) !== -1
    }
  }
}
</script>

<style scoped>

</style>
