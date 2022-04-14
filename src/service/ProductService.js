import Service from "@/service/Service";

export default {
    list: async function () {
        const response = await Service.api().get("/products");
        return response.data;
    },
    uploadSatauProducts: async function (formData) {
        const response = await Service.api().post('/products/upload/provider/satau', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return response.data;
    },
}
