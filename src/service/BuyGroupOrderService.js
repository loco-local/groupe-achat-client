import Service from "@/service/Service";

export default {
    list: async function (buyGroupId) {
        const response = await Service.api().get("/buy-group-orders/" + buyGroupId);
        return response.data;
    },
    create: async function (buyGroup) {
        return Service.api().post(
            "/buy-group-orders",
            buyGroup
        );
    },
    update: async function (buyGroup) {
        return Service.api().put(
            "/buy-group-orders/" + buyGroup.id,
            buyGroup
        );
    }
}
