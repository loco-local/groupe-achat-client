<template>
  <Page>
    <v-card flat>
      <v-card-title>

      </v-card-title>
      <v-card-text>
        {{ userOrders }}
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
