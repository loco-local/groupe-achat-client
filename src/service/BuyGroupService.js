import Service from "@/service/Service";

export default {
    getForPath: async function (buyGroupPath) {
        const response = await Service.api().get("/buy-group/path/" + buyGroupPath);
        return response.data;
    }
}
