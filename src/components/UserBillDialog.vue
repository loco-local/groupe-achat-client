<template>
  <v-dialog v-model="show" v-if="show" fullscreen>
    <v-card>
      <v-toolbar
          dark
          color="primary"
      >
        <v-btn
            icon
            dark
            @click="leave"
            v-if="$store.state.user.status === 'admin'"
        >
          <v-icon>mdi-close</v-icon>
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
              dark
              text
              @click="exportToCsv"
              :disabled="itemsLoading"
          >
            <v-icon left>file_download</v-icon>
            {{ $t('userBill:download') }}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <UserBill
          :buyGroupId="buyGroupId"
          :buyGroupOrderId="buyGroupOrderId"
          :buyGroupPath="buyGroupPath"
          :userId="userId"
          @itemsDefined="setItems"
      ></UserBill>
    </v-card>
  </v-dialog>
</template>

<script>
import MemberService from "@/service/MemberService";
import MemberOrder from "@/MemberOrder";

export default {
  name: "UserBillDialog",
  props: ['buyGroupId', 'buyGroupOrderId', 'buyGroupPath'],
  components: {
    UserBill: () => import('@/components/UserBill')
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
      let path = this.$router.currentRoute.path;
      path = path.substring(0, path.lastIndexOf("/"));
      this.$router.push(
          path
      );
      this.show = false;
    },
    setItems: function (items) {
      this.items = items;
      this.itemsLoading = false;
    },
    exportToCsv: async function () {
      MemberOrder.exportToCsv(this.items);
    }
  },
  watch: {
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
