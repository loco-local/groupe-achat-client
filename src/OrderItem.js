const OrderItem = {
    calculateTotal: function (orderItem, quantity, price) {
        quantity = quantity || 0;
        return quantity * price + OrderItem.calculateTVQ(
            orderItem,
            quantity,
            price
        ) + OrderItem.calculateTPS(
            orderItem,
            quantity,
            price
        );
    },
    calculateTVQ(orderItem, quantity, price) {
        return orderItem.hasTVQ ? price * 0.09975 * quantity : 0;
    },
    calculateTPS(orderItem, quantity, price) {
        return orderItem.hasTPS ? price * 0.05 * quantity : 0;
    },
    getQty(orderItem){
        return orderItem.quantity === null ? orderItem.expectedQuantity : orderItem.quantity;
    }
}
export default OrderItem;
