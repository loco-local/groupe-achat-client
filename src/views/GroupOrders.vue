<template>
  <PageWrap>
    <v-card flat>
      <v-card-title class="text-center vh-center">
        {{ $t('groupOrders:title') }}
      </v-card-title>
      <v-card-actions class="vh-center">
        <v-btn @click="enterNewOrderFlow" prepend-icon="mdi-plus">
          {{ $t('groupOrders:newOrder') }}
        </v-btn>
      </v-card-actions>
      <v-card-title v-if="orders.length === 0" class="vh-center">
        {{ $t('groupOrders:none') }}
      </v-card-title>
      <v-card-text v-if="isLoading">
        <v-progress-circular
            :width="2"
            :size="80"
            indeterminate
        ></v-progress-circular>
      </v-card-text>
      <v-card-text v-if="orders.length > 0 && !isLoading" class="text-center">
        <v-list>
          <v-list-item :to="'/groupe/' + $store.state.user.BuyGroupId + '/commande/'  + order.id" v-for="order in orders"
                       :key="order.id">
            
              <v-list-item-title class="font-weight-bold mb-2 text-capitalize">
                <GroupOrderStatusText :status="order.status"></GroupOrderStatusText>
              </v-list-item-title>
              <v-list-item-subtitle class="mb-2">
                {{ $filters.dayDate(order.startDate) }}
                {{ $t('to') }}
                {{ $filters.dayDate(order.endDate) }}
              </v-list-item-subtitle>
            <template v-slot:append>
              <v-btn @click.prevent="enterUpdateOrderFlow(order)" icon="mdi-pencil" variant="text"></v-btn>
            </template>
            <v-divider inset></v-divider>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
    <v-dialog
        v-model="editOrderDialog"
        max-width="700px"
        v-if="editedOrder !== null"
    >
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="text-h5 text-medium-emphasis ps-2">
            <span v-if="isNewOrderFlow">
                {{ $t('groupOrders:newOrder') }}
            </span>
            <span v-else>
                {{ $t('modify') }}
            </span>
          </div>
          <v-icon icon="mdi-close" @click="cancelSave" variant="text"></v-icon>
        </v-card-title>
        <v-divider class="mb-4"></v-divider>
        <v-card-text>
          <v-container>
            <v-form name="groupOrderForm" ref="groupOrderForm">
              <v-row>
                <v-col
                    cols="12"
                >
                  <v-menu
                      v-model="startDateMenu"
                      :close-on-content-click="false"
                      :offset="40"
                      transition="scale-transition"
                      min-width="auto"
                      v-if="!isSaveLoading"
                  >
                    <template v-slot:activator="{ props }">
                      <!--                      <div v-bind="attrs"&ndash;&gt;-->
                      <!--                        &lt;!&ndash;                          v-on="on"&ndash;&gt;>-->
                      <!--                        <v-icon left>-->
                      <!--                          mdi-calendar-->
                      <!--                        </v-icon>-->
                      <!--                        <strong class="mr-2">{{ $t('startDate') }}</strong>-->
                      <!--                        {{ editedOrder.startDate | dayDate}}-->
                      <!--                      </div>-->
                      <v-text-field
                          v-model="editedOrder.startDateFormattedForInput"
                          :label="$t('startDate')"
                          prepend-icon="mdi-calendar"
                          readonly
                         
                          v-bind="props"
                          :rules="[rules.required]"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                        v-model="editedOrder.startDateFormattedForInput"
                        @input="startDateMenu = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col
                    cols="12"
                >
                  <v-menu
                      v-model="endDateMenu"
                      :close-on-content-click="false"
                      :offset="40"
                      transition="scale-transition"
                      min-width="auto"
                      v-if="!isSaveLoading"
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                          v-model="editedOrder.endDateFormattedForInput"
                          :label="$t('endDate')"
                          prepend-icon="mdi-calendar"
                          readonly
                         
                          v-bind="props"
                          :rules="[rules.required]"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                        v-model="editedOrder.endDateFormattedForInput"
                        @input="endDateMenu = false"
                        :rules="[rules.required]"
                    ></v-date-picker>
                  </v-menu>
                  <v-alert
                      border="bottom"
                      border-color="info"
                      type="info"
                      elevation="2"
                      color="info"
                      class="ml-6 mr-6 info-accent-4"
                      density="compact"
                  >
                    <p class="text-body-1">
                      {{ $t('groupOrders:endDateInfo') }}
                    </p>
                    <p class="text-body-1">
                      {{ $t('groupOrders:endDateInfo1') }}
                    </p>
                  </v-alert>
                </v-col>
                <v-col
                    cols="12"
                >
                  <v-text-field
                      v-model="editedOrder.salePercentage"
                      :label="$t('group:salePercentage')"
                      prefix="%"
                      type="number"
                  ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                >
                  <v-textarea
                      v-model="editedOrder.additionalFees"
                      :label="$t('group:additionalFees')"
                  ></v-textarea>
                </v-col>
                <v-col
                    cols="12"
                >
                  <v-textarea
                      v-model="editedOrder.howToPay"
                      :label="$t('group:howToPay')"
                  ></v-textarea>
                </v-col>
                <v-col
                    cols="12"
                >
                  <v-textarea
                      v-model="editedOrder.comment"
                      :label="$t('group:comment')"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-divider class="mt-2"></v-divider>
        <v-card-actions class="my-2 d-flex justify-end">
          <v-btn
              variant="text"
              @click="cancelSave"
          >
            {{ $t('cancel') }}
          </v-btn>
          <v-btn
              color="primary"
              @click="save"
              :loading="isSaveLoading"
              :disabled="isSaveLoading"
          >
            <span v-if="isNewOrderFlow">
              {{ $t('add') }}
              <!--              <v-icon right large>add_circle</v-icon>-->
            </span>
            <span v-else>
              {{ $t('modify') }}
            </span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </PageWrap>
