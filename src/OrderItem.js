const OrderItem = {
    calculateTotal: function (orderItem) {
        const quantity = orderItem.quantity || 0;
        return quantity * orderItem.price + OrderItem.calculateTVQ(orderItem) + OrderItem.calculateTPS(orderItem);
    },
    calculateTVQ(orderItem) {
        return orderItem.hasTVQ ? orderItem.price * 0.09975 * orderItem.quantity : 0;
    },
    calculateTPS(orderItem) {
        return orderItem.hasTPS ? orderItem.price * 0.05 * orderItem.quantity : 0;
    },
}
export default OrderItem;
