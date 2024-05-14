import QuantityInterpreter from "@/QuantityInterpreter";

export default function MemberOrdersQuantity(memberOrderItems) {
    this.memberOrderItems = memberOrderItems;
}

MemberOrdersQuantity.prototype.buildQuantities = function () {
    this.quantities = this.memberOrderItems.reduce((totals, memberOrderItem) => {
        if (totals[memberOrderItem.ProductId] === undefined) {
            totals[memberOrderItem.ProductId] = {
                total: 0,
                memberOrderItem: memberOrderItem,
                orderItems: []
            };
        }
        let quantity;
        quantity = memberOrderItem.quantity;
        if (quantity === null || quantity === undefined) {
            quantity = memberOrderItem.expectedQuantity
        }
        totals[memberOrderItem.ProductId].orderItems.push({
            quantity: quantity,
            item: memberOrderItem
        });
        totals[memberOrderItem.ProductId].total = parseFloat(quantity) + parseFloat(totals[memberOrderItem.ProductId].total);
        return totals;
    }, {})
    this.quantities = Object.values(this.quantities).reduce((quantities, quantity) => {
        let remainingDecimal = 1 - quantity.total % 1;
        if (remainingDecimal === 1) {
            remainingDecimal = 0;
        }
        const format = QuantityInterpreter.getFormat(quantity.memberOrderItem.format);
        quantities[quantity.memberOrderItem.ProductId] = {
            total: quantity.total,
            totalInFraction: QuantityInterpreter.convertDecimalToFraction(
                quantity.total, quantity.memberOrderItem
            ),
            remainingFraction: QuantityInterpreter.convertDecimalToFraction(
                remainingDecimal, quantity.memberOrderItem
            ),
            remainingDecimal,
            format: format,
            orderItems: quantity.orderItems
        }
        return quantities;
    }, {});
    return this.quantities;
};
MemberOrdersQuantity.prototype.updateMemberQuantity = function (memberId, updatedQuantity, orderItem) {
    const productQuantities = this.buildQuantities(
        memberId, updatedQuantity, orderItem
    );
    return productQuantities[orderItem.ProductId]
}
MemberOrdersQuantity.prototype.getAllMembersQuantityForProductId = function (productId) {
    return this.quantities[productId];
}
MemberOrdersQuantity.prototype.updateMemberOrder = function (memberOrderItem) {
    const index = this.memberOrderItems.findIndex((orderItem) => {
        return orderItem.MemberOrder.MemberId === memberOrderItem.MemberOrder.MemberId &&
            orderItem.ProductId === memberOrderItem.ProductId;
    })
    if (index === -1) {
        this.memberOrderItems.push(memberOrderItem);
    } else {
        this._replaceOrderItemAtIndex(index, memberOrderItem);
    }
}
MemberOrdersQuantity.prototype._replaceOrderItemAtIndex = function (index, memberOrderItem) {
    const ret = this.memberOrderItems.slice(0);
    ret[index] = memberOrderItem;
    this.memberOrderItems = ret;
}

