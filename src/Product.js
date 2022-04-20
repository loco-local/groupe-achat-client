export default {
    format: function (product) {
        if (product.price) {
            product.price = product.price.toFixed(2);
        }
        return product;
    }
}
