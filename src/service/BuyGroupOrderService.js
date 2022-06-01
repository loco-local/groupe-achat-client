import Service from "@/service/Service";
import {startOfDay, endOfDay} from 'date-fns'

export default {
    list: async function (buyGroupId) {
        const response = await Service.api().get("/buy-group/" + buyGroupId + "/orders");
        return response.data;
    },
    listUnfinished: async function (buyGroupId) {
        const response = await Service.api().get("/buy-group/" + buyGroupId + "/orders/unfinished");
        return response.data;
    },
    listUserOrders: async function (buyGroupId, buyGroupOrderId) {
        const response = await Service.api().get("/buy-group/" + buyGroupId + "/orders/" + buyGroupOrderId+ "/userOrders");
        return response.data;
    },
    create: async function (buyGroup) {
        buyGroup.startDate = startOfDay(buyGroup.startDate);
        buyGroup.endDate = endOfDay(buyGroup.endDate);
        return Service.api().post(
            "/buy-group-orders",
            buyGroup
        );
    },
    update: async function (buyGroup) {
        buyGroup.startDate = startOfDay(buyGroup.startDate);
        buyGroup.endDate = endOfDay(buyGroup.endDate);
        return Service.api().put(
            "/buy-group-orders/" + buyGroup.id,
            buyGroup
        );
    }
}
