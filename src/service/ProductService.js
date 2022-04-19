import Service from "@/service/Service";

export default {
    listPutForward: async function () {
        const response = await Service.api().get("/products/forward");
        return response.data;
    },
    listDeprecated: async function () {
        const response = await Service.api().get("/products/deprecated");
        return response.data;
    },
    putForward: async function (products) {
        await Service.api().post(
            "/products/forward",
            products.map((product) => {
                return {
                    id: product.id
                }
            })
        );
    },
    deprecate: async function (products) {
        await Service.api().post(
            "/products/deprecate",
            products.map((product) => {
                return {
                    id: product.id
                }
            })
        );
    },
    uploadSatauProducts: async function (formData) {
        const response = await Service.api().post('/products/upload/provider/satau', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return response.data;
    },
    acceptImport: async function (uploadId) {
        const response = await Service.api().post('/products/upload/' + uploadId + "/accept")
        return response.data;
    },
    makeAvailable: async function (productId) {
        return await Service.api().post(
            '/products/' + productId + "/available")
    },
    makeUnavailable: async function(productId){
        return await Service.api().post(
            '/products/' + productId + "/unavailable")
    }
}