</template>

<script>
import BuyGroupOrderService from "@/service/BuyGroupOrderService";
import I18n from "@/i18n";
import Rules from "@/Rules";
import BuyGroupTranslation from "@/BuyGroupTranslation";
import BuyGroupService from "@/service/BuyGroupService";
import dateUtil from "@/dateUtil";
import GroupOrder from "@/GroupOrder";
import PageWrap from '@/components/PageWrap'
import { defineAsyncComponent } from "vue";
export default {

  name: "GroupOrders",
  components: {
    PageWrap,
    GroupOrderStatusText: defineAsyncComponent(() => import('@/components/GroupOrderStatusText'))
  },
  data: () => {
    BuyGroupTranslation.setup();
    const text = {
      title: "Commandes du groupe",
      none: "Aucunes commandes passées",
      newOrder: "Nouvelle commande",
      orderOf: "Commande du",
      endDateInfo: "La date de fin correspond au dernier jour où le membre pourra modifier ses quantités.",
      endDateInfo1: "Les administrateurs pourront toutefois modifier les quantités finales après cette date."
    };
    I18n.i18next.addResources("fr", "groupOrders", text);
    I18n.i18next.addResources("en", "groupOrders", text);
    return {
      orders: [],
      isLoading: false,
      editedOrder: null,
      editOrderDialog: false,
      originalEditOrderValues: null,
      rules: Rules,
      isSaveLoading: false,
      startDateMenu: false,
      endDateMenu: false,
      buyGroup: null
    }
  },
  mounted: async function () {
    this.buyGroup = await BuyGroupService.getForId(this.$store.state.user.BuyGroupId);
    await this.resetList();
  },
  methods: {
    resetList: async function () {
      this.isLoading = true;
      this.orders = await BuyGroupOrderService.list(this.$store.state.user.BuyGroupId);
      this.orders = GroupOrder.sortByMostRelevantOrders(this.orders);
      this.isLoading = false;
    },
    save: async function () {
      const formValidation = await this.$refs.groupOrderForm.validate()
      if (!formValidation.valid) {
        return
      }
      this.isSaveLoading = true;
      this.editedOrder.startDate = new Date(this.editedOrder.startDateFormattedForInput.replaceAll("-", "/"));
      this.editedOrder.endDate = new Date(this.editedOrder.endDateFormattedForInput.replaceAll("-", "/"));
      this.editedOrder.status = GroupOrder.calculateStatus(this.editedOrder);
      if (this.isNewOrderFlow) {
        await BuyGroupOrderService.create(
            this.editedOrder,
            this.$store.state.user.BuyGroupId
        );
        await this.resetList();
      } else {
        await BuyGroupOrderService.update(
            this.editedOrder,
            this.$store.state.user.BuyGroupId
        );
      }
      this.isSaveLoading = false;
      this.editOrderDialog = false;
    },
    cancelSave: function () {
      if (!this.isNewOrderFlow) {
        this.editedOrder.startDate = this.originalEditOrderValues.startDate;
        this.editedOrder.endDate = this.originalEditOrderValues.endDate;
      }
      this.editOrderDialog = false;
    },
    enterNewOrderFlow: async function () {
      this.editedOrder = {};
      this.editOrderDialog = true;
      await this.$nextTick();
      this.$refs.groupOrderForm.reset();
      this.editedOrder = {
        salePercentage: this.buyGroup.salePercentage,
        additionalFees: this.buyGroup.additionalFees,
        howToPay: this.buyGroup.howToPay,
      };
    },
    enterUpdateOrderFlow: async function (order) {
      this.editedOrder = {}
      this.editOrderDialog = true;
      await this.$nextTick();
      this.$refs.groupOrderForm.reset();
      this.originalEditOrderValues = {...order};
      this.editedOrder = order;
      this.editedOrder.startDate = dateUtil.formatForDatePicker(this.editedOrder.startDate);
      this.editedOrder.endDate = dateUtil.formatForDatePicker(this.editedOrder.endDate);
    },
  },
  computed: {
    isNewOrderFlow: function () {
      return this.editedOrder !== null && this.editedOrder.id === undefined;
    }
  }
}
</script>

<style scoped>

</style>
