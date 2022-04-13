import Service from "@/service/Service";

export default {
    list: async function () {
        const response = await Service.api().get("/products");
        return response.data;
    }
}
