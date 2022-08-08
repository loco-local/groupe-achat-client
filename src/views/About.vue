<template>
  <Page class="vh-center">
    <v-btn to="/connexion" x-large color="primary">
      {{$t('login')}}
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
  }
}
</script>
