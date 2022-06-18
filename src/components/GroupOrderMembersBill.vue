<template>
  <v-card>
    <v-card-text v-if="isLoading">
      <v-progress-circular indeterminate :size="80" :width="2"></v-progress-circular>
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
          <v-list width="475">
            <div v-for="userOrder in userOrders" :key="userOrder.id">
              <v-list-item>
                <v-list-item-action>
                  <v-btn icon @click="downloadReceipt" large>
                    <v-icon large>file_download</v-icon>
                  </v-btn>
                </v-list-item-action>
                <v-list-item-action>
                  <v-btn icon large @click="viewReceipt(userOrder.User.id)">
                    <v-icon large>preview</v-icon>
                  </v-btn>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title class="text-left ml-6">
                    {{ userOrder.User.firstname }}
                    {{ userOrder.User.lastname }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-left ml-6">
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
    <UserBillDialog
        :buyGroupId="buyGroupId"
        :buyGroupOrderId="buyGroupOrderId"
        ref="userBillDialog"
    ></UserBillDialog>
  </v-card>
</template>

<script>
import I18n from "@/i18n";
import BuyGroupOrderService from "@/service/BuyGroupOrderService";
import UserBillDialog from "@/components/UserBillDialog";

export default {
  name: "GroupOrderMemberBills",
  components: {UserBillDialog},
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
      userOrders: [],
      userBillModal: false
    }
  },
  mounted: async function () {
    this.isLoading = true;
    this.userOrders = await BuyGroupOrderService.listMemberOrders(
        this.buyGroupId,
        this.buyGroupOrderId
    );
    this.isLoading = false;
  },
  methods: {
    downloadReceipt: function () {

    },
    viewReceipt: function (userId) {
      const toPath = this.$router.currentRoute.path + "/" + userId;
      if (this.$router.currentRoute.path !== toPath) {
        this.$router.push(
            toPath
        );
      }
      this.$refs.userBillDialog.enter(userId);
    }
  }
}
</script>

<style scoped>

</style>
