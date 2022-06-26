import I18n from "@/i18n";

export default {
    setup: function () {
        I18n.i18next.addResources("fr", "product", {
            name: "Nom",
            format: "Format",
            qty: "Qté",
            qtyShortFinal: "Qté Finale",
            expectedQuantityShort: "Qté Prévue",
            qtyInBox: "Qté dans boîte",
            expectedPrice: "Prix Unitaire Prévu",
            price: "Prix Unitaire Final",
            expectedCostPrice: "Prix Coûtant Prévu",
            costPrice: "Prix Coûtant Final",
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
            total: "Total",
            totalFinal: "Total Final",
            expectedTotal: "Total Prévu"
        });
        I18n.i18next.addResources("en", "product", {
            name: "Nom",
            format: "Format",
            qty: "Qté",
            qtyShortFinal: "Qté Finale",
            expectedQuantityShort: "Qté Prévue",
            qtyInBox: "Qté dans boîte",
            expectedPrice: "Prix Unitaire Prévu",
            price: "Prix Unitaire Final",
            expectedCostPrice: "Prix Coûtant Prévu",
            costPrice: "Prix Coûtant Final",
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
            total: "Total",
            totalFinal: "Total Final",
            expectedTotal: "Total Prévu"
        });
    }
}
