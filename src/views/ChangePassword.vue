<template>
  <PageWrap width="small">
    <v-row class="vh-center">
      <v-col>
        <v-card class="pt-16" flat color="transparent">
          <v-card-text>
            <v-form ref="changePasswordForm">
              <v-alert v-model="changePasswordSuccess" type="success" color="primary" :title="$t('password:success')">
              </v-alert>
              <v-alert v-model="changePasswordError" type="error" :title="$t('password:expired')"></v-alert>
              <v-text-field
                  v-model="newPassword"
                  :label="$t('password:newPassword')"
                  :rules="[Rules.min8Char, Rules.required]"
                  :type="showPassword1 ? 'text' : 'password'"
                  :append-icon="showPassword1 ? 'visibility' : 'visibility_off'"
                  @click:append="showPassword1 = !showPassword1"
              ></v-text-field>
              <v-text-field
                  v-model="repeatPassword"
                  :label="$t('password:repeat')"
                  :rules="[Rules.min8Char, Rules.required]"
                  :type="showPassword2 ? 'text' : 'password'"
                  :append-icon="showPassword2 ? 'visibility' : 'visibility_off'"
                  @click:append="showPassword2 = !showPassword2"
              ></v-text-field>
              <v-btn
                  color="primary"
                  @click="changePassword()"
                  :disabled="waiting"
                  class="ml-0"
              >
                {{ $t("change") }}
              </v-btn>
              <div class="mt-4">
                <router-link to="/connexion">
                  {{ $t('login') }}
                </router-link>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </PageWrap>
</template>
<script>
import I18n from "@/i18n";
import Rules from "@/Rules";
import AuthenticateService from "@/service/AuthenticateService";
import PageWrap from "../components/PageWrap.vue";

export default {
  name: "ChangePassword",
  components: {PageWrap},
  data: function () {
    I18n.i18next.addResources("fr", "password", {
      title: "Modification de mot de passe",
      success: "Mot de passe modifié",
      newPassword: "Nouveau mot de passe",
      repeat: "Répéter le mot de passe",
      expired: "Vous ne pouvez plus modifier votre mot de passe à l'aide de ce lien, veuillez faire une nouvelle demande.",
    });
    I18n.i18next.addResources("en", "password", {
      title: "Send email to change your password",
      success: "Password changed",
      newPassword: "New password",
      repeat: "Retype password",
      expired: "You can no longer change your password using this link, please make a new request.",
    });
    return {
      valid: true,
      newPassword: "",
      repeatPassword: "",
      Rules: Rules,
      changePasswordSuccess: false,
      changePasswordError: false,
      waiting: false,
      showPassword1: false,
      showPassword2: false
    };
  },
  mounted: async function () {
    this.newPassword = "";
    this.repeatPassword = "";
    this.changePasswordSuccess = false;
    this.changePasswordError = false;
  },
  methods: {
    changePassword: async function () {
      this.changePasswordSuccess = false;
      this.changePasswordError = false;
      const formValidation = await this.$refs.changePasswordForm.validate()
      if (!formValidation.valid) {
        return
      }
      this.waiting = true;
      try {
        await AuthenticateService.changePassword(
            this.newPassword,
            this.$route.params.token
        );
        this.changePasswordSuccess = true;
      } catch {
        this.changePasswordError = true;
      }
    },
  },
};
</script>
