<template>
  <Page>
    <GroupOrderStatus @buyGroupDefined="setBuyGroup"
                      :buyGroupPath="$route.params.buyGroup"
                      class="mt-8"
                      v-if="!isMemberLoading"
    ></GroupOrderStatus>
    <v-row>
      <v-col v-if="!isLoading && products.length === 0" cols="12" class="text-h6">
        <v-sheet class="grey--text mb-4">
          {{ $t('products:noResults') }}
        </v-sheet>
      </v-col>
      <!--      <v-col v-else cols="12" md="4" class="text-center" v-for="product in products"-->
      <!--             :key="product.id">-->
      <!--        <ProductCard :product="product"></ProductCard>-->
      <!--      </v-col>-->

      <v-row v-if="member !== null" class="vh-center mt-6">
        <v-col cols="12" xl="4">
          <v-card>
            <v-card-title class="text-center vh-center">
              <span class="ml-2">
                {{ member.firstname }}
                {{ member.lastname }}
              </span>
            </v-card-title>
            <div v-if="member.rebates && member.rebates.percentage && member.rebates.percentage.number">
              <v-divider></v-divider>
              <v-card-text class="vh-center text-h6 font-weight-regular">
                {{ $t('product:rebateOf') }}
                <strong class="ml-2 mr-2">
                  {{ member.rebates.percentage.number }}%
                </strong>
                {{ $t('product:rebateOnAllProducts') }}
              </v-card-text>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-col cols="12">
        <v-alert
            text
            dense
            color="teal"
            icon="mdi-clock-fast"
            border="left"
            class="mt-8 body-1"
        >
          {{ $t('products:info1') }}
          <br>
          {{ $t('products:info2') }}
        </v-alert>
      </v-col>
      <v-col cols="12">
        <v-card flat class="" color="transparent">
          <!--      <v-card-title class="text-h4">-->
          <!--        {{ $t('products:title') }}-->
          <!--      </v-card-title>-->
          <v-card-text class="font-weight-bold text-left body-1">
            <span class="">{{ $t('total') }} : </span>
            {{ total | currency }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" class="vh-center" v-if="isLoading">
        <v-progress-circular indeterminate :size="80" :width="2"></v-progress-circular>
      </v-col>
      <ProductsTable
          v-else
          :products="products || []"
          :canToggleAvailability="false"
          :canChangeExpectedQuantity="canChangeExpectedQuantity"
          :hasExpectedQuantity="hasExpectedQuantity"
          :hasQuantity="isAdminModificationFlow"
          :canChangeQuantity="isAdminModificationFlow"
          :showExpectedCostUnitPrice="!isAdminModificationFlow"
          :showTaxes="true"
          :hideExpectedUnitPrice="isAdminModificationFlow"
          :showExpectedUnitPriceAfterRebate="!isAdminModificationFlow"
          :showCostUnitPrice="isAdminModificationFlow"
          :showUnitPrice="isAdminModificationFlow"
          :showAllMembersQuantity="showAllMembersQuantity"
          @quantityUpdate="updateOrderQuantity"
          ref="productsTable"
      ></ProductsTable>
    </v-row>
  </Page>
</template>

<script>
import ProductService from "@/service/ProductService";
import I18n from "@/i18n";
import MemberOrderService from "@/service/MemberOrderService";
import GroupOrder from "@/GroupOrder";
import OrderItem from "@/OrderItem";
import MemberService from "@/service/MemberService";
import Member from "@/Member";
import BuyGroupOrderService from "@/service/BuyGroupOrderService";
import MemberOrdersQuantity from "@/MemberOrdersQuantity";

export default {
  name: "Products",
  components: {
    Page: () => import('@/components/Page'),
    ProductsTable: () => import('@/components/ProductsTable'),
    GroupOrderStatus: () => import('@/components/GroupOrderStatus')
  },
  data: function () {
    const text = {
      "title": "Produits",
      info1: "Il n'y a pas de bouton de confirmation pour votre panier de commande.",
      info2: "À la date de fin de la commande, les dernières quantités que vous aurez inscrites seront commandées aux fournisseurs.",
      noResults: "Pas de produits disponibles"
    };
    I18n.i18next.addResources("fr", "products", text);
    I18n.i18next.addResources("en", "products", text);
    return {
      member: null,
      memberId: null,
      products: [],
      orderItems: [],
      userOrderId: null,
      isLoading: false,
      isMemberLoading: true,
      canChangeExpectedQuantity: false,
      hasExpectedQuantity: false,
      isAdminModificationFlow: false,
      showAllMembersQuantity: true
    }
  },
  mounted: async function () {
    this.isLoading = true;
    this.isMemberLoading = true;
    this.isAdminModificationFlow = this.$router.currentRoute.name === 'ProductsOrderOfMember';
    if (this.isAdminModificationFlow) {
      this.memberId = this.$route.params.memberId;
    } else if (this.$store.state.user !== null) {
      this.memberId = this.$store.state.user.id;
    }
    if (this.memberId !== null) {
      this.member = await MemberService.getForId(this.memberId);
    }
    this.isMemberLoading = false;
  },
  methods: {
    setBuyGroup: async function (buyGroup) {
      const hasCurrentOrder = buyGroup.relevantOrder !== undefined && buyGroup.relevantOrder !== null && GroupOrder.isCurrent(buyGroup.relevantOrder);
      if (hasCurrentOrder) {
        this.hasExpectedQuantity = !this.isAdminModificationFlow;
        this.canChangeExpectedQuantity = Member.isApproved(this.$store.state.user) && buyGroup.relevantOrder.status === GroupOrder.STATUS.CURRENT && !this.isAdminModificationFlow;
        const userOrder = await MemberOrderService.get(
            buyGroup.id,
            buyGroup.relevantOrder.id,
            this.memberId,
            true
        );
        this.userOrderId = userOrder.id;
        this.orderItems = await MemberOrderService.listForOrderId(userOrder.id);
      }
      this.showAllMembersQuantity = hasCurrentOrder && this.$store.state.user !== null;
      const salePercentage = buyGroup.relevantOrder ? buyGroup.relevantOrder.salePercentage : buyGroup.salePercentage;
      let rebates = this.member === null ? {} : this.member.rebates;
      this.products = await ProductService.listPutForward(
          buyGroup.id,
          salePercentage,
          rebates
      );
      this.products = this.products.filter((product) => {
        return !(product.isAdminRelated && !this.isAdminModificationFlow);
      });
      let allMembersQuantities = {};
      if (hasCurrentOrder) {
        const allMemberOrders = Member.isApproved(this.$store.state.user) ? await BuyGroupOrderService.listMemberOrdersItemsQuantities(
            buyGroup.id,
            buyGroup.relevantOrder.id
        ) : {};
        this.memberOrdersQuantities = new MemberOrdersQuantity(
            allMemberOrders
        );
        allMembersQuantities = this.memberOrdersQuantities.buildQuantities(allMemberOrders);
      }
      this.orderItems.forEach((item) => {
        const matchingProduct = this.products.filter((product) => {
          return product.id === item.ProductId;
        });
        if (matchingProduct.length) {
          matchingProduct[0].expectedQuantity = item.expectedQuantity;
          matchingProduct[0].quantity = item.quantity || item.expectedQuantity;

          matchingProduct[0].previousExpectedQuantity = item.expectedQuantity;
          matchingProduct[0].previousQuantity = item.quantity;

          matchingProduct[0].unitPrice = item.unitPrice || item.expectedUnitPrice;

          matchingProduct[0].expectedTotalAfterRebateWithTaxes = OrderItem.calculateTotal(
              item,
              item.expectedQuantity,
              item.expectedUnitPrice
          );

          matchingProduct[0].costUnitPrice = item.costUnitPrice || item.expectedCostUnitPrice;

          matchingProduct[0].totalAfterRebateWithTaxes = item.totalAfterRebateWithTaxes || item.expectedTotalAfterRebateWithTaxes

          matchingProduct[0].tps = OrderItem.calculateTPS(
              item,
              this.isAdminModificationFlow ? item.quantity : item.expectedQuantity,
              this.isAdminModificationFlow ? item.unitPrice : item.expectedUnitPrice
          )
          matchingProduct[0].tvq = OrderItem.calculateTVQ(
              item,
              this.isAdminModificationFlow ? item.quantity : item.expectedQuantity,
              this.isAdminModificationFlow ? item.unitPrice : item.expectedUnitPrice
          )
        }
      });
      this.products = this.products.map((product) => {
        if (allMembersQuantities[product.id]) {
          product.allMembersQuantity = allMembersQuantities[product.id]
        }
        return product;
      }).sort((a, b) => {
        if (this.isAdminModificationFlow) {
          if (a.isAdminRelated === b.isAdminRelated) {
            return (b.quantity || 0) - (a.quantity || 0);
          }
          return a.isAdminRelated ? -1 : 1;
        } else {
          return (b.expectedQuantity || 0) - (a.expectedQuantity || 0);
        }
      });
      this.isLoading = false;
    },
    updateOrderQuantity: async function (updatedProduct) {
      let orderItem = this.orderItems.filter((orderItem) => {
        return orderItem.ProductId === updatedProduct.id;
      });
      if (!orderItem.length) {
        orderItem = {...updatedProduct};
        if (this.isAdminModificationFlow) {
          orderItem.quantity = 0;
        } else {
          orderItem.expectedQuantity = 0;
        }
        this.orderItems.push(
            orderItem
        )
      } else {
        orderItem = orderItem[0];
      }
      let updatedQuantity = 0;
      if (this.isAdminModificationFlow) {
        orderItem.quantity = updatedProduct.quantity;
        updatedQuantity = updatedProduct.quantity;
      } else {
        orderItem.expectedQuantity = updatedProduct.expectedQuantity;
        updatedQuantity = updatedProduct.expectedQuantity;
      }
      let prices;
      if (this.isAdminModificationFlow) {
        prices = await MemberOrderService.setQuantity(
            this.userOrderId,
            updatedProduct.id,
            orderItem.quantity
        )
      } else {
        prices = await MemberOrderService.setExpectedQuantity(
            this.userOrderId,
            updatedProduct.id,
            orderItem.expectedQuantity
        )
      }
      if (this.isAdminModificationFlow) {
        updatedProduct.totalAfterRebateWithTaxes = prices.totalAfterRebateWithTaxes;
        updatedProduct.quantity = prices.quantity;
        updatedProduct.costUnitPrice = prices.costUnitPrice;
        updatedProduct.unitPrice = prices.unitPrice;
        updatedProduct.unitPriceAfterRebate = prices.unitPriceAfterRebate;
      } else {
        updatedProduct.expectedTotalAfterRebateWithTaxes = prices.expectedTotalAfterRebateWithTaxes;
        updatedProduct.expectedQuantity = prices.expectedQuantity;
      }
      updatedProduct.tps = prices.tps;
      updatedProduct.tvq = prices.tvq;
      updatedProduct.allMembersQuantity = this.memberOrdersQuantities.updateMemberQuantity(
          this.member.id,
          updatedQuantity,
          updatedProduct.id
      );
      this.$set(this.products, this.products.indexOf(updatedProduct), updatedProduct);
      await this.$refs.productsTable.showQuantityChangedSuccess();
    }
  },
  computed: {
    total: function () {
      return this.orderItems.reduce((total, orderItem) => {
        return OrderItem.calculateTotal(
            orderItem,
            orderItem.expectedQuantity,
            orderItem.expectedUnitPrice
        ) + total;
      }, 0)
    }
  }
}
</script>

<style scoped>

</style>
