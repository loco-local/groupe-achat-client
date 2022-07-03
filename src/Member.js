import I18n from "@/i18n";

const Member = {
    setupTranslation: function () {
        I18n.i18next.addResources("fr", "member", {
            "firstname": "Prénom",
            "lastname": "Nom",
            "email": "Courriel",
            "phone1": "Téléphone",
            "phone2": "Autre téléphone",
            "address": "Adresse",
            "pronoun": "Pronom à utiliser",
            "rebatePercentage": "Pourcentage de rabais sur tous items",
            pronounHint: "elle, il, iel etc"
        });
        I18n.i18next.addResources("en", "member", {
            "firstname": "Prénom",
            "lastname": "Nom",
            "email": "Courriel",
            "phone1": "Téléphone",
            "phone2": "Autre téléphone",
            "address": "Adresse",
            "pronoun": "Pronom à utiliser",
            "rebatePercentage": "Pourcentage de rabais sur tous items",
            pronounHint: "elle, il, iel etc"
        });
    },
    format: function (member) {
        member.fullname = member.firstname + " " + member.lastname;
        if (member.rebates === null) {
            member.rebates = {
                percentage: {
                    number: 0
                }
            }
        }
        return member;
    }
}
export default Member;
