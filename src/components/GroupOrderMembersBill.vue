<template>
  <v-card>
    <v-card-text v-if="isLoading">
      <v-progress-circular indeterminate :size="80" :width="2"></v-progress-circular>
    </v-card-text>
    <v-card-title class="vh-center">
      {{ $t('membersBill:totalToBill') }}
    </v-card-title>
    <v-card-subtitle class="vh-center text-h6">
      {{ $filters.currency(totalToBill) }}
    </v-card-subtitle>
    <v-card-text v-if="!isLoading && !userOrders.length">
      {{ $t('membersBill:noBills') }}
    </v-card-text>
    <v-card-text v-if="!isLoading && userOrders.length" class="vh-center">
      <v-row>
        <v-col cols="12">
          <v-btn @click="downloadAllReceipts">
            <v-icon start>file_download</v-icon>
            {{ $t('membersBill:downloadAllBills') }}
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-btn
              v-clipboard="emailsOfParticipants()"
              v-clipboard:success="copyEmailsSuccess"
          >
            <v-icon start>
              content_copy
            </v-icon>
            {{ $t('membersBill:emailOfParticipatingMembers') }}
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-btn @click="downloadBillsTotal">
            <v-icon start>account_balance</v-icon>
            {{ $t('membersBill:downloadBillsTotal') }}
          </v-btn>
        </v-col>
        <v-col cols="12" class="vh-center">
          <v-list width="475">
            <div v-for="userOrder in userOrders" :key="userOrder.id">
              <v-list-item>
                <v-list-item-action>
                  <v-btn icon @click="downloadReceipt(userOrder.Member.id)" size="large">
                    <v-icon size="large">file_download</v-icon>
                  </v-btn>
                </v-list-item-action>
                <v-list-item-action>
                  <v-btn
                      icon
                      size="large"
                      v-clipboard="getBillUrlOfMemberId(userOrder.Member.id)"
                      v-clipboard:success="copyBillLinkSuccess"
                  >
                    <v-icon size="large">content_copy</v-icon>
                  </v-btn>
                </v-list-item-action>
                <v-list-item-action>
                  <v-btn icon size="large" @click="viewReceipt(userOrder.Member.id)">
                    <v-icon size="large">preview</v-icon>
                  </v-btn>
                </v-list-item-action>

                <v-list-item-title class="text-left ml-6">
                  {{ userOrder.Member.firstname }}
                  {{ userOrder.Member.lastname }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-left ml-6">
                    <span v-if="userOrder.total === undefined || userOrder.total === null">
                      {{ $filters.currency(userOrder.expectedTotal) }}
                    </span>
                  <span>
                      {{ $filters.currency(userOrder.total)}}
                    </span>
                </v-list-item-subtitle>

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
    <v-snackbar
        v-model="emailCopySnackbar"
        location="top"
        :timeout="7000"
    >
        <span class="text-body-1">
          {{ $t('membersBill:emailsCopied') }}
        </span>
      <template v-slot:action="{ attrs }">
        <v-btn
            color="white"
            variant="text"
            v-bind="attrs"
            @click="emailCopySnackbar = false"
        >
          {{ $t('close') }}
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
        v-model="billLinkCopySnackbar"
        location="top"
        :timeout="7000"
    >
        <span class="text-body-1">
          {{ $t('membersBill:billLinkCopied') }}
        </span>
      <template v-slot:action="{ attrs }">
        <v-btn
            color="white"
            variant="text"
            v-bind="attrs"
            @click="billLinkCopySnackbar = false"
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
import UserBillDialog from "@/components/UserBillDialog";
import LoadingFlow from "@/LoadingFlow";
import OrderToCsv from "@/OrderToCsv";
import Member from "@/Member";
import BillsTotalCSV from "@/BillsTotalCSV";

export default {
  name: "GroupOrderMemberBills",
  components: {UserBillDialog},
  props: ['buyGroupId', 'buyGroupOrderId', 'buyGroupPath'],
  data: function () {
    const text = {
      noBills: "Pas encore de commandes",
      emailOfParticipatingMembers: "Copier courriels des membres participants",
      emailsCopied: "Les courriels sont copiés dans votre presse papier",
      totalToBill: "Total à facturer",
      downloadAllBills: "Télécharger toutes les factures",
      downloadBillsTotal: "Télécharger le résumé des factures",
      billLinkCopied: "Le lien de la facture a été copié"
    };
    I18n.i18next.addResources("fr", "membersBill", text);
    I18n.i18next.addResources("en", "membersBill", text);
    return {
      isLoading: true,
      userOrders: [],
      userBillModal: false,
      emailCopySnackbar: false,
      billLinkCopySnackbar: false,
      totalToBill: 0
    }
  },
  mounted: async function () {
    this.isLoading = true;
    if (this.$store.state.user.status === 'admin') {
      this.userOrders = await BuyGroupOrderService.listMemberOrders(
          this.buyGroupId,
          this.buyGroupOrderId
      );
      this.userOrders = this.userOrders.sort((a, b) => {
        return Member.alphabeticalSorter(
            a.Member,
            b.Member
        );
      })
      this.totalToBill = this.userOrders.reduce((sum, userOrder) => {
        let orderTotal = userOrder.total;
        if (orderTotal === null || orderTotal === undefined) {
          orderTotal = userOrder.expectedTotal || 0
        }
        return sum + orderTotal
      }, 0)
    }
    if (this.$route.params.userId) {
      await this.$refs.userBillDialog.enter(this.$route.params.userId);
    }
    this.isLoading = false;
  },
  methods: {
    getBillUrlOfMemberId: function (memberId) {
      return new URL(this.$route.path + '/' + memberId, window.location.origin).href;
    },
    copyEmailsSuccess: function () {
      this.emailCopySnackbar = true;
    },
    copyBillLinkSuccess: async function () {
      if (this.billLinkCopySnackbar) {
        this.billLinkCopySnackbar = false;
        await this.$nextTick()
        setTimeout(() => {
          this.billLinkCopySnackbar = true;
        }, 500)
      } else {
        this.billLinkCopySnackbar = true;
      }

    },
    emailsOfParticipants: function () {
      return this.userOrders.map((userOrder) => {
        const member = userOrder.Member;
        return member.firstname + " " + member.lastname + " <" + member.email + ">"
      }).join(", ");
    },
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
    downloadBillsTotal: async function () {
      BillsTotalCSV.doExport(this.userOrders)
    },
    viewReceipt: function (memberId) {
      LoadingFlow.enter();
      const toPath = this.$route.path + "/" + memberId;
      if (this.$route.path !== toPath) {
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

