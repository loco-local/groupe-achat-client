*
<template>
  <PageWrap>
    <v-row v-if="isLoading" class="mt-12">
      <v-col cols="12">
        <v-progress-circular
            indeterminate
            size="64"
        ></v-progress-circular>
      </v-col>
    </v-row>
    <v-row v-else class="">
      <v-col cols="12">
        <h2 class="mt-8 mb-8">
          {{ $t('members:title') }}
        </h2>
        <v-row>
          <v-col cols="12" class="vh-center">
            <v-btn
                v-clipboard="emailsOfMembers()"
                v-clipboard:success="copyEmailsSuccess"
            >
              <v-icon start>
                content_copy
              </v-icon>
              {{ $t('members:emailCopy') }}
            </v-btn>
          </v-col>
        </v-row>
        <v-row class="vh-center">
          <v-col cols="12" sm="8" md="4" lg="3" xl="2"
                 v-for="member in members" :key="member.id"
          >
            <v-card @click="enterUpdateMemberFlow(member)" height="175">
              <v-card-title class="mb-0 pb-0">
                {{ member.fullname }}
              </v-card-title>
              <v-card-subtitle class="text-body-1 text-left mt-1"
                               :class="{
                  'green--text font-weight-bold' : member.salePercentage < buyGroup.salePercentage
                }"
              >
                <strong>
                  {{ member.salePercentage }}%
                </strong>
                {{ $t('members:appliedPercentage') }}
              </v-card-subtitle>
              <v-card-subtitle class="text-left">
                <v-chip
                    v-if="member.status==='pending'"
                    class="ma-2"
                    icon="clock"
                    color="red"
                    variant="outlined"
                >
                  <v-icon start size="small">schedule</v-icon>
                  {{ $t('members:waitingApproval') }}
                </v-chip>
                <v-chip
                    class="mt-0 ml-0 mb-0"
                    variant="outlined"
                    label
                    v-if="member.status==='admin'"
                >
                  {{ $t('members:administrator') }}
                </v-chip>
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog
        v-model="editMemberDialog"
        max-width="600px"
        v-if="editedMember !== null"
    >
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="text-h5 text-medium-emphasis ps-2">
            {{ $t('modify') }}
          </div>
          <v-icon icon="close" @click="cancelSave" variant="text"></v-icon>
        </v-card-title>
        <v-divider class="mb-4"></v-divider>
        <v-card-text>
          <v-container>
            <v-form name="memberForm" ref="memberForm">
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
                    lg="4"
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
                    lg="5"
                >
                  <v-select
                      :items="status"
                      v-model="editedMember.status"
                      :label="$t('members:status')"
                      required
                      :item-title="getSelectText"
                      item-value="value"
                      :rules="[rules.required]"
                      :disabled="$store.state.user.status !== 'admin'"
                  >
                  </v-select>
                </v-col>
                <v-col
                    cols="12"
                    lg="3"
                >
                  <v-text-field
                      v-model="editedMember.id"
                      :label="$t('members:internalId')"
                      disabled

                  ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                >
                  <h3>
                    Rabais
                  </h3>
                </v-col>
                <v-col
                    cols="12"
                >
                  <v-text-field
                      v-model="editedMember.rebates.percentage.number"
                      :label="$t('member:rebatePercentage')"
                      type="number"
                      prefix="%"
                      :hint="editedMember.salePercentage + ' % ' + $t('members:onCostPrice')"
                      persistent-hint
                      @change="updateMemberSalePercentage"
                      :rules="[
                          rules.lowerOrEqualTo(editedMember.rebates.percentage.number, 10),
                          rules.greaterOrEqualTo(editedMember.rebates.percentage.number, 0)
                          ]"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-divider class="mt-2"></v-divider>
        <v-card-actions class="my-2 d-flex justify-end">
          <v-btn
              variant="text"
              @click="cancelSave"
          >
            {{ $t('cancel') }}
          </v-btn>
          <v-btn
              color="primary"
              @click="save"
              :loading="isSaveLoading"
              :disabled="isSaveLoading"
          >
            {{ $t('modify') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
        v-model="emailCopySnackbar"
        location="top"
        :timeout="7000"
    >
        <span class="text-body-1">
          {{ $t('members:emailsCopied') }}
        </span>
      <template v-slot:actions>
        <v-btn
            color="white"
            variant="text"
            @click="emailCopySnackbar = false"
        >
          {{ $t('close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </PageWrap>
</template>

<script>
import MemberService from "@/service/MemberService";
import I18n from "@/i18n";
import Rules from '@/Rules'
import Members from "@/Member";
import BuyGroupService from "@/service/BuyGroupService";
import Member from "@/Member";
import PageWrap from "@/components/PageWrap";

export default {
  name: "MembersAdmin",
  components: {
    PageWrap: PageWrap
  },
  data: function () {
    Members.setupTranslation();
    const text = {
      title: "Membres du groupe",
      noRebates: "Aucuns rabais",
      waitingApproval: "En attente d'approbation",
      status: "Status",
      administrator: "Administrateur",
      appliedPercentage: "sur le prix coûtant",
      onCostPrice: "sur le prix coûtant",
      internalId: "ID interne",
      emailCopy: "Copier les courriels des membres",
      emailsCopied: "Courriels copiés dans votre presse-papier"
    };
    I18n.i18next.addResources("fr", "members", text);
    I18n.i18next.addResources("en", "members", text);
    return {
      isLoading: false,
      members: [],
      editMemberDialog: false,
      editedMember: null,
      buyGroup: null,
      rules: Rules,
      originalEditMemberValues: null,
      isSaveLoading: false,
      emailCopySnackbar: false,
      status: [
        {
          value: "member"
        },
        {
          value: "admin"
        },
        {
          value: "disabled"
        },
        {
          value: "pending",
          disabled: true
        }
      ],
    }
  },
  mounted: async function () {
    this.isLoading = true;
    this.buyGroup = await BuyGroupService.getForId(this.$store.state.user.BuyGroupId);
    this.members = await MemberService.listForBuyGroupId(this.$store.state.user.BuyGroupId, this.buyGroup);
    this.members = Member.sortAlphabetically(this.members);
    this.isLoading = false;
  },
  methods: {
    emailsOfMembers: function () {
      return this.members.map((member) => {
        return member.firstname + " " + member.lastname + " <" + member.email + ">"
      }).join(", ");
    },
    copyEmailsSuccess: function () {
      this.emailCopySnackbar = true;
    },
    updateMemberSalePercentage: function () {
      Member.defineSalePercentage(
          this.editedMember,
          this.buyGroup
      );
    },
    save: async function () {
      const formValidation = await this.$refs.memberForm.validate()
      if (!formValidation.valid) {
        return
      }
      this.isSaveLoading = true;
      await MemberService.update(this.editedMember.id, this.editedMember);
      this.isSaveLoading = false;
      this.editMemberDialog = false;
    },
    cancelSave: function () {
      this.editedMember.firstname = this.originalEditMemberValues.firstname;
      this.editedMember.lastname = this.originalEditMemberValues.lastname;
      this.editedMember.email = this.originalEditMemberValues.email;
      this.editedMember.phone1 = this.originalEditMemberValues.phone1;
      this.editedMember.phone2 = this.originalEditMemberValues.phone2;
      this.editedMember.address = this.originalEditMemberValues.address;
      this.editedMember.pronoun = this.originalEditMemberValues.pronoun;
      this.editedMember.rebates = this.originalEditMemberValues.rebates
      this.editMemberDialog = false;
    },
    enterUpdateMemberFlow: function (member) {
      this.originalEditMemberValues = {...member};
      this.originalEditMemberValues.rebates = JSON.parse(JSON.stringify(member.rebates))
      this.editedMember = member;
      this.editMemberDialog = true;
    },
    getSelectText: function (item) {
      return this.$t(item.value);
    }
  }
}
</script>

<style scoped>

</style>
