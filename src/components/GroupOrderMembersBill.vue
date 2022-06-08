<template>
  <v-card>
    <v-card-text v-if="isLoading">
      <v-progress-circular indeterminate></v-progress-circular>
    </v-card-text>
    <v-card-text v-if="!isLoading && !userOrders.length">
      {{ $t('membersBill:noBills') }}
    </v-card-text>
    <v-card-text v-if="!isLoading && userOrders.length" class="vh-center">
      <v-row>
        <v-col cols="12">
          <v-btn class="mt-4">
            <v-icon left>file_download</v-icon>
            {{ $t('membersBill:downloadAll') }}
          </v-btn>
        </v-col>
        <v-col cols="12" class="vh-center">
          <v-list width="375">
            <div v-for="userOrder in userOrders" :key="userOrder.id">
              <v-list-item>
                <v-list-item-action>
                  <v-icon @click="downloadReceipt">file_download</v-icon>
                </v-list-item-action>
                <v-list-item-action>
                  <v-icon @click="viewReceipt">receipt</v-icon>
                </v-list-item-action>
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
              <v-divider></v-divider>
            </div>
          </v-list>
        </v-col>
      </v-row>
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
      noBills: "Pas encore de commandes",
      downloadAll: "Tout télécharger"
    });
    I18n.i18next.addResources("en", "membersBill", {
      noBills: "Pas encore de commandes",
      downloadAll: "Tout télécharger"
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
  },
  methods: {
    downloadReceipt: function () {

    },
    viewReceipt: function () {

    }
  }
}
</script>

<style scoped>

</style>
