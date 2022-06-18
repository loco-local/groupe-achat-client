<template>
  <Page>
    <GroupOrderStatus @buyGroupDefined="setBuyGroup"
                      :buyGroupPath="$route.params.buyGroup"
                      class="mt-8"
    ></GroupOrderStatus>
    <v-card flat class="pt-8" color="transparent">
      <!--      <v-card-title class="text-h4">-->
      <!--        {{ $t('products:title') }}-->
      <!--      </v-card-title>-->
      <v-card-text class="font-weight-bold text-left body-1">
        <span class="">{{ $t('total') }} : </span>
        {{ total | currency }}
      </v-card-text>
    </v-card>
    <v-row>
      <v-col v-if="!isLoading && products.length === 0" cols="12" class="text-h6">
        <v-sheet height="400" class="grey--text">
          {{ $t('products:noResults') }}
        </v-sheet>
      </v-col>
      <!--      <v-col v-else cols="12" md="4" class="text-center" v-for="product in products"-->
      <!--             :key="product.id">-->
      <!--        <ProductCard :product="product"></ProductCard>-->
      <!--      </v-col>-->

      <v-col cols="12" class="vh-center" v-if="isLoading">
        <v-progress-circular indeterminate :size="80" :width="2"></v-progress-circular>
      </v-col>
      <ProductsTable
          v-else
          :products="products || []"
          :canToggleAvailability="false"
          :canChangeOrderQuantity="canChangeOrderQuantity"
          :hasOrderQuantity="hasOrderQuantity"
          :showTaxes="true"
          @quantityUpdate="updateOrderQuantity"
      ></ProductsTable>
    </v-row>
    <v-snackbar
        v-model="quantityUpdateSnackbar"
        top
        :timeout="7000"
    >
        <span class="body-1">
          {{ $t('products:quantityUpdated') }}
        </span>
      <template v-slot:action="{ attrs }">
        <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="quantityUpdateSnackbar = false"
        >
          {{ $t('close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </Page>
</template>

<script>
import ProductService from "@/service/ProductService";
import I18n from "@/i18n";
import MemberOrderService from "@/service/MemberOrderService";
import GroupOrder from "@/GroupOrder";
import OrderItem from "@/OrderItem";

export default {
  name: "Products",
  components: {
    Page: () => import('@/components/Page'),
    ProductsTable: () => import('@/components/ProductsTable'),
    GroupOrderStatus: () => import('@/components/GroupOrderStatus')
  },
  data: function () {
    I18n.i18next.addResources("fr", "products", {
      "title": "Produits",
      quantityUpdated: "Quantité mise à jour"
    });
    I18n.i18next.addResources("en", "products", {
      "title": "Produits",
      quantityUpdated: "Quantité mise à jour"
    });
    return {
      products: [],
      orderItems: [],
      userOrderId: null,
      isLoading: false,
      quantityUpdateSnackbar: false,
      canChangeOrderQuantity: false,
      hasOrderQuantity: false
    }
  },
  mounted: async function () {
    this.isLoading = true;
  },
  methods: {
    setBuyGroup: async function (buyGroup) {
      if (buyGroup.relevantOrder) {
        this.hasOrderQuantity = true;
        this.canChangeOrderQuantity = buyGroup.relevantOrder.status === GroupOrder.STATUS.CURRENT;
      }
      const userOrder = await MemberOrderService.get(
          buyGroup.id,
          buyGroup.relevantOrder.id,
          this.$store.state.user.id,
          true
      );
      this.userOrderId = userOrder.id;
      this.orderItems = await MemberOrderService.listForOrderId(userOrder.id);
      this.products = await ProductService.listPutForward(buyGroup.id);
      this.orderItems.forEach((item) => {
        const matchingProduct = this.products.filter((product) => {
          return product.id === item.ProductId;
        });
        if (matchingProduct.length) {
          matchingProduct[0].orderQuantity = item.quantity;
          matchingProduct[0].total = OrderItem.calculateTotal(item)
          matchingProduct[0].tps = OrderItem.calculateTPS(item)
          matchingProduct[0].tvq = OrderItem.calculateTVQ(item)
        }
      });
      this.products = this.products.sort((a, b) => {
        return (b.orderQuantity || 0) - (a.orderQuantity || 0);
      });
      this.isLoading = false;
    },
    updateOrderQuantity: async function (updatedProduct) {
      let orderItem = this.orderItems.filter((orderItem) => {
        return orderItem.ProductId === updatedProduct.id;
      });
      if (!orderItem.length) {
        orderItem = {...updatedProduct};
        orderItem.quantity = 0;
        this.orderItems.push(
            orderItem
        )
      } else {
        orderItem = orderItem[0];
      }
      const previousQuantity = orderItem.quantity;
      orderItem.quantity = updatedProduct.orderQuantity;
      updatedProduct.total = OrderItem.calculateTotal(orderItem);
      updatedProduct.tps = OrderItem.calculateTPS(orderItem);
      updatedProduct.tvq = OrderItem.calculateTVQ(orderItem);
      this.$set(this.products, this.products.indexOf(updatedProduct), updatedProduct);
      if (parseInt(previousQuantity) !== parseInt(updatedProduct.orderQuantity)) {
        await MemberOrderService.setQuantity(
            this.userOrderId,
            updatedProduct.id,
            orderItem.quantity
        )
        const timeout = this.quantityUpdateSnackbar ? 500 : 0;
        this.quantityUpdateSnackbar = false;
        await this.$nextTick();
        setTimeout(() => {
          this.quantityUpdateSnackbar = true;
        }, timeout)
      }
    }
  },
  computed: {
    total: function () {
      return this.orderItems.reduce((total, orderItem) => {
        return OrderItem.calculateTotal(orderItem) + total;
      }, 0)
    }
  }
}
</script>

<style scoped>

</style>
