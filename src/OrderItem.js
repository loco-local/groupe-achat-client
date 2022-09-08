const OrderItem = {
    calculateTotal: function (orderItem, expectedQuantity, expectedUnitPrice, quantity, unitPrice) {
        let finalQuantity;
        if (quantity === null) {
            finalQuantity = expectedQuantity || 0
        } else {
            finalQuantity = quantity || 0;
        }
        let price;
        if (unitPrice === null) {
            price = expectedUnitPrice || 0;
        } else {
            price = unitPrice || 0;
        }
        return finalQuantity * price + OrderItem.calculateTVQ(
            orderItem,
            finalQuantity,
            price
        ) + OrderItem.calculateTPS(
            orderItem,
            finalQuantity,
            price
        );
    },
    calculateTVQ(orderItem, quantity, price) {
        return orderItem.hasTVQ ? price * 0.09975 * quantity : 0;
    },
    calculateTPS(orderItem, quantity, price) {
        return orderItem.hasTPS ? price * 0.05 * quantity : 0;
    },
    getQty(orderItem) {
        return orderItem.quantity === null ? orderItem.expectedQuantity : orderItem.quantity;
    }
}
export default OrderItem;
