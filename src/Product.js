export default {
    format: function (product) {
        if (product.costPrice) {
            product.costPrice = product.costPrice.toFixed(2);
        }
        return product;
    }
}
