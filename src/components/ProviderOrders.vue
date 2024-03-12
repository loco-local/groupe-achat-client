<template>
  <v-card class="text-center">
    <v-card-text v-if="isLoading">
      <v-progress-circular indeterminate :size="80" :width="2"></v-progress-circular>
    </v-card-text>
    <v-card-title class="vh-center">
      {{ $t('providerOrders:totalToOrder') }}
    </v-card-title>
    <v-card-subtitle class="vh-center text-h6">
      {{ $filters.currency(total) }}
    </v-card-subtitle>
    <v-card-text v-if="!isLoading && !providerNames.length">
      {{ $t('providerOrders:noOrders') }}
    </v-card-text>
    <v-card-text v-if="!isLoading && providerNames.length" class="vh-center">
      <v-row>
        <v-col cols="12">
          <v-btn class="mt-4" @click="downloadAllOrders">
            <v-icon start>file_download</v-icon>
            {{ $t('downloadAll') }}
          </v-btn>
        </v-col>
        <v-col cols="12" class="vh-center">
          <v-list width="475">
            <div v-for="providerName in providerNames" :key="providerName">
              <v-list-item>
                <template v-slot:append>
                  <v-btn variant="text" @click="downloadProviderOrder(providerName)" size="large">
                    <v-icon size="large">file_download</v-icon>
                  </v-btn>
                  <v-btn variant="text" size="large" @click="viewProviderOrder(providerName)">
                    <v-icon size="large">preview</v-icon>
                  </v-btn>
                </template>
                  <v-list-item-title class="text-left ml-6">
                    {{ providerName }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-left ml-6">
                    {{ $filters.currency(providerTotals[providerName]) }}
                  </v-list-item-subtitle>
                
              </v-list-item>
              <v-divider class="mt-2"></v-divider>
            </div>
          </v-list>
        </v-col>
      </v-row>
    </v-card-text>
    <ProviderOrderDialog
        :buyGroupId="buyGroupId"
        :buyGroupOrderId="buyGroupOrderId"
        ref="providerOrderDialog"
        @leave="setup"
    ></ProviderOrderDialog>
  </v-card>
</template>

<script>

import ProviderOrderDialog from "@/components/ProviderOrderDialog";
import I18n from "@/i18n";
import LoadingFlow from "@/LoadingFlow";
import ProviderOrders from "@/ProviderOrders";
import OrderToCsv from "@/OrderToCsv";
import BuyGroupOrderService from "@/service/BuyGroupOrderService";

export default {
  name: "ProviderOrders",
  props: ['buyGroupId', 'buyGroupOrderId'],
  components: {
    ProviderOrderDialog
  },
  data: function () {
    const text = {
      noOrders: "Pas encore de commandes",
      orderForProvider: "Commande pour le fournisseur",
      totalToOrder: "Total à commander"
    };
    I18n.i18next.addResources("fr", "providerOrders", text);
    I18n.i18next.addResources("en", "providerOrders", text);
    return {
      isLoading: true,
      providerOrders: {},
      providerNames: [],
      providerTotals: {},
      total: 0
    }
  },
  mounted: async function () {
    if (this.$route.params.providerName) {
      await this.$refs.providerOrderDialog.enter(this.$route.params.providerName);
    } else {
      await this.setup();
    }
  },
  methods: {
    setup: async function () {
      this.isLoading = true;
      const memberOrdersItems = await BuyGroupOrderService.listMemberOrderItems(
          this.buyGroupId,
          this.buyGroupOrderId
      );
      const orderItemsByProvider = ProviderOrders.groupOrderItemsByProviders(memberOrdersItems);
      this.providerOrders = orderItemsByProvider.providerOrders;
      this.providerNames = orderItemsByProvider.providerNames;
      this.providerTotals = orderItemsByProvider.providerTotals;
      this.total = Object.values(orderItemsByProvider.providerTotals).reduce((sum, providerTotal) => {
        return sum + providerTotal
      }, 0)
      this.isLoading = false;
    },
    downloadAllOrders: function () {
      this.providerNames.forEach((providerName) => {
        this.downloadProviderOrder(providerName);
      });
    },
    downloadProviderOrder: function (providerName) {
      OrderToCsv.exportForProviderOrder(
          this.providerOrders[providerName],
          this.providerTotals[providerName]
      )
    },
    viewProviderOrder: function (providerName) {
      LoadingFlow.enter();
      const toPath = this.$route.path + "/" + providerName;
      if (this.$route.path !== toPath) {
        this.$router.push(
            toPath
        );
      }
      this.$refs.providerOrderDialog.enter(providerName);
      LoadingFlow.leave();
    }
  }
}
</script>

<style scoped>

</style>
