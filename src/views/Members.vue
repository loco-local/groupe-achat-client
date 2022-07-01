<template>
  <Page>
    <v-row v-if="isLoading" class="mt-12">
      <v-col cols="12">
        <v-progress-circular
            indeterminate
            size="64"
        ></v-progress-circular>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        {{ members }}
      </v-col>
    </v-row>
  </Page>
</template>

<script>
import MemberService from "@/service/MemberService";

export default {
  name: "Members",
  components: {
    Page: () => import('@/components/Page')
  },
  data: function () {
    return {
      isLoading: false,
      members: []
    }
  },
  mounted: async function () {
    this.isLoading = true;
    this.members = await MemberService.listForBuyGroupId(this.$store.state.user.BuyGroupId);
    this.isLoading = false;
  }
}
</script>

<style scoped>

</style>
