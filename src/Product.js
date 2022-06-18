export default {
    format: function (product, salePercentage) {
        if (product.expectedPrice === undefined) {
            product.expectedPrice = product.costPrice * (1 + (salePercentage / 100))
        }
        if (product.costPrice) {
            product.costPrice = product.costPrice.toFixed(2);
        }
        return product;
    }
}
