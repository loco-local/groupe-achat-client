import I18n from "@/i18n";

const Member = {
    setupTranslation: function () {
        const text = {
            "firstname": "Prénom",
            "lastname": "Nom",
            "email": "Courriel",
            "phone1": "Téléphone",
            "phone2": "Autre téléphone",
            "address": "Adresse",
            "pronoun": "Pronom",
            "rebatePercentage": "Pourcentage de rabais sur tous items",
            pronounHint: "elle, il, iel etc",
            password: "Mot de passe"
        };
        I18n.i18next.addResources("fr", "member", text);
        I18n.i18next.addResources("en", "member", text);
    },
    format: function (member, buyGroup) {
        member.fullname = member.firstname + " " + member.lastname;
        if (member.rebates === null) {
            member.rebates = {
                percentage: {
                    number: 0
                }
            }
        }
        Member.defineSalePercentage(
            member,
            buyGroup
        )
        return member;
    },
    defineSalePercentage: function (member, buyGroup) {
        if (!buyGroup) {
            return;
        }
        member.salePercentage = buyGroup.salePercentage - member.rebates.percentage.number;
        return member.salePercentage;
    },
    isApproved: function (member) {
        if (member === null || member === undefined) {
            return false;
        }
        return member.status !== "pending" && member.status !== "disabled";
    },
    sortAlphabetically: function (members) {
        return members.sort((a, b) => {
            const aFullname = a.firstname + " " + b.lastname
            const bFullname = b.firstname + " " + b.lastname
            return aFullname.localeCompare(bFullname);
        });
    }
}
export default Member;
