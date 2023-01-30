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
        if (quantity === null || quantity === undefined) {
            return 0;
        }
        return quantity;
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
        const inputPropertyName = propertyName + 'Input';
        const percentagePropertyName = propertyName + 'Percentage';
        let inputStr = String(orderItem[inputPropertyName]);
        if (orderItem[inputPropertyName] !== undefined) {
            let format = QuantityInterpreter.getFormat(inputStr);
            if (format === "unit") {
                orderItem[propertyName] = QuantityInterpreter.getQty(inputStr);
            } else {
                orderItem[propertyName] = QuantityInterpreter.convertFractionToDecimal(
                    QuantityInterpreter.getQty(inputStr),
                    orderItem
                )
            }
        }
        const productFormat = QuantityInterpreter.getFormat(orderItem.format);
        if (productFormat === "unit") {
            orderItem[inputPropertyName] = orderItem[propertyName];
        } else {
            orderItem[inputPropertyName] = QuantityInterpreter.convertDecimalToFraction(
                orderItem[propertyName],
                orderItem
            ) + " " + productFormat;
            orderItem[percentagePropertyName] = Math.round(orderItem[propertyName] * 100);
            let hint;
            if (orderItem[propertyName] % 1 === 0) {
                hint = orderItem[propertyName] + "x";
            } else {
                hint = (percentagePropertyName <= 0 ? "" : orderItem[percentagePropertyName] + "%");
            }
            orderItem[propertyName + 'Hint'] = hint
        }
    }
}
export default OrderItem;
