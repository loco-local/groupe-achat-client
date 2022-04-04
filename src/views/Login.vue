<template>
  <v-row
      align="center"
      justify="center"
      :class="{
        'pl-4 pr-4 mb-12': $vuetify.breakpoint.smAndDown,
        'pt-8 pb-8' : $vuetify.breakpoint.mdAndUp
      }"
  >
    <v-col cols="12" md="10" lg="9" xl="6" class="text-left">
      <v-form ref="loginForm">
        <v-alert
            :value="wrongLogin"
            type="error"
        >
          {{ $t('login:wrongLogin') }}
        </v-alert>
        <v-alert
            :value="userDisabledMessage"
            type="error"
        >
          {{ $t('login:userDisabled') }}
        </v-alert>
        <v-text-field
            v-model="user.email"
            :label="$t('login:email')"
            :rules="[Rules.required]"
            required
        ></v-text-field>
        <v-text-field
            v-model="user.password"
            :rules="[Rules.required]"
            required
            :label="$t('login:password')"
            type="password"
        ></v-text-field>
        <v-btn
            color="primary"
            class="mr-4 pull-left"
            @click="login"
        >
          {{ $t('login:loginBtn') }}
        </v-btn>
        <div class="mt-4">
          <router-link to="/send-change-password-email">
            {{ $t('login:forgotPassword') }}
          </router-link>
        </div>
      </v-form>
      <!--      <RecaptchaInfo></RecaptchaInfo>-->
    </v-col>
  </v-row>
</template>

<script>
import LoadingFlow from "@/LoadingFlow";
import AuthenticateService from "@/service/AuthenticateService";
import Rules from "@/Rules";
import I18n from "@/i18n";
// import Vue from 'vue'
// import {VueReCaptcha} from "vue-recaptcha-v3"

export default {
  name: "Login",
  // components: {
  //   RecaptchaInfo: () => import('@/components/RecaptchaInfo')
  // },
  data: function () {
    I18n.i18next.addResources("en", "login", {
      email: 'Email',
      password: 'Password',
      loginBtn: "Login",
      wrongLogin: "Pas le bon courriel ou mot de passe, essayez de nouveau. Il se peut aussi que votre compte soit désactivé",
      userDisabled: "Votre compte est désactivé",
      forgotPassword: "Forgot password"
    });
    I18n.i18next.addResources("fr", "login", {
      email: 'Courriel',
      password: 'Mot de passe',
      loginBtn: "Connecter",
      wrongLogin: "Pas le bon courriel ou mot de passe, essayez de nouveau. Il se peut aussi que votre compte soit désactivé",
      userDisabled: "Votre compte est désactivé",
      forgotPassword: "Mot de passe oublié"
    });
    return {
      wrongLogin: false,
      userDisabledMessage: false,
      Rules: Rules,
      user: {
        email: "",
        password: ""
      },
    };
  },
  methods: {
    login: async function () {
      this.wrongLogin = false;
      this.userDisabledMessage = false;
      this.robotDoubt = false;
      if (!this.$refs.loginForm.validate()) {
        return;
      }
      LoadingFlow.enter();
      await this.$store.dispatch('setUser', null);
      let recaptchaToken = "";
      // let recaptchaToken = await this.$recaptcha("login");
      AuthenticateService.login(this.user, recaptchaToken).then((response) => {
        this.handleLoginResponse(response);
      }).catch((response) => {
        console.log(response);
        if (response.response.data.reason === "recaptcha score") {
          this.robotDoubt = true;
        } else if (response.response.data.error === " disabled") {
          this.userDisabledMessage = true;
        } else {
          this.wrongLogin = true;
        }
        LoadingFlow.leave();
      });
    },
    handleLoginResponse: async function (response) {
      await this.$store.dispatch('setToken', response.data.token);
      await this.$store.dispatch('setUser', response.data.user);
      this.$emit('flow-is-done');
      await this.$nextTick();
      await this.$router.push({
        name: 'Admin'
      });
      // this.$recaptchaInstance.hideBadge();
      LoadingFlow.leave();
    }
  }
}
</script>

<style scoped>

</style>
