<template>
  <v-row>
    <v-col cols="12" class="vh-center">
      <v-card max-width="400">
        <v-card-text v-if="isLoading">
          <v-progress-circular indeterminate :size="80" :width="2"></v-progress-circular>
        </v-card-text>
        <v-card-title v-if="!isLoading" class="vh-center">
          <span class="mr-2">{{ $t('order') }}</span>
          <GroupOrderStatusText :status="buyGroup.relevantOrder.status"></GroupOrderStatusText>
        </v-card-title>
        <v-card-subtitle v-if="!isLoading" class="body-1">
          {{ buyGroup.relevantOrder.startDate | dayNoYearDate }} {{ $t('to') }}
          {{ buyGroup.relevantOrder.endDate | dayDate }}
        </v-card-subtitle>
        <v-card v-if="!isLoading">
          <v-card-text class="body-1">
            <strong>
              {{ buyGroup.relevantOrder.salePercentage }}%
            </strong>
            {{ $t('groupOrderStatus:addedToCost') }}.
          </v-card-text>
        </v-card>
        <v-card  v-if="!isLoading" >
          <v-card-title class="text-body-1 font-weight-bold vh-center pb-0">
            {{ $t('groupOrderStatus:additionalFees') }}
          </v-card-title>
          <v-card-text class="pt-0 body-1">
            {{ buyGroup.relevantOrder.additionalFees }}
          </v-card-text>
        </v-card>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import BuyGroupService from "@/service/BuyGroupService";
import BuyGroupOrderService from "@/service/BuyGroupOrderService";
import GroupOrder from "@/GroupOrder";
import GroupOrderStatusText from "@/components/GroupOrderStatusText";
import I18n from "@/i18n";

export default {
  name: "GroupOrderStatus",
  components: {GroupOrderStatusText},
  props: ['buyGroupPath', 'buyGroupId'],
  data: function () {
    I18n.i18next.addResources("fr", "groupOrderStatus", {
      addedToCost: "ajouté au prix coûtant",
      additionalFees: "Frais additionnels"
    });
    I18n.i18next.addResources("en", "groupOrderStatus", {
      addedToCost: "ajouté au prix coûtant",
      additionalFees: "Frais additionnels"
    });
    return {
      buyGroup: null,
      isLoading: true,
    }
  },
  mounted: async function () {
    this.isLoading = true;
    this.buyGroup = this.buyGroupPath === undefined ?
        await BuyGroupService.getForId(this.buyGroupId) :
        await BuyGroupService.getForPath(this.buyGroupPath);
    const unfinishedGroupOrders = await BuyGroupOrderService.listUnfinished(this.buyGroup.id);
    this.buyGroup.relevantOrder = GroupOrder.mostRelevantUnfinishedOrder(
        unfinishedGroupOrders
    );
    await this.$emit('buyGroupDefined', this.buyGroup);
    this.isLoading = false;
  }
}
</script>

<style scoped>

</style>
