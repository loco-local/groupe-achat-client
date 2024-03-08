<template>
  <PageWrap class="vh-center">
    <v-btn to="/connexion" size="x-large" color="primary" v-if="$store.state.user === null">
      {{ $t('login') }}
    </v-btn>
    <!--    <v-btn to="/inscription" x-large class="ml-8 primary">-->
    <!--      {{$t('register')}}-->
    <!--    </v-btn>-->
  </PageWrap>
</template>

<script>
import PageWrap from '@/components/PageWrap'
export default {
  name: "AboutApp",
  components: {
    PageWrap: PageWrap
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
