import BuyGroupOrderService from "@/service/BuyGroupOrderService";
import OrderItem from "@/OrderItem";

export default {
    getOrderItemsForEachProvider: async function (buyGroupId, buyGroupOrderId) {
        const userOrdersItems = await BuyGroupOrderService.listMemberOrderItems(
            buyGroupId,
            buyGroupOrderId
        );
        const providerNames = [];
        const providerTotals = [];
        const providerOrders = userOrdersItems.reduce((providerOrders, orderItem) => {
            if (!providerOrders[orderItem.provider]) {
                providerNames.push(orderItem.provider);
                providerTotals[orderItem.provider] = 0;
                providerOrders[orderItem.provider] = [];
            }
            const existingProduct = providerOrders[orderItem.provider].filter((existingOrderItem) => {
                return existingOrderItem.ProductId === orderItem.ProductId
            });
            orderItem.quantity = OrderItem.getQty(orderItem);
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
            if (existingProduct.length) {
                console.log(existingProduct[0].costTotal + " " + orderItem.costTotal)
                existingProduct[0].quantity = OrderItem.getQty(existingProduct[0]) + orderItem.quantity;
                existingProduct[0].tps = existingProduct[0].tps + orderItem.tps;
                existingProduct[0].tvq = existingProduct[0].tvq + orderItem.tvq;
                existingProduct[0].costTotal = existingProduct[0].costTotal + orderItem.costTotal;
            } else {
                providerOrders[orderItem.provider].push(orderItem);
            }
            providerTotals[orderItem.provider] += orderItem.costTotal;
            return providerOrders;
        }, {});
        return {
            providerOrders: providerOrders,
            providerNames: providerNames,
            providerTotals: providerTotals
        }
    }
}
