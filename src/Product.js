import I18n from "@/i18n";
import ProductTranslation from "@/ProductTranslation";

ProductTranslation.setup();
const Product = {
    format: function (product, salePercentage, rebates) {
        const unitPrices = Product.calculateUnitPrices(
            product.expectedCostUnitPrice,
            salePercentage,
            rebates
        );
        if (product.expectedUnitPrice === undefined) {
            product.expectedUnitPrice = unitPrices.unitPrice;
            product.expectedUnitPriceAfterRebate = unitPrices.unitPriceAfterRebate;
        }
        if (product.unitPrice === undefined) {
            product.unitPrice = unitPrices.unitPrice;
            product.unitPriceAfterRebate = unitPrices.unitPriceAfterRebate;
        }
        if (product.expectedCostUnitPrice) {
            product.expectedCostUnitPrice = product.expectedCostUnitPrice.toFixed(2);
        }
        if (product.qtyInBox === null || product.qtyInBox === undefined) {
            product.qtyInBox = 1;
        }
        if (product.category === null) {
            const t = I18n.i18next.getFixedT();
            product.category = t("product:noCategory")
        }
        product.quantity = product.expectedQuantity;
        product.expectedQuantityPercentage = 0;
        return product;
    },
    calculateUnitPrices: function (costUnitPrice, salePercentage, rebates) {
        let salePercentageAfterRebate = salePercentage;
        if (rebates && rebates.percentage && rebates.percentage.number) {
            salePercentageAfterRebate = Math.max(salePercentage - rebates.percentage.number, 0);
        }
        return {
            unitPrice: costUnitPrice * (1 + (salePercentage / 100)),
            unitPriceAfterRebate: costUnitPrice * (1 + (salePercentageAfterRebate / 100))
        }
    },
    formatInKg: function (format) {
        if (format === null) {
            return -1;
        }
        format = format.toLowerCase().replace(/\s/g, "");
        const numbers = format.match(/[+-]?([0-9]*[.])?[0-9]+/)
        if (numbers === null || !numbers.length) {
            return -1;
        }
        let quantity = numbers[0].trim();
        const measureUnit = format.substring(quantity.toString().length).trim();
        if (measureUnit === "g" || measureUnit === "ml") {
            quantity = quantity / 1000;
        } else if (measureUnit !== "kg" && measureUnit !== "l") {
            return -1;
        }
        return quantity;
    }
}
export default Product;
