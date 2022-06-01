<template>
  <Page>
    <v-card flat>
      <v-card-title>
      </v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="userOrder in userOrders" :key="userOrder.id" class="vh-center">
            <v-list-item-content>
              <v-list-item-title class="vh-center">
                {{ userOrder.User.firstname }}
                {{ userOrder.User.lastname }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ userOrder.totalPrice |currency }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </Page>
</template>

<script>
import BuyGroupOrderService from "@/service/BuyGroupOrderService";

export default {
  name: "GroupOrder",
  components: {
    Page: () => import('@/components/Page'),
  },
  data: function () {
    return {
      userOrders: []
    }
  },
  mounted: async function () {
    const buyGroupId = parseInt(this.$route.params.buyGroupId);
    const buyGroupOrderId = parseInt(this.$route.params.orderId);
    this.userOrders = await BuyGroupOrderService.listUserOrders(buyGroupId, buyGroupOrderId);
  }
}
</script>

<style scoped>

</style>
