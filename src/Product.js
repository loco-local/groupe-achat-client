const Product = {
    format: function (product, salePercentage) {
        if (product.expectedPrice === undefined) {
            product.expectedPrice = Product.calculatePrice(
                product.expectedCostPrice,
                salePercentage
            );
        }
        if (product.expectedCostPrice) {
            product.expectedCostPrice = product.expectedCostPrice.toFixed(2);
        }
        return product;
    },
    calculatePrice: function (costPrice, salePercentage) {
        return costPrice * (1 + (salePercentage / 100));
    }
}
export default Product;
