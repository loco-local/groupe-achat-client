<template>
  <v-card>
    <v-card-text v-if="isLoading">
      <v-progress-circular indeterminate></v-progress-circular>
    </v-card-text>
    <v-card-text v-if="!isLoading && !userOrders.length">
      {{ $t('membersBill:noBills') }}
    </v-card-text>
    <v-card-text v-if="!isLoading && userOrders.length">
      <v-list>
        <v-list-item v-for="userOrder in userOrders" :key="userOrder.id">
          <v-list-item-content>
            <v-list-item-title>
              {{ userOrder.User.firstname }}
              {{ userOrder.User.lastname }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ userOrder.totalPrice | currency }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import I18n from "@/i18n";
import BuyGroupOrderService from "@/service/BuyGroupOrderService";

export default {
  name: "GroupOrderMemberBills",
  props: ['buyGroupId', 'buyGroupOrderId'],
  data: function () {
    I18n.i18next.addResources("fr", "membersBill", {
      noBills: "Pas encore de commandes"
    });
    I18n.i18next.addResources("en", "membersBill", {
      noBills: "Pas encore de commandes"
    });
    return {
      isLoading: true,
      userOrders: []
    }
  },
  mounted: async function () {
    this.isLoading = true;
    this.userOrders = await BuyGroupOrderService.listUserOrders(
        this.buyGroupId,
        this.buyGroupOrderId
    );
    this.isLoading = false;
  }
}
</script>

<style scoped>

</style>
