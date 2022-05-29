import Service from "@/service/Service";

export default {
    get: async function (buyGroupId, buyGroupOrderId, userId, createIfNotExist) {
        createIfNotExist = createIfNotExist | false;
        const response = await Service.api().get(
            '/buy-group/' + buyGroupId + '/buy-group-order/' +
            buyGroupOrderId + '/userOrder/' + userId
        );
        if (response.status === 204) {
            if (createIfNotExist) {
                await Service.api().post(
                    '/buy-group/' + buyGroupId + '/buy-group-order/' +
                    buyGroupOrderId + '/userOrder/' + userId
                );
            } else {
                return null;
            }
        }
        return response.data;
    },
    listForOrderId: async function (orderId) {
        const response = await Service.api().get(
            '/userOrder/' + orderId + '/items'
        );
        return response.data;
    },
    setQuantity: async function (userOrderId, productId, quantity) {
        return Service.api().post(
            '/userOrder/' + userOrderId + '/product/' + productId + '/quantity',
            {
                quantity: quantity
            }
        );
    }
}
