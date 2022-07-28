import I18n from "@/i18n";

export default {
    setup: function () {
        const text = {
            title: "Votre groupe",
            name: "Nom",
            path: "Chemin dans l'url",
            salePercentage: "Pourcentage de vente",
            additionalFees: "Frais additionels",
            howToPay: "Comment payer"
        };
        I18n.i18next.addResources("fr", "group", text);
        I18n.i18next.addResources("en", "group", text);
    }
}
