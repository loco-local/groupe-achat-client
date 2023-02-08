*
<template>
  <Page>
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
        <v-row class="vh-center">
          <v-col cols="12" sm="8" md="4" lg="3" xl="2"
                 v-for="member in members" :key="member.id"
          >
            <v-card @click="enterUpdateMemberFlow(member)" height="175">
              <v-card-title class="mb-0 pb-0">
                {{ member.fullname }}
              </v-card-title>
              <v-card-subtitle class="body-1 text-left mt-1">
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
                    outlined
                >
                  <v-icon left small>schedule</v-icon>
                  {{ $t('members:waitingApproval') }}
                </v-chip>
                <v-chip
                    class="mt-0 ml-0 mb-0"
                    outlined
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
        max-width="500px"
        v-if="editedMember !== null"
    >
      <v-card>
        <v-card-title class="text-h5">
          {{ $t('modify') }}
          <v-spacer></v-spacer>
          <v-icon @click="cancelSave">close</v-icon>
        </v-card-title>
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
                  <v-select
                      :items="status"
                      v-model="editedMember.status"
                      :label="$t('members:status')"
                      required
                      :item-text="getSelectText"
                      item-value="value"
                      :rules="[rules.required]"
                      :disabled="$store.state.user.status !== 'admin'"
                  >
                  </v-select>
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

        <v-card-actions>
          <v-btn
              color="blue darken-1"
              text
              @click="cancelSave"
          >
            {{ $t('cancel') }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              color="blue darken-1"
              @click="save"
              dark
              :loading="isSaveLoading"
              :disabled="isSaveLoading"
          >
            {{ $t('modify') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Page>
</template>

<script>
import MemberService from "@/service/MemberService";
import I18n from "@/i18n";
import Rules from '@/Rules'
import Members from "@/Member";
import BuyGroupService from "@/service/BuyGroupService";
import Member from "@/Member";

export default {
  name: "Members",
  components: {
    Page: () => import('@/components/Page')
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
      onCostPrice: "sur le prix coûtant"
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
    this.isLoading = false;
  },
  methods: {
    updateMemberSalePercentage: function () {
      Member.defineSalePercentage(
          this.editedMember,
          this.buyGroup
      );
    },
    save: async function () {
      if (!this.$refs.memberForm.validate()) {
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
