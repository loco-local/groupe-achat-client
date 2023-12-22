import OrderItem from "@/OrderItem";
import MemberOrdersQuantity from "@/MemberOrdersQuantity";

const ProviderOrders = {
    groupOrderItemsByProviders: function (memberOrdersItems, isTrimmedQtysOnly) {
        isTrimmedQtysOnly = isTrimmedQtysOnly || false;
        const memberOrdersQuantity = new MemberOrdersQuantity(memberOrdersItems).buildQuantities();
        const providerNames = [];
        const providerTotals = [];
        const providerOrders = memberOrdersItems.reduce((providerOrders, orderItem) => {
            if (!providerOrders[orderItem.provider]) {
                providerNames.push(orderItem.provider);
                providerTotals[orderItem.provider] = 0;
                providerOrders[orderItem.provider] = [];
            }
            const existingProduct = providerOrders[orderItem.provider].filter((existingOrderItem) => {
                return existingOrderItem.ProductId === orderItem.ProductId
            });
            orderItem.quantity = OrderItem.getQty(orderItem);
            if (isTrimmedQtysOnly && memberOrdersQuantity[orderItem.ProductId].remainingFraction === 0) {
                return providerOrders;
            }
            if (!isTrimmedQtysOnly) {
                const quantityFloored = Math.floor(orderItem.quantity);
                orderItem.quantity = quantityFloored;
            }
            orderItem.tps = OrderItem.calculateTPS(
                orderItem,
                orderItem.quantity,
                orderItem.costUnitPrice
            );
            orderItem.tvq = OrderItem.calculateTVQ(
                orderItem,
                orderItem.quantity,
                orderItem.costUnitPrice
            );
            orderItem.costTotal = orderItem.costUnitPrice * orderItem.quantity + orderItem.tps + orderItem.tvq;
            providerTotals[orderItem.provider] += orderItem.costTotal;
            // console.log("quantity " + orderItem.quantity + " total " + orderItem.costTotal + " big total " + providerTotals[orderItem.provider])
            if (existingProduct.length) {
                existingProduct[0].quantity = OrderItem.getQty(existingProduct[0]) + orderItem.quantity;
                existingProduct[0].tps = existingProduct[0].tps + orderItem.tps;
                existingProduct[0].tvq = existingProduct[0].tvq + orderItem.tvq;
                existingProduct[0].costTotal = existingProduct[0].costTotal + orderItem.costTotal;
            } else {
                if (orderItem.quantity > 0) {
                    providerOrders[orderItem.provider].push(orderItem);
                }
            }
            return providerOrders;
        }, {});
        return {
            providerOrders: providerOrders,
            providerNames: providerNames,
            providerTotals: providerTotals
        }
    }
}


export default ProviderOrders;
