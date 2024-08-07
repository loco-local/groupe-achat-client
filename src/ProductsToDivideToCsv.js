import ExportToCsv from "@/ExportToCsv";
import I18n from "@/i18n";

const text = {
    shareComplete: "Caisse Complète",
    remain: "Il reste",
    toShare: "à partager",
    filename: "caisses-à-diviser-groupe-achat"
}
I18n.i18next.addResources("fr", "divideToCsv", text);
I18n.i18next.addResources("en", "divideToCsv", text);

const ProductsToDivideToCsv = {
    doExport: function (productsIdToDivideFiltered, productsToDivide, remainingQuantities) {
        const t = I18n.i18next.getFixedT();
        let data = [[]];
        productsIdToDivideFiltered.forEach((productId) => {
            const orders = productsToDivide[productId];
            let product = orders[0]
            let productRow = [product.description + " " + product.format + " " + product.maker + " " + product.provider]
            data.push(productRow)
            data.push(
                [Math.floor(remainingQuantities[productId].total) + " " + t('divide:completed')]
            )
            const remainingFraction = remainingQuantities[productId].remainingFraction;
            data.push([t('divideToCsv:remain') + " " + remainingFraction + " " + remainingQuantities[productId].format + " " + t('divideToCsv:toShare')])
            orders.forEach((order) => {
                data.push([
                    order.personFullname + " (" + order.MemberOrderId + ")",
                    order.quantityInput
                ])
            })
            data.push([])
            data.push([])
        })
        ExportToCsv.build(
            t('divideToCsv:filename'),
            data
        );
    }
}

export default ProductsToDivideToCsv;