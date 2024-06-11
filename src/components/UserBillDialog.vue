<template>
  <v-dialog v-model="show" v-if="show" fullscreen>
    <v-card>
      <v-toolbar
          dark
          color="primary"
      >
        <v-btn
            icon
            theme="dark"
            @click="leave"
            v-if="$store.state.user.status === 'admin' && closable !== false"
        >
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t('userBill:billOf') }}
          <span v-if="member" class="ml-1">
            {{ member.firstname }}
            {{ member.lastname }}
          </span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
              theme="dark"
              variant="text"
              :to="`/groupe/${buyGroupId}/commande/${buyGroupOrderId}/factures-membres/${userId}/print`"
              :disabled="itemsLoading"
          >
            <v-icon start>print</v-icon>
            {{ $t('printing') }}
          </v-btn>
          <v-btn
              theme="dark"
              variant="text"
              @click="exportToCsv"
              :disabled="itemsLoading"
          >
            <v-icon start>file_download</v-icon>
            {{ $t('userBill:download') }}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <UserBill
          :buyGroupId="buyGroupId"
          :buyGroupOrderId="buyGroupOrderId"
          :buyGroupPath="buyGroupPath"
          :userId="userId"
          @dataDefined="setData"
      ></UserBill>
    </v-card>
  </v-dialog>
</template>

<script>
import MemberService from "@/service/MemberService";
import OrderToCsv from "@/OrderToCsv";
import {defineAsyncComponent} from "vue";
export default {
  name: "UserBillDialog",
  props: ['buyGroupId', 'buyGroupOrderId', 'buyGroupPath', 'closable'],
  components: {
    UserBill: defineAsyncComponent(() => import('@/components/UserBill'))
  },
  data: function () {
    return {
      show: false,
      member: null,
      userId: null,
      itemsLoading: true
    }
  },
  mounted: function () {
  },
  methods: {
    enter: async function (userId) {
      this.userId = userId;
      this.show = true;
      this.member = await MemberService.getForId(this.userId);
      this.itemsLoading = true;
    },
    leave: function () {
      this.show = false;
    },
    setData: function (data) {
      this.items = data.items;
      this.buyGroupOrder = data.buyGroupOrder;
      this.itemsLoading = false;
    },
    exportToCsv: async function () {
      OrderToCsv.exportForMemberOrder(this.items, this.buyGroupOrder);
    }
  },
  watch: {
    show: function () {
      if (this.show === false) {
        this.$router.back();
      }
    },
    '$route'(to) {
      if (to.name !== "GroupOrderMemberBillsForMember") {
        this.show = false;
      }
    }
  },
}
</script>

<style scoped>

</style>
