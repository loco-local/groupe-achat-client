import I18n from "@/i18n";

export default {
    setup: function () {
        I18n.i18next.addResources("fr", "product", {
            name: "Nom",
            format: "Format",
            qtyInBox: "Qté dans boîte",
            price: "Prix",
            category: "Catégorie",
            internalCode: "Code interne",
            maker: "Fabricant",
            provider: "Fournisseur",
            isAvailable: "Est disponible",
            isTaxable: "Est taxable"
        });
        I18n.i18next.addResources("en", "product", {
            name: "Nom",
            format: "Format",
            qtyInBox: "Qté dans boîte",
            price: "Prix",
            category: "Catégorie",
            internalCode: "Code interne",
            maker: "Fabricant",
            provider: "Fournisseur",
            isAvailable: "Est disponible",
            isTaxable: "Est taxable"
        });
    }
}
