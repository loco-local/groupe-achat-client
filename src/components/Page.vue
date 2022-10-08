<template>
  <v-row justify="center"
         style="margin-bottom:120px;"
         class="mt-16"
         :class="{
          'pl-4 pr-4' : $vuetify.breakpoint.smAndDown
    }">
    <v-col cols="12" md="12" lg="12" xl="12" class="text-center" :class="{
      'pl-8 pr-8' : $vuetify.breakpoint.lgAndUp
    }">
      <slot></slot>
    </v-col>
  </v-row>
</template>

<script>

import RedirectIfWrongPage from "@/RedirectIfWrongPage";

export default {
  name: "Page",
  mounted: async function () {
    await RedirectIfWrongPage.do();
  }
}
</script>

<style scoped>

</style>
