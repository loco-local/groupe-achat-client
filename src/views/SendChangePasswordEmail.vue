<template>
  <PageWrap width="small">
    <div>
      <h2>{{ $t('forgotP:title') }}</h2>
      <v-alert color="primary" type="success" icon="check_circle" :value="true" v-if="emailSent">
        {{ $t('forgotP:sent') }}
      </v-alert>
      <div>
        <v-form ref="resetPasswordForm">
          <v-text-field
              name="email"
              :label="$t('forgotP:email')"
              required
              type="email"
              :rules="[rules.required, rules.email]"
              v-model="email"
          ></v-text-field>
        </v-form>
      </div>
      <v-alert v-if="error !== null" icon="priority_high" value="true" color="error" class="bg-error" theme="dark">
        {{ error }}
      </v-alert>
      <v-alert v-if="emailDoesNotExist" icon="priority_high" value="true" color="error" class="bg-error" theme="dark">
        {{ $t('forgotP:courrielInexistant') }}
      </v-alert>
      <v-btn
          @click="send"
          theme="dark"
          color="primary"
          class="mt-2"
      >
        {{ $t('forgotP:send') }}
      </v-btn>
    </div>
  </PageWrap>
</template>

<script>
import i18n from '@/i18n'
import Rules from '@/Rules'
import AuthenticateService from "@/service/AuthenticateService";
import RedirectIfWrongPage from "@/RedirectIfWrongPage";
import PageWrap from '@/components/PageWrap'

export default {
  name: 'SendChangePasswordEmail',
  components: {PageWrap},
  data: function () {
    i18n.i18next.addResources('fr', 'forgotP', {
      title: 'Envoi du courriel pour modifier son mot de passe',
      email: 'courriel',
      send: 'Envoyer',
      sent: 'Vérifiez votre boîte courriel pour un lien pour modifier votre mot de passe',
      courrielInexistant: "Pas d'usagers avec ce courriel"
    });
    i18n.i18next.addResources('en', 'forgotP', {
      title: 'Send change password email',
      email: 'email',
      send: 'Send',
      sent: 'Check your email inbox for a link to change your password',
      courrielInexistant: "Pas d'usagers avec ce courriel"
    });
    return {
      email: '',
      emailSent: false,
      error: null,
      rules: Rules,
      emailDoesNotExist: false
    }
  },
  methods: {
    send: async function () {
      this.error = null;
      this.emailDoesNotExist = false;
      this.emailSent = false;
      const formValidation = await this.$refs.resetPasswordForm.validate()
      if (!formValidation.valid) {
        return
      }
      AuthenticateService.resetPassword(this.email).then(() => {
        this.emailSent = true;
      }).catch((error) => {
        if (error.response.status === 400) {
          this.emailDoesNotExist = true;
        } else {
          this.error = error.response.data
        }
      });
    }
  },
  mounted: async function () {
    const isRedirect = await RedirectIfWrongPage.do();
    if (isRedirect) {
      return;
    }
  }
}
</script>
