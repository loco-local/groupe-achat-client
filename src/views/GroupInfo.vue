<template>
  <Page>
    <v-row>
      <v-col cols="12">
        <v-card flat>
          <v-card-title class="text-left">
            {{ $t('group:title') }}
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" v-if="isLoading">
        <v-progress-circular indeterminate :size="80" :width="2"></v-progress-circular>
      </v-col>
      <v-col cols="12" v-if="!isLoading">
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
  </Page>
</template>

<script>
import BuyGroupService from "@/service/BuyGroupService";
import I18n from "@/i18n";

export default {
  name: "GroupInfo",
  components: {
    Page: () => import('@/components/Page')
  },
  data: function () {
    I18n.i18next.addResources("fr", "group", {
      title: "Votre groupe",
      name: "Nom",
      path: "Chemin dans l'url",
      salePercentage: "Pourcentage de vente",
      additionalFees: "Frais additionels"
    });
    I18n.i18next.addResources("en", "group", {
      title: "Votre groupe",
      name: "Nom",
      path: "Chemin dans l'url",
      salePercentage: "Pourcentage de vente",
      additionalFees: "Frais additionels"
    });
    return {
      buyGroup: null,
      isLoading: true,
      isSaving: false
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
      this.isSaving = false;
    }
  }
}
</script>

<style scoped>

</style>
