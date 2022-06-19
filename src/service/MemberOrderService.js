import Service from "@/service/Service";

export default {
    get: async function (buyGroupId, buyGroupOrderId, userId, createIfNotExist) {
        createIfNotExist = createIfNotExist | false;
        let response = await Service.api().get(
            '/buy-group/' + buyGroupId + '/buy-group-order/' +
            buyGroupOrderId + '/memberOrder/' + userId
        );
        if (response.status === 204) {
            if (createIfNotExist) {
                response = await Service.api().post(
                    '/buy-group/' + buyGroupId + '/buy-group-order/' +
                    buyGroupOrderId + '/memberOrder/' + userId
                );
            } else {
                return null;
            }
        }
        return response.data;
    },
    listForOrderId: async function (orderId) {
        const response = await Service.api().get(
            '/memberOrder/' + orderId + '/items'
        );
        return response.data;
    },
    setExpectedQuantity: async function (memberOrderId, productId, expectedQuantity) {
        return Service.api().post(
            '/memberOrder/' + memberOrderId + '/product/' + productId + '/quantity/expected',
            {
                expectedQuantity: expectedQuantity
            }
        );
    },
    setQuantity: async function (memberOrderId, productId, quantity) {
        return Service.api().post(
            '/memberOrder/' + memberOrderId + '/product/' + productId + '/quantity',
            {
                quantity: quantity
            }
        );
    },
}
