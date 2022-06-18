const OrderItem = {
    calculateTotal: function (orderItem) {
        const quantity = orderItem.expectedQuantity || 0;
        return quantity * orderItem.expectedPrice + OrderItem.calculateTVQ(orderItem) + OrderItem.calculateTPS(orderItem);
    },
    calculateTVQ(orderItem) {
        return orderItem.hasTVQ ? orderItem.expectedPrice * 0.09975 * orderItem.expectedQuantity : 0;
    },
    calculateTPS(orderItem) {
        return orderItem.hasTPS ? orderItem.expectedPrice * 0.05 * orderItem.expectedQuantity : 0;
    },
}
export default OrderItem;
