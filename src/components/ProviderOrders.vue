<template>
  <v-card>
    <v-card-text v-if="isLoading">
      <v-progress-circular indeterminate :size="80" :width="2"></v-progress-circular>
    </v-card-text>
    <v-card-title class="vh-center">
      {{ $t('providerOrders:totalToOrder') }}
    </v-card-title>
    <v-card-subtitle class="vh-center text-h6">
      {{ total | currency }}
    </v-card-subtitle>
    <v-card-text v-if="!isLoading && !providerNames.length">
      {{ $t('providerOrders:noOrders') }}
    </v-card-text>
    <v-card-text v-if="!isLoading && providerNames.length" class="vh-center">
      <v-row>
        <v-col cols="12">
          <v-btn class="mt-4" @click="downloadAllOrders">
            <v-icon left>file_download</v-icon>
            {{ $t('downloadAll') }}
          </v-btn>
        </v-col>
        <v-col cols="12" class="vh-center">
          <v-list width="475">
            <div v-for="providerName in providerNames" :key="providerName">
              <v-list-item>
                <v-list-item-action>
                  <v-btn icon @click="downloadProviderOrder(providerName)" large>
                    <v-icon large>file_download</v-icon>
                  </v-btn>
                </v-list-item-action>
                <v-list-item-action>
                  <v-btn icon large @click="viewProviderOrder(providerName)">
                    <v-icon large>preview</v-icon>
                  </v-btn>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title class="text-left ml-6">
                    {{ providerName }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-left ml-6">
                    {{ providerTotals[providerName] | currency }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
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
      const orderItemsByProvider = await ProviderOrders.getOrderItemsForEachProvider(this.buyGroupId, this.buyGroupOrderId);
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
      const toPath = this.$router.currentRoute.path + "/" + providerName;
      if (this.$router.currentRoute.path !== toPath) {
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
