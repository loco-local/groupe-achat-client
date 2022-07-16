import Service from "@/service/Service";

export default {
    listForBuyGroupOrder: async function (buyGroupId, buyGroupOrderId) {
        const response = await Service.api().get(
            '/buy-group/' + buyGroupId + '/buy-group-order/' +
            buyGroupOrderId + '/fees-for-all-bills'
        );
        return response.data;
    },
    setQuantity: async function (quantity, buyGroupId, buyGroupOrderId, productId) {
        const response = await Service.api().post(
            '/buy-group/' + buyGroupId + '/buy-group-order/' +
            buyGroupOrderId + '/fees-for-all-bills/product/' + productId + '/quantity',
            {
                quantity: quantity
            }
        );
        return response.data;
    }
}
