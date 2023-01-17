export default function MemberOrdersQuantity(memberOrderItems) {
    this.memberOrderItems = memberOrderItems;
}

MemberOrdersQuantity.prototype.buildQuantities = function (memberId, updatedQuantity, productId) {
    let isItemForUpdatedQuantityFound = updatedQuantity === undefined ? true : false;
    this.quantities = this.memberOrderItems.reduce((productQuantities, memberOrderItem) => {
        if (productQuantities[memberOrderItem.ProductId] === undefined) {
            productQuantities[memberOrderItem.ProductId] = 0;
        }
        let quantity;
        if (memberOrderItem.MemberOrder.MemberId === memberId && memberOrderItem.ProductId === productId) {
            quantity = updatedQuantity;
            isItemForUpdatedQuantityFound = true;
        } else {
            quantity = memberOrderItem.quantity;
            if (quantity === null) {
                quantity = memberOrderItem.expectedQuantity
            }
        }
        productQuantities[memberOrderItem.ProductId] = (parseFloat(quantity) + parseFloat(productQuantities[memberOrderItem.ProductId])).toFixed(2);
        return productQuantities;
    }, {})
    if (!isItemForUpdatedQuantityFound) {
        this.quantities[productId] = parseFloat(this.quantities[productId] || 0) + parseFloat(updatedQuantity);
    }
    return this.quantities;
}
MemberOrdersQuantity.prototype.getQuantities = function () {
    return this.quantities;
};
MemberOrdersQuantity.prototype.updateMemberQuantity = function (memberId, updatedQuantity, productId) {
    const productQuantities = this.buildQuantities(
        memberId, updatedQuantity, productId
    );
    return productQuantities[productId]
}
MemberOrdersQuantity.prototype.setMemberOrders = function (memberOrders) {
    this.memberOrderItems = memberOrders;
}

