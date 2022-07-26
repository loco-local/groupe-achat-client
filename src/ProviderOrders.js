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
            providerTotals[orderItem.provider] += orderItem.totalAfterRebateWithTaxes;
            const existingProduct = providerOrders[orderItem.provider].filter((existingOrderItem) => {
                return existingOrderItem.ProductId === orderItem.ProductId
            });
            if (existingProduct.length) {
                existingProduct[0].quantity = OrderItem.getQty(existingProduct[0]) + OrderItem.getQty(orderItem);
            } else {
                providerOrders[orderItem.provider].push(orderItem);
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
