<template>
  <v-row justify="center"
         style="margin-bottom:120px;"
         class="mt-16 align-content-center"
         :class="{
          'pl-4 pr-4' : $vuetify.display.smAndDown
    }">
    <v-col cols="12" :md="mdCol" :lg="lgCol" :xl="xlCol" :class="{
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
  props: {
    width: {
      type: String,
      default: "fullWidth"
    },
  },
  data: function () {
    return {
      mdCol: 10,
      lgCol: 7,
      xlCol: 6,
    }
  },
  mounted: async function () {
    if (this.width === 'fullWidth') {
      this.mdCol = 12;
      this.lgCol = 12;
      this.xlCol = 12;
    }
    if (this.width === 'small') {
      this.mdCol = 8;
      this.lgCol = 5;
      this.xlCol = 4;
    }
    await RedirectIfWrongPage.do();
  }
}
</script>

<style scoped>

</style>
