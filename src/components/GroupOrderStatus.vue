<template>
  <v-row>
    <v-col cols="12" class="vh-center text-center">
      <v-card max-width="400" flat>
        <v-card-text v-if="isLoading">
          <v-progress-circular indeterminate :size="80" :width="2"></v-progress-circular>
        </v-card-text>
        <div v-if="!isLoading">
          <div v-if="buyGroup.relevantOrder">
            <v-card-title class="vh-center">
              <span class="mr-2">{{ $t('order') }}</span>
              <GroupOrderStatusText :status="buyGroup.relevantOrder.status"></GroupOrderStatusText>
            </v-card-title>
            <v-card-subtitle class="text-body-1">
              {{ $filters.dayNoYearDate(buyGroup.relevantOrder.startDate)}} {{ $t('to') }}
              {{ $filters.dayDate(buyGroup.relevantOrder.endDate)}}
            </v-card-subtitle>
            <v-card v-if="false">
              <v-card-text class="text-body-1">
                <strong>
                  {{ buyGroup.relevantOrder.salePercentage }}%
                </strong>
                {{ $t('groupOrderStatus:addedToCost') }}.
                <br>
                {{ $t('groupOrderStatus:percentageIncluded') }}.
              </v-card-text>
            </v-card>
            <v-card>
              <v-card-title class="text-body-1 font-weight-bold vh-center pb-0">
                {{ $t('groupOrderStatus:additionalFees') }}
              </v-card-title>
              <v-card-text class="pt-0 text-body-1">
                {{ buyGroup.relevantOrder.additionalFees }}
              </v-card-text>
            </v-card>
          </div>
          <div v-if="!buyGroup.relevantOrder && latestOrder === null">
            <v-card-text class="text-body-1">
              {{ $t('groupOrderStatus:noOrders') }}
            </v-card-text>
          </div>
          <div v-if="latestOrder !== null">
            <v-card-text class="text-h6 font-weight-regular">
              {{ $t('groupOrderStatus:latestOrder') }}
              {{ $filters.dayDate(latestOrder.endDate) }}
            </v-card-text>
            <v-card-text v-if="memberId !== null && memberId !== undefined" class="text-h6 font-weight-regular">
              <v-btn variant="outlined"
                     :to="`/groupe/${buyGroup.id}/commande/${latestOrder.id}/factures-membres/${memberId}/page`">
                <v-icon start>receipt</v-icon>
                {{ $t('groupOrderStatus:billForLatest') }}
              </v-btn>
            </v-card-text>
          </div>
        </div>
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
  props: ['buyGroupPath', 'buyGroupId', 'memberId', 'memberOfOrder'],
  data: function () {
    const text = {
      addedToCost: "ajouté au prix coûtant",
      percentageIncluded: 'Déjà inclut dans les prix affichés',
      additionalFees: "Frais additionnels",
      noOrders: "Pas de commande en vue",
      latestOrder: "La dernière commande s'est terminé le",
      billForLatest: "Voir la facture",
      cannotOrderAtTheMoment: "Vous ne pouvez pas commander en ce moment"
    };
    I18n.i18next.addResources("fr", "groupOrderStatus", text);
    I18n.i18next.addResources("en", "groupOrderStatus", text);
    return {
      buyGroup: null,
      latestOrder: null,
      isLoading: true
    }
  },
  mounted: async function () {
    this.isLoading = true;
    this.buyGroup = this.buyGroupPath === undefined ?
        await BuyGroupService.getForId(this.buyGroupId) :
        await BuyGroupService.getForPath(this.buyGroupPath);
    const unfinishedGroupOrders = await BuyGroupOrderService.listUnfinished(this.buyGroup.id);
    if (unfinishedGroupOrders.length === 0) {
      const allOrders = await BuyGroupOrderService.list(this.buyGroup.id);
      if (allOrders.length) {
        this.latestOrder = GroupOrder.latestOrder(
            allOrders
        );
      }
    } else {
      this.buyGroup.relevantOrder = GroupOrder.mostRelevantUnfinishedOrder(
          unfinishedGroupOrders
      );
    }
    await this.$emit('buyGroupDefined', this.buyGroup, this.latestOrder);
    this.isLoading = false;
  }
}
</script>

<style scoped>

</style>
