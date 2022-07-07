const Product = {
    format: function (product, salePercentage) {
        if (product.expectedUnitPrice === undefined) {
            product.expectedUnitPrice = Product.calculateUnitPrice(
                product.expectedCostUnitPrice,
                salePercentage
            );
        }
        if (product.expectedCostUnitPrice) {
            product.expectedCostUnitPrice = product.expectedCostUnitPrice.toFixed(2);
        }
        return product;
    },
    calculateUnitPrice: function (costUnitPrice, salePercentage) {
        return costUnitPrice * (1 + (salePercentage / 100));
    },
    formatInKg: function (format) {
        if(format === null){
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
