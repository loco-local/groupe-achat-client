import I18n from "@/i18n";

export default {
    setup: function () {
        I18n.i18next.addResources("fr", "product", {
            name: "Nom",
            format: "Format",
            qty: "Qté",
            qtyInBox: "Qté dans boîte",
            price: "Prix",
            expectedPrice: "Prix Prévu",
            costPrice: "Prix Coûtant",
            category: "Catégorie",
            internalCode: "Code interne",
            maker: "Fabricant",
            provider: "Fournisseur",
            isAvailable: "Est disponible",
            hasTPS: "+ TPS",
            hasTVQ: "+ TVQ",
            personName: "Personne",
            order: "Commande",
            tps: "TPS",
            tvq: "TVQ",
            addTVQ: "+ TVQ",
            addTPS: "+ TPS",
            totalWithTaxes: "Total avec tx",
            totalWithoutTaxes: "Total avant tx",
            expectedTotal: "Total prévu"
        });
        I18n.i18next.addResources("en", "product", {
            name: "Nom",
            format: "Format",
            qty: "Qté",
            qtyInBox: "Qté dans boîte",
            price: "Prix",
            expectedPrice: "Prix Prévu",
            costPrice: "Prix Coûtant",
            category: "Catégorie",
            internalCode: "Code interne",
            maker: "Fabricant",
            provider: "Fournisseur",
            isAvailable: "Est disponible",
            hasTPS: "+ TPS",
            hasTVQ: "+ TVQ",
            personName: "Personne",
            order: "Commande",
            tps: "TPS",
            tvq: "TVQ",
            addTPS: "Ajouter TPS",
            addTVQ: "Ajouter TVQ",
            totalWithTaxes: "Total avec tx",
            totalWithoutTaxes: "Total avant tx",
            expectedTotal: "Total prévu"
        });
    }
}
