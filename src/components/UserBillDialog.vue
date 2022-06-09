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
            @click="show = false"
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
              @click="show = false"
          >
            Save
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <UserBill
          :buyGroupId="buyGroupId"
          :buyGroupOrderId="buyGroupOrderId"
          :userId="userId"
      ></UserBill>
    </v-card>
  </v-dialog>
</template>

<script>
import MemberService from "@/service/MemberService";

export default {
  name: "UserBillDialog",
  props: ['buyGroupId', 'buyGroupOrderId', 'userId'],
  components: {
    UserBill: () => import('@/components/UserBill')
  },
  data: function () {
    return {
      show: false,
      member: null
    }
  },
  methods: {
    enter: async function () {
      this.show = true;
      this.member = await MemberService.getForId(this.userId);
    }
  }
}
</script>

<style scoped>

</style>
