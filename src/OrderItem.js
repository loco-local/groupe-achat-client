export default {
    calculateTotal: function (orderItem) {
        const quantity = orderItem.quantity || 0;
        return quantity * orderItem.price;
    }
}
