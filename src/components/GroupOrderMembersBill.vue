<template>
  <v-card class="text-center">
    <v-card-text v-if="isLoading">
      <v-progress-circular indeterminate :size="80" :width="2"></v-progress-circular>
    </v-card-text>

    <v-row class="vh-center mt-2 mb-2">
      <v-col cols="4">
        <v-table width="200" class="text-h6" color="primary" density="default">
          <tbody>
          <tr>
            <td class="">{{ $t('membersBill:totalToBill') }}</td>
            <td class="">{{ $filters.currency(totalToBill) }}</td>
          </tr>
          <tr>
            <td class="">
              {{ $t('membersBill:nbBills') }}
            </td>
            <td class="">
              {{ nbBills }}
            </td>
          </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
    <v-card-text v-if="!isLoading && !userOrders.length">
      {{ $t('membersBill:noBills') }}
    </v-card-text>
    <v-card-text v-if="!isLoading && userOrders.length" class="vh-center">
      <v-row>
        <v-col cols="12">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                  color="primary"
                  v-bind="props"
                  variant="outlined"
              >
                Menu
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="enterAddDialogFlow">
                <template v-slot:prepend>
                  <v-icon>add</v-icon>
                </template>
                <v-list-item-title>
                  {{ $t('membersBill:addBill') }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item @click="downloadAllReceipts">
                <template v-slot:prepend>
                  <v-icon>file_download</v-icon>
                </template>
                <v-list-item-title>
                  {{ $t('membersBill:downloadAllBills') }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-clipboard="emailsOfParticipants()"
                           v-clipboard:success="copyEmailsSuccess">
                <template v-slot:prepend>
                  <v-icon>content_copy</v-icon>
                </template>
                <v-list-item-title>
                  {{ $t('membersBill:emailOfParticipatingMembers') }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item @click="downloadBillsTotal">
                <template v-slot:prepend>
                  <v-icon>account_balance</v-icon>
                </template>
                <v-list-item-title>
                  {{ $t('membersBill:downloadBillsTotal') }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
        <v-col cols="12" class="vh-center">
          <v-text-field
              prepend-inner-icon="search"
              :label="$t('membersBill:searchPlaceholder')"
              single-line
              hide-details
              v-model="searchText"
              class="mx-4"
              clearable
              variant="outlined"
              rounded
              bg-color="primary"
              max-width="475"
          ></v-text-field>
        </v-col>
        <v-col cols="12" class="vh-center">
          <v-list width="475">
            <div v-for="userOrder in filteredUserOrders" :key="userOrder.id">
              <v-list-item>
                <template v-slot:append>
                  <!--                  <v-btn variant="text" @click="downloadReceipt(userOrder.Member.id)" size="large">-->
                  <!--                    <v-icon size="large">file_download</v-icon>-->
                  <!--                  </v-btn>-->
                  <v-btn
                      variant="text"
                      size="large"
                      @click="copyBillUrlOfMemberId(userOrder.Member.id)"
                  >
                    <v-icon size="large">content_copy</v-icon>
                  </v-btn>
                  <v-btn size="large" @click="viewReceipt(userOrder.Member.id)" variant="text">
                    <v-icon size="large">preview</v-icon>
                  </v-btn>
                  <v-btn size="large" target="_blank"
                         :to="`/groupe/${buyGroupId}/commande/${buyGroupOrderId}/factures-membres/${userOrder.Member.id}/print`"
                         variant="text">
                    <v-icon size="large">print</v-icon>
                  </v-btn>
                </template>

                <v-list-item-title class="text-left ml-6">
                  {{ userOrder.Member.firstname }}
                  {{ userOrder.Member.lastname }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-left ml-6">
                    <span v-if="userOrder.total === undefined || userOrder.total === null">
                      {{ $filters.currency(userOrder.expectedTotal) }}
                    </span>
                  <span>
                      {{ $filters.currency(userOrder.total) }}
                    </span>
                </v-list-item-subtitle>
              </v-list-item>
              <v-divider class="mt-2"></v-divider>
            </div>
          </v-list>
        </v-col>
        <v-col cols="12" v-if="filteredUserOrders.length === 0" class="text-h6 text-grey">
          {{ $t('noResults') }}
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
      <template v-slot:actions>
        <v-btn
            color="white"
            variant="text"
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
      <template v-slot:actions="{ attrs }">
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
    <v-dialog v-model="addBillDialog">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="text-h5 text-medium-emphasis ps-2">

          </div>
          <v-icon icon="close" @click="addBillDialog = false" variant="text"></v-icon>
        </v-card-title>
        <v-divider class="mb-4"></v-divider>
      </v-card>
    </v-dialog>
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
import Search from "../Search";

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
      nbBills: "Nombre de factures",
      downloadAllBills: "Télécharger toutes les factures",
      downloadBillsTotal: "Télécharger le résumé des factures",
      billLinkCopied: "Le lien de la facture a été copié",
      searchPlaceholder: "Chercher le nom d'une personne",
      addBill: "Ajouter une facture"
    };
    I18n.i18next.addResources("fr", "membersBill", text);
    I18n.i18next.addResources("en", "membersBill", text);
    return {
      isLoading: true,
      userOrders: [],
      userBillModal: false,
      emailCopySnackbar: false,
      billLinkCopySnackbar: false,
      totalToBill: 0,
      nbBills: 0,
      searchText: "",
      addBillDialog: false
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
      this.nbBills = this.userOrders.length;
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
    enterAddDialogFlow: function () {
      this.addBillDialog = true;
    },
    addBill: function () {

    },
    copyBillUrlOfMemberId: function (memberId) {
      navigator.clipboard.writeText(this.getBillUrlOfMemberId(memberId));
      this.copyBillLinkSuccess();
    },
    getBillUrlOfMemberId: function (memberId) {
      return new URL(this.$route.path + '/' + memberId + '/page', window.location.origin).href;
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
  },
  computed: {
    filteredUserOrders: function () {
      if (this.userOrders === undefined) {
        return []
      }
      if (this.searchText === null) {
        return this.userOrders;
      }
      return this.userOrders.filter((order) => {
        return Search.matchesAnyValues([
          order.Member.firstname,
          order.Member.lastname
        ], this.searchText);
      })
    }
  }
}
</script>

<style scoped>

</style>

