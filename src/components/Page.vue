<template>
  <v-row justify="center"
         style="margin-top:64px;margin-bottom:120px;"
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
export default {
  name: "Page"
}
</script>

<style scoped>

</style>
