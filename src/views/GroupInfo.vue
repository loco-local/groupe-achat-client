<template>
  <PageWrap>
    <v-row class="vh-center">
      <v-col cols="12" md="11" lg="10" xl="9">
        <v-row>
          <v-col cols="12">
            <v-card flat>
              <v-card-title class="text-left pl-0">
                {{ $t('group:title') }}
              </v-card-title>
            </v-card>
          </v-col>
          <v-col cols="12" v-if="isLoading">
            <v-progress-circular indeterminate :size="80" :width="2"></v-progress-circular>
          </v-col>
          <v-col cols="12" v-if="!isLoading">
            <v-card class="mb-6">
              <v-card-text class="body-1 text-left">
                {{ $t('group:subscriptionUrl') }} :
                {{ subscriptionUrl }}
                <v-btn small class="ml-4" v-clipboard:copy="subscriptionUrl">
                  <v-icon left>
                    content_copy
                  </v-icon>
                  {{ $t('copy') }}
                </v-btn>
              </v-card-text>
            </v-card>
            <v-form name="groupForm" ref="groupForm">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                      v-model="buyGroup.name"
                      :label="$t('group:name')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                      v-model="buyGroup.path"
                      :label="$t('group:path')"
                      prefix="/"
                  ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                >
                  <v-text-field
                      v-model="buyGroup.salePercentage"
                      :label="$t('group:salePercentage')"
                      prefix="%"
                      type="number"
                  ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                >
                  <v-textarea
                      v-model="buyGroup.additionalFees"
                      :label="$t('group:additionalFees')"
                  ></v-textarea>
                </v-col>
                <v-col
                    cols="12"
                >
                  <v-textarea
                      v-model="buyGroup.howToPay"
                      :label="$t('group:howToPay')"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" class="text-left">
                  <v-btn color="primary"
                         :loading="isSaving"
                         :disabled="isSaving"
                         @click="update"
                  >
                    {{ $t('modify') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-snackbar
        v-model="modifyGroupInfoSnackbar"
        top
        :timeout="7000"
    >
        <span class="body-1">
          {{ $t('groupInfo:modifySuccess') }}
        </span>
      <template v-slot:action="{ attrs }">
        <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="modifyGroupInfoSnackbar = false"
        >
          {{ $t('close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </PageWrap>
</template>

<script>
import BuyGroupService from "@/service/BuyGroupService";
import BuyGroupTranslation from "@/BuyGroupTranslation";
import BuyGroup from "@/BuyGroup";

import I18n from "@/i18n";

export default {
  name: "GroupInfo",
  components: {
    PageWrap: () => import('@/components/PageWrap')
  },
  data: function () {
    BuyGroupTranslation.setup();
    const text = {
      modifySuccess: "Les infos de votre groupe ont été modifiées"
    };
    I18n.i18next.addResources("fr", "groupInfo", text);
    I18n.i18next.addResources("en", "groupInfo", text);
    return {
      buyGroup: null,
      isLoading: true,
      isSaving: false,
      modifyGroupInfoSnackbar: false
    }
  },
  mounted: async function () {
    this.isLoading = true;
    const buyGroupId = parseInt(this.$route.params.buyGroupId);
    this.buyGroup = await BuyGroupService.getForId(buyGroupId)
    this.isLoading = false;
  },
  methods: {
    update: async function () {
      this.isSaving = true;
      await BuyGroupService.update(
          this.buyGroup.id,
          this.buyGroup
      )
      this.modifyGroupInfoSnackbar = true;
      this.isSaving = false;
    }
  },
  computed: {
    subscriptionUrl: function () {
      return BuyGroup.getSubscriptionUrl(this.buyGroup.path)
    }
  }
}
</script>

<style scoped>

</style>
