<template>
  <Page class="vh-center">
    <v-btn to="/connexion" x-large color="primary" v-if="$store.state.user === null">
      {{ $t('login') }}
    </v-btn>
    <!--    <v-btn to="/inscription" x-large class="ml-8 primary">-->
    <!--      {{$t('register')}}-->
    <!--    </v-btn>-->
  </Page>
</template>

<script>
export default {
  name: "About",
  components: {
    Page: () => import('@/components/Page'),
  },
  mounted: function () {
    if (this.$store.state.user !== null) {
      this.$router.push({
        name: 'Dashboard'
      });
    }
  }
}
</script>
