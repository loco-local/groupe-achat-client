<template>
  <PageWrap class="vh-center">
    <v-btn to="/connexion" x-large color="primary" v-if="$store.state.user === null">
      {{ $t('login') }}
    </v-btn>
    <!--    <v-btn to="/inscription" x-large class="ml-8 primary">-->
    <!--      {{$t('register')}}-->
    <!--    </v-btn>-->
  </PageWrap>
</template>

<script>
export default {
  name: "AboutApp",
  components: {
    PageWrap: () => import('@/components/PageWrap'),
  },
  mounted: function () {
    if (this.$store.state.user !== null) {
      this.$router.push({
        name: 'DashboardPage'
      });
    }
  }
}
</script>
