<template>
  <PageWrap>
    <v-card flat class="pt-8" color="transparent">
      <v-card-title class="text-h4">
        {{ $t('import:title') }}
      </v-card-title>
    </v-card>
    <v-tabs v-model="tab" grow>
      <v-tab key="satau">
        Satau
      </v-tab>
      <v-tab key="hn">
        Horizon Nature
      </v-tab>
      <v-tabs-items v-model="tab">
        <v-tab-item
            key="satau" class="text-left"
        >
          <SatauImport></SatauImport>
        </v-tab-item>
        <v-tab-item
            key="hn" class="text-left"
        >
          <HNImport></HNImport>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </PageWrap>
</template>

<script>
import I18n from "@/i18n";
import SatauImport from "@/components/SatauImport";
import HNImport from "@/components/HNImport";

export default {
  name: "ImportProducts",
  components: {
    HNImport,
    SatauImport,
    PageWrap: () => import('@/components/PageWrap')
  },
  data: function () {
    const text = {
      title: "Importer Produits",
      areDataOk: "Est-ce que les données semblent correct ?",
      yesDataOk: "Oui, mettre à jour la base de donnée",
      noDataOk: "Non, je ne suis pas sûr.",
      productsNotAvailable: "Indisponibles",
      newProducts: "Nouveaux",
      priceUpdatedProducts: "Prix mis à jour",
      productsNothingChanged: "Rien de changé"
    };
    I18n.i18next.addResources("fr", "import", text);
    I18n.i18next.addResources("en", "import", text);
    return {
      tab: null,
      acceptUploadLoading: false
    }
  },
  mounted: async function () {
  },
  methods: {}
}
</script>

<style scoped>

</style>
