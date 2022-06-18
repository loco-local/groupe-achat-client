import Service from "@/service/Service";

export default {
    getForPath: async function (buyGroupPath) {
        const response = await Service.api().get("/buy-group/path/" + buyGroupPath);
        return response.data;
    },
    getForId: async function (buyGroupId) {
        const response = await Service.api().get("/buy-group/" + buyGroupId);
        return response.data;
    },
    update: async function (buyGroupId, buyGroup) {
        await Service.api().put(
            "/buy-group/" + buyGroupId,
            buyGroup);
    }
}
