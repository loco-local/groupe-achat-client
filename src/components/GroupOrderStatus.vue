<template>
  <v-row>
    <v-col cols="12" class="vh-center">
      <v-card max-width="400">
        <v-card-text v-if="isLoading">
          <v-progress-circular indeterminate></v-progress-circular>
        </v-card-text>
        <v-card-title v-if="!isLoading">
          {{buyGroup}}
        </v-card-title>
        <v-card-subtitle v-if="!isLoading">

        </v-card-subtitle>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import BuyGroupService from "@/service/BuyGroupService";

export default {
  name: "GroupOrderStatus",
  data: function () {
    return {
      buyGroup: null,
      isLoading: false,
    }
  },
  mounted: async function () {
    this.isLoading = true;
    const buyGroupPath = this.$route.params.buyGroup;
    this.buyGroup = await BuyGroupService.getForPath(buyGroupPath);
    await this.$emit('buyGroupDefined', this.buyGroup);
    this.isLoading = false;
  }
}
</script>

<style scoped>

</style>
