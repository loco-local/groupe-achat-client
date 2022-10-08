<template>
  <v-row
      align="center"
      justify="center"
      :class="{
        'pl-4 pr-4 mb-12': $vuetify.breakpoint.smAndDown,
        'pt-8 pb-8' : $vuetify.breakpoint.mdAndUp
      }"
  >

    <v-col cols="12" md="10" lg="9" xl="6" class="text-left mt-8">
      <div v-if="isLoading">
        <v-progress-circular
            :width="2"
            :size="80"
            indeterminate
        ></v-progress-circular>
      </div>
      <div v-if="isPendingRegistrationFlow && !isLoading">
        <v-alert
            shaped
            outlined
            type="success"
        >
          {{ $t('register:completed') }}.
        </v-alert>
      </div>
      <div v-if="!isLoading && !isPendingRegistrationFlow">
        <v-card flat>
          <v-card-title>
            {{ $t('register:title') }}
            -
            {{ $t('register:group') }}
            {{ buyGroup.name }}
          </v-card-title>
          <v-card-text>
            <v-form name="registerForm" ref="registerForm">
              <v-row>
                <v-col
                    cols="12"
                    lg="6"
                >
                  <v-text-field
                      v-model="editedMember.firstname"
                      :label="$t('member:firstname')"
                      :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                    lg="6"
                >
                  <v-text-field
                      v-model="editedMember.lastname"
                      :label="$t('member:lastname')"
                      :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                >
                  <v-text-field
                      v-model="editedMember.email"
                      :label="$t('member:email')"
                      :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                    lg="6"
                >
                  <v-text-field
                      v-model="editedMember.phone1"
                      :label="$t('member:phone1')"
                      :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                    lg="6"
                >
                  <v-text-field
                      v-model="editedMember.phone2"
                      :label="$t('member:phone2')"
                  ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                >
                  <v-text-field
                      v-model="editedMember.address"
                      :label="$t('member:address')"
                      :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                    lg="6"
                >
                  <v-text-field
                      v-model="editedMember.pronoun"
                      :label="$t('member:pronoun')"
                      :rules="[rules.required]"
                      :hint="$t('member:pronounHint')"
                      persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                    lg="6"
                >
                  <v-text-field
                      v-model="editedMember.password"
                      :label="$t('member:password')"
                      :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" large @click="register" :loading="registerLoading" :disabled="registerLoading">
              {{ $t('register:register') }}
            </v-btn>
          </v-card-actions>
        </v-card>

        <!--      <RecaptchaInfo></RecaptchaInfo>-->
      </div>
    </v-col>
  </v-row>
</template>

<script>
import Rules from '@/Rules'
import Members from "@/Member";
import I18n from "@/i18n";
import BuyGroupService from "@/service/BuyGroupService";
import AuthenticateService from "@/service/AuthenticateService";
import RedirectIfWrongPage from "@/RedirectIfWrongPage";

export default {
  name: "Register",
  components: {},
  data: function () {
    Members.setupTranslation();
    const text = {
      title: "Inscription",
      register: "S'inscrire",
      group: "Groupe",
      completed: "Merci pour votre inscription ! Un super bénévole devrait vous contacter lorsque votre compte sera activé. Si cela tarde, n'hésitez pas à recontacter les responsables"
    };
    I18n.i18next.addResources("fr", "register", text);
    I18n.i18next.addResources("en", "register", text);
    return {
      isLoading: true,
      rules: Rules,
      editedMember: {},
      registerLoading: false,
      buyGroup: null,
      isPendingRegistrationFlow: false
    }
  },
  mounted: async function () {
    const isRedirect = await RedirectIfWrongPage.do();
    if (isRedirect) {
      return;
    }
    this.isLoading = true;
    this.buyGroup = await BuyGroupService.getForPath(
        this.$route.params.buyGroup
    );
    this.editedMember.BuyGroupId = this.buyGroup.id;
    this.isLoading = false;
  },
  methods: {
    register: async function () {
      if (!this.$refs.registerForm.validate()) {
        return
      }
      this.registerLoading = true;
      const response = await AuthenticateService.register(this.editedMember);
      await this.$store.dispatch('setToken', response.data.token);
      await this.$store.dispatch('setUser', response.data.member);
      await this.$nextTick();
      await this.$router.push({
        name: 'Dashboard'
      });
      this.isPendingRegistrationFlow = true;
      this.registerLoading = false;
    }
  }
}
</script>

<style scoped>

</style>
