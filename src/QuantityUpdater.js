import MemberOrderService from "@/service/MemberOrderService";
import OrderItem from "@/OrderItem";

const api = {
    buildForFinalQuantity: function (memberOrdersQuantities, userOrdersItems, table) {
        return new QuantityUpdater(memberOrdersQuantities, userOrdersItems, true, table)
    },
    buildForExpectedQuantity: function (memberOrdersQuantities, userOrdersItems, table) {
        return new QuantityUpdater(memberOrdersQuantities, userOrdersItems, false, table)
    }
}

function QuantityUpdater(memberOrdersQuantities, orderItems, isForFinalQuantity, table) {
    this.memberOrdersQuantities = memberOrdersQuantities;
    this.orderItems = orderItems;
    this.isForFinalQuantity = isForFinalQuantity;
    this.table = table;
    this.rebuildTotals();
}

QuantityUpdater.prototype.update = async function (updatedProduct) {
    let orderItem = this.orderItems.filter((orderItem) => {
        return orderItem.ProductId === updatedProduct.id;
    });
    const isNewItem = !orderItem.length;
    if (isNewItem) {
        orderItem = {...updatedProduct};
        orderItem.ProductId = updatedProduct.id;
        if (this.isForFinalQuantity) {
            orderItem.quantity = 0;
        } else {
            orderItem.expectedQuantity = 0;
        }
    } else {
        orderItem = orderItem[0];
    }
    if (this.isForFinalQuantity) {
        orderItem.quantity = updatedProduct.quantity;
    } else {
        orderItem.expectedQuantity = updatedProduct.expectedQuantity;
    }
    let prices;
    if (this.isForFinalQuantity) {
        prices = await MemberOrderService.setQuantity(
            updatedProduct.MemberOrderId,
            updatedProduct.id,
            orderItem.quantity
        )
    } else {
        prices = await MemberOrderService.setExpectedQuantity(
            updatedProduct.MemberOrderId,
            updatedProduct.id,
            orderItem.expectedQuantity
        )
    }
    orderItem.totalAfterRebateWithTaxes = prices.totalAfterRebateWithTaxes;
    orderItem.tps = prices.tps;
    orderItem.tvq = prices.tvq;
    if (this.isForFinalQuantity) {
        orderItem.totalAfterRebateWithTaxes = updatedProduct.totalAfterRebateWithTaxes = parseFloat(prices.totalAfterRebateWithTaxes);
        orderItem.totalAfterRebate = updatedProduct.totalAfterRebate = parseFloat(prices.totalAfterRebate);
        updatedProduct.quantity = prices.quantity;
        updatedProduct.costUnitPrice = prices.costUnitPrice;
        updatedProduct.unitPrice = prices.unitPrice;
        updatedProduct.unitPriceAfterRebate = prices.unitPriceAfterRebate;
    } else {
        orderItem.expectedTotalAfterRebateWithTaxes = updatedProduct.expectedTotalAfterRebateWithTaxes = parseFloat(prices.expectedTotalAfterRebateWithTaxes);
        orderItem.expectedTotalAfterRebate = updatedProduct.expectedTotalAfterRebate = parseFloat(prices.expectedTotalAfterRebate);
        updatedProduct.expectedQuantity = orderItem.expectedQuantity = prices.expectedQuantity;
    }
    OrderItem.defineQuantitiesFraction(updatedProduct)
    orderItem.expectedQuantityInput = updatedProduct.expectedQuantityInput;
    orderItem.quantityInput = updatedProduct.quantityInput;
    updatedProduct.tps = prices.tps;
    updatedProduct.tvq = prices.tvq;
    if (isNewItem) {
        this.orderItems.push(
            orderItem
        )
    }
    orderItem.MemberOrder = {
        MemberId: this.member.id
    }
    this.memberOrdersQuantities.updateMemberOrder(orderItem);
    this.memberOrdersQuantities.buildQuantities();
    updatedProduct.allMembersQuantity = this.memberOrdersQuantities.getAllMembersQuantityForProductId(updatedProduct.id);
    this.rebuildTotals();
    this.buildItemsToDivide();
    this.buildOrderItemsAsProducts();
    await this.table.showQuantityChangedSuccess();
}

QuantityUpdater.prototype.rebuildTotals = function () {
    this.orderTotals = this.orderItems.reduce((totals, orderItem) => {
        let orderItemTotal = (orderItem.totalAfterRebateWithTaxes === null || orderItem.totalAfterRebateWithTaxes === undefined) ?
            orderItem.expectedTotalAfterRebateWithTaxes : orderItem.totalAfterRebateWithTaxes;
        orderItem.total = orderItemTotal = parseFloat(orderItemTotal);
        let orderItemTotalBeforeTaxes = (orderItem.totalAfterRebate === null || orderItem.totalAfterRebate === undefined) ?
            orderItem.expectedTotalAfterRebate : orderItem.totalAfterRebate;
        totals.total = parseFloat((orderItemTotal || 0.0) + totals.total);
        totals.subTotal = parseFloat((orderItemTotalBeforeTaxes || 0.0) + totals.subTotal);
        totals.tps = parseFloat((orderItem.tps || 0.0) + totals.tps);
        totals.tvq = parseFloat((orderItem.tvq || 0.0) + totals.tvq);
        return totals;
    }, {
        subTotal: 0.0,
        tps: 0.0,
        tvq: 0.0,
        total: 0.0,
    })
}
QuantityUpdater.prototype.getTotals = function () {
    return this.orderTotals;
}
export default api;
