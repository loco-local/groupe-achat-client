import BuyGroupOrderService from "@/service/BuyGroupOrderService";

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
            providerOrders[orderItem.provider].push(orderItem);
            return providerOrders;
        }, {});
        return {
            providerOrders: providerOrders,
            providerNames: providerNames,
            providerTotals: providerTotals
        }
    }
}
