import Service from "@/service/Service";
import {startOfDay, endOfDay} from 'date-fns'

export default {
    list: async function (buyGroupId) {
        const response = await Service.api().get("/buy-group-orders/" + buyGroupId);
        return response.data;
    },
    listUnfinished: async function (buyGroupId) {
        const response = await Service.api().get("/buy-group-orders/" + buyGroupId + "/unfinished");
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
