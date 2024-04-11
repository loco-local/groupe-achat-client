import QuantityInterpreter from "@/QuantityInterpreter";

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
        return orderItem.quantity === null || orderItem.quantity === undefined ? orderItem.expectedQuantity : orderItem.quantity;
    },
    getSafeQty(quantity) {
        if (!OrderItem.isQtyDefined(quantity)) {
            return 0;
        }
        return quantity;
    },
    isQtyDefined(quantity) {
        return quantity !== null && quantity !== undefined
    },
    defineQuantitiesFraction(orderItem) {
        OrderItem.defineExpectedQuantityFraction(orderItem);
        OrderItem.defineQuantityFraction(orderItem);
    },
    defineExpectedQuantityFraction(orderItem) {
        OrderItem.defineExpectedOrFinalQuantityFraction(
            orderItem,
            true
        );
    },
    defineQuantityFraction(orderItem) {
        OrderItem.defineExpectedOrFinalQuantityFraction(
            orderItem,
            false
        );
    },
    defineExpectedOrFinalQuantityFraction(orderItem, isForExpectedQuantity) {
        const propertyName = isForExpectedQuantity ? 'expectedQuantity' : 'quantity'
        let decimalQuantity = orderItem[propertyName]
        const quantities = OrderItem.getQuantities(
            orderItem,
            decimalQuantity
        );
        const inputPropertyName = propertyName + 'Input';
        orderItem[inputPropertyName] = quantities.inFormatQuantity;
        orderItem[propertyName] = quantities.decimalQuantity;
    },
    getQuantities: function (orderItem, decimalQuantity) {
        let inFormatQuantity;
        let percentageQuantity = 100;
        const productFormat = QuantityInterpreter.getFormat(orderItem.format);
        if (productFormat === "unit") {
            inFormatQuantity = decimalQuantity;
        } else {
            inFormatQuantity = QuantityInterpreter.convertDecimalToFraction(
                decimalQuantity,
                orderItem
            ) + " " + productFormat;
            percentageQuantity = Math.round(decimalQuantity * 100);
        }
        return {
            decimalQuantity,
            inFormatQuantity,
            percentageQuantity
        }
    }
}
export default OrderItem;
