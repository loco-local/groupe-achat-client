<template>
  <v-row class="mt-8">
    <v-col cols="12" class="vh-center">
      <v-card max-width="400">
        <v-card-text v-if="isLoading">
          <v-progress-circular indeterminate></v-progress-circular>
        </v-card-text>
        <v-card-title v-if="!isLoading">
          <span class="mr-2">{{ $t('order') }}</span>
          <span v-if="buyGroup.relevantOrder.status === 'CURRENT'">
            {{ $t('orderStatus:current') }}
          </span>
          <span v-if="buyGroup.relevantOrder.status === 'TO_COME'">
            {{ $t('orderStatus:toCome') }}
          </span>
          <span v-if="buyGroup.relevantOrder.status === 'FINISHED'">
            {{ $t('orderStatus:finished') }}
          </span>
        </v-card-title>
        <v-card-subtitle v-if="!isLoading">
          {{ buyGroup.relevantOrder.startDate | dayNoYearDate }} {{ $t('to') }} {{ buyGroup.relevantOrder.endDate | dayDate}}
        </v-card-subtitle>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import BuyGroupService from "@/service/BuyGroupService";
import BuyGroupOrderService from "@/service/BuyGroupOrderService";
import GroupOrder from "@/GroupOrder";
import I18n from "@/i18n";

export default {
  name: "GroupOrderStatus",
  data: function () {
    I18n.i18next.addResources("fr", "orderStatus", {
      current: "en cours",
      toCome: "à venir",
      finished: "terminée"
    });
    I18n.i18next.addResources("en", "orderStatus", {
      current: "current",
      toCome: "à venir",
      finished: "terminée"
    });
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
