<template>
  <v-dialog v-model="show" v-if="show" fullscreen>
    <v-card>
      <v-toolbar
          dark
          color="primary"
      >
        <v-btn
            icon="mdi-close"
            @click="leave"
        ></v-btn>
        <v-toolbar-title>
          {{ $t('providerOrders:orderForProvider') }} {{ providerName }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
              theme="dark"
              variant="text"
              @click="exportToCsv"
              :disabled="itemsLoading"
          >
            <v-icon start>file_download</v-icon>
            {{ $t('download') }}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <ProviderOrder
          :buyGroupId="buyGroupId"
          :buyGroupOrderId="buyGroupOrderId"
          :providerName="providerName"
          @itemsDefined="setItems"
      ></ProviderOrder>
    </v-card>
  </v-dialog>
</template>

<script>

import OrderToCsv from "@/OrderToCsv";
import {defineAsyncComponent} from "vue";
export default {
  name: "ProviderOrderDialog",
  props: ['buyGroupId', 'buyGroupOrderId', 'buyGroupPath'],
  components: {
    ProviderOrder: defineAsyncComponent(() => import('@/components/ProviderOrder'))
  },
  data: function () {
    return {
      show: false,
      providerItems: null,
      providerName: null,
      total: null,
      itemsLoading: true
    }
  },
  mounted: function () {
  },
  methods: {
    enter: async function (providerName) {
      this.show = true;
      this.providerName = providerName;
      this.itemsLoading = true;
    },
    leave: function () {
      let path = this.$route.path;
      path = path.substring(0, path.lastIndexOf("/"));
      this.$router.push(
          path
      );
      this.$emit('leave');
      this.show = false;
    },
    setItems: function (orderItemsByProvider) {
      this.providerItems = orderItemsByProvider.providerOrders[this.providerName];
      this.total = orderItemsByProvider.providerTotals[this.providerName];
      this.itemsLoading = false;
    },
    exportToCsv: async function () {
      OrderToCsv.exportForProviderOrder(
          this.providerItems,
          this.total
      );
    }
  },
  watch: {
    '$route'(to) {
      if (to.name !== "GroupOrderProvidersOrderForProvider") {
        this.show = false;
      }
    }
  }
}
</script>

<style scoped>

</style>
