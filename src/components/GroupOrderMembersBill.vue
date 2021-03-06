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
          <v-btn class="mt-4" @click="downloadAllReceipts">
            <v-icon left>file_download</v-icon>
            {{ $t('downloadAll') }}
          </v-btn>
        </v-col>
        <v-col cols="12" class="vh-center">
          <v-list width="475">
            <div v-for="userOrder in userOrders" :key="userOrder.id">
              <v-list-item>
                <v-list-item-action>
                  <v-btn icon @click="downloadReceipt(userOrder.Member.id)" large>
                    <v-icon large>file_download</v-icon>
                  </v-btn>
                </v-list-item-action>
                <v-list-item-action>
                  <v-btn icon large @click="viewReceipt(userOrder.Member.id)">
                    <v-icon large>preview</v-icon>
                  </v-btn>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title class="text-left ml-6">
                    {{ userOrder.Member.firstname }}
                    {{ userOrder.Member.lastname }}
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
        :buyGroupPath="buyGroupPath"
        ref="userBillDialog"
    ></UserBillDialog>
  </v-card>
</template>

<script>
import I18n from "@/i18n";
import BuyGroupOrderService from "@/service/BuyGroupOrderService";
import UserBillDialog from "@/components/UserBillDialog";
import LoadingFlow from "@/LoadingFlow";
import OrderToCsv from "@/OrderToCsv";

export default {
  name: "GroupOrderMemberBills",
  components: {UserBillDialog},
  props: ['buyGroupId', 'buyGroupOrderId', 'buyGroupPath'],
  data: function () {
    const text = {
      noBills: "Pas encore de commandes"
    };
    I18n.i18next.addResources("fr", "membersBill", text);
    I18n.i18next.addResources("en", "membersBill", text);
    return {
      isLoading: true,
      userOrders: [],
      userBillModal: false
    }
  },
  mounted: async function () {
    this.isLoading = true;
    if (this.$store.state.user.status === 'admin') {
      this.userOrders = await BuyGroupOrderService.listMemberOrders(
          this.buyGroupId,
          this.buyGroupOrderId
      );
    }
    if (this.$route.params.userId) {
      await this.$refs.userBillDialog.enter(this.$route.params.userId);
    }
    this.isLoading = false;
  },
  methods: {
    downloadReceipt: async function (memberId) {
      LoadingFlow.enter();
      const userOrderItems = await BuyGroupOrderService.listOrderItemsOfMember(
          this.buyGroupId,
          this.buyGroupOrderId,
          memberId
      );
      const buyGroupOrder = await BuyGroupOrderService.getById(
          this.buyGroupOrderId,
          this.buyGroupId
      );
      OrderToCsv.exportForMemberOrder(userOrderItems, buyGroupOrder);
      LoadingFlow.leave();
    },
    downloadAllReceipts: async function () {
      LoadingFlow.enter();
      await Promise.all(this.userOrders.map(async (userOrder) => {
        await this.downloadReceipt(userOrder.Member.id);
      }))
      LoadingFlow.leave();
    },
    viewReceipt: function (memberId) {
      LoadingFlow.enter();
      const toPath = this.$router.currentRoute.path + "/" + memberId;
      if (this.$router.currentRoute.path !== toPath) {
        this.$router.push(
            toPath
        );
      }
      this.$refs.userBillDialog.enter(memberId);
      LoadingFlow.leave();
    }
  }
}
</script>

<style scoped>

</style>

