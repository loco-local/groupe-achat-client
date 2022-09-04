export default function MemberOrdersQuantity(memberOrders) {
    this.memberOrders = memberOrders;
}

MemberOrdersQuantity.prototype.buildQuantities = function (memberId, updatedQuantity, productId) {
    this.quantities = this.memberOrders.reduce((productQuantities, memberOrderItem) => {
        if (productQuantities[memberOrderItem.ProductId] === undefined) {
            productQuantities[memberOrderItem.ProductId] = 0;
        }
        let quantity;
        if (memberOrderItem.MemberOrder.MemberId === memberId && memberOrderItem.ProductId === productId) {
            quantity = updatedQuantity;
        } else {
            quantity = memberOrderItem.quantity;
            if (quantity === null) {
                quantity = memberOrderItem.expectedQuantity
            }
        }
        productQuantities[memberOrderItem.ProductId] = parseFloat(quantity) + parseFloat(productQuantities[memberOrderItem.ProductId]);
        return productQuantities;
    }, {})
    return this.quantities;
}
MemberOrdersQuantity.prototype.getQuantities = function () {
    return this.quantities;
};
MemberOrdersQuantity.prototype.updateMemberQuantity = function (memberId, updatedQuantity, productId) {
    const productQuantities = this.buildQuantities(
        memberId, updatedQuantity, productId
    );
    return productQuantities[productId];
}
MemberOrdersQuantity.prototype.setMemberOrders = function (memberOrders) {
    this.memberOrders = memberOrders;
}

