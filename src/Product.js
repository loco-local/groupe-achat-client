export default {
    format: function (product) {
        if (product.price) {
            product.price = product.price.toFixed(2);
        }
        return product;
    },
    buildTotal: function (product) {
        const quantity = product.orderQuantity || 0;
        product.total = quantity * product.price;
    }
}
