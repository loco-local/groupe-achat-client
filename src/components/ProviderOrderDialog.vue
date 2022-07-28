<template>
  <v-dialog v-model="show" v-if="show" fullscreen>
    <v-card>
      <v-toolbar
          dark
          color="primary"
      >
        <v-btn
            icon
            dark
            @click="leave"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t('providerOrders:orderForProvider') }} {{ providerName }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
              dark
              text
              @click="exportToCsv"
              :disabled="itemsLoading"
          >
            <v-icon left>file_download</v-icon>
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

export default {
  name: "ProviderOrderDialog",
  props: ['buyGroupId', 'buyGroupOrderId', 'buyGroupPath'],
  components: {
    ProviderOrder: () => import('@/components/ProviderOrder')
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
      let path = this.$router.currentRoute.path;
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
