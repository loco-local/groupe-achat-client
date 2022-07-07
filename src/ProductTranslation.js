import I18n from "@/i18n";

export default {
    setup: function () {
        const text = {
            name: "Nom",
            format: "Format",
            qty: "Qté",
            qtyShortFinal: "Qté Finale",
            expectedQuantityShort: "Qté Prévue",
            qtyInBox: "Qté dans boîte",
            expectedUnitPrice: "Prix Unitaire Prévu",
            unitPrice: "Prix Unitaire Final",
            expectedCostUnitPrice: "Prix Coûtant Prévu",
            costUnitPrice: "Prix Coûtant Final",
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
        };
        I18n.i18next.addResources("fr", "product", text);
        I18n.i18next.addResources("en", "product", text);
    }
}
