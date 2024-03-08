<template>
  <v-row justify="center"
         style="margin-bottom:120px;"
         class="mt-16"
         :class="{
          'pl-4 pr-4' : $vuetify.display.smAndDown
    }">
    <v-col cols="12" md="12" lg="12" xl="12" class="text-center" :class="{
      'pl-8 pr-8' : $vuetify.display.lgAndUp,
    }">
      <slot></slot>
    </v-col>
  </v-row>
</template>

<script>

import RedirectIfWrongPage from "@/RedirectIfWrongPage";

export default {
  name: "PageWrap",
  mounted: async function () {
    await RedirectIfWrongPage.do();
  }
}
</script>

<style scoped>

</style>
