<template>
  <v-row>
    <v-col cols="12" class="vh-center">
      <v-card max-width="400">
        <v-card-text v-if="isLoading">
          <v-progress-circular indeterminate></v-progress-circular>
        </v-card-text>
        <v-card-title v-if="!isLoading">
          {{ buyGroup.relevantOrder.status }}
        </v-card-title>
        <v-card-subtitle v-if="!isLoading">

        </v-card-subtitle>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import BuyGroupService from "@/service/BuyGroupService";
import BuyGroupOrderService from "@/service/BuyGroupOrderService";
import GroupOrder from "@/GroupOrder";

export default {
  name: "GroupOrderStatus",
  data: function () {
    return {
      buyGroup: null,
      isLoading: true,
    }
  },
  mounted: async function () {
    this.isLoading = true;
    const buyGroupPath = this.$route.params.buyGroup;
    this.buyGroup = await BuyGroupService.getForPath(buyGroupPath);
    const unfinishedGroupOrders = await BuyGroupOrderService.listUnfinished(this.buyGroup.id);
    this.buyGroup.relevantOrder = GroupOrder.mostRelevantUnfinishedOrder(
        unfinishedGroupOrders.map((groupOrder) => {
          return GroupOrder.format(groupOrder)
        })
    );
    await this.$emit('buyGroupDefined', this.buyGroup);
    this.isLoading = false;
  }
}
</script>

<style scoped>

</style>
