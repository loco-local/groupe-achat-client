<template>
  <v-row>
    <v-col cols="12" class="vh-center">
      <v-card max-width="400">
        <v-card-text v-if="isLoading">
          <v-progress-circular indeterminate :size="80" :width="2"></v-progress-circular>
        </v-card-text>
        <div v-if="!isLoading">
          <div v-if="buyGroup.relevantOrder">
            <v-card-title class="vh-center">
              <span class="mr-2">{{ $t('order') }}</span>
              <GroupOrderStatusText :status="buyGroup.relevantOrder.status"></GroupOrderStatusText>
            </v-card-title>
            <v-card-subtitle class="body-1">
              {{ buyGroup.relevantOrder.startDate | dayNoYearDate }} {{ $t('to') }}
              {{ buyGroup.relevantOrder.endDate | dayDate }}
            </v-card-subtitle>
            <v-card>
              <v-card-text class="body-1">
                <strong>
                  {{ buyGroup.relevantOrder.salePercentage }}%
                </strong>
                {{ $t('groupOrderStatus:addedToCost') }}.
              </v-card-text>
            </v-card>
            <v-card>
              <v-card-title class="text-body-1 font-weight-bold vh-center pb-0">
                {{ $t('groupOrderStatus:additionalFees') }}
              </v-card-title>
              <v-card-text class="pt-0 body-1">
                {{ buyGroup.relevantOrder.additionalFees }}
              </v-card-text>
            </v-card>
          </div>
          <div v-if="!buyGroup.relevantOrder && latestOrder === null">
            <v-card-text class="body-1">
              {{ $t('groupOrderStatus:noOrders') }}
            </v-card-text>
          </div>
          <div v-if="latestOrder !== null">
            <v-card-text class="body-1">
              {{ $t('groupOrderStatus:latestOrder') }}
              {{ latestOrder.endDate | dayDate }}
            </v-card-text>
            <v-card-text v-if="memberId !== null && showBillButton" class="text-h6 font-weight-regular">
              <v-btn text outlined
                     :to="'/groupe/' + buyGroup.id + '/commande/' + latestOrder.id + '/factures-membres/' + 1">
                <v-icon left>receipt</v-icon>
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
  props: ['buyGroupPath', 'buyGroupId', 'memberId', 'showBillButton'],
  data: function () {
    const text = {
      addedToCost: "ajouté au prix coûtant",
      additionalFees: "Frais additionnels",
      noOrders: "Pas de commande en vue",
      latestOrder: "La dernière commande s'est terminé le",
      billForLatest: "Voir la facture"
    };
    I18n.i18next.addResources("fr", "groupOrderStatus", text);
    I18n.i18next.addResources("en", "groupOrderStatus", text);
    return {
      buyGroup: null,
      latestOrder: null,
      isLoading: true,
    }
  },
  mounted: async function () {
    this.isLoading = true;
    if(this.showBillButton === undefined){
      this.showBillButton = false;
    }
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
