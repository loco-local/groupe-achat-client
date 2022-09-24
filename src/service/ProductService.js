import Service from "@/service/Service";
import Product from "@/Product"

export default {
    listPutForward: async function (buyGroupId, salePercentage, rebates) {
        const response = await Service.api().get("/buy-group/" + buyGroupId + "/products/forward");
        return response.data.map((product) => {
            return Product.format(
                product, salePercentage, rebates
            )
        })
    },
    listDeprecated: async function (buyGroupId, salePercentage, rebates) {
        const response = await Service.api().get("/buy-group/" + buyGroupId + "/products/deprecated");
        return response.data.map((product) => {
            return Product.format(
                product, salePercentage, rebates
            )
        })
    },
    listAdminRelated: async function (buyGroupId, salePercentage, rebates) {
        const response = await Service.api().get("/buy-group/" + buyGroupId + "/products/admin-related");
        return response.data.map((product) => {
            return Product.format(
                product, salePercentage, rebates
            )
        })
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
    makeUnavailable: async function (productId) {
        return await Service.api().post(
            '/products/' + productId + "/unavailable")
    },
    createProduct: async function (product) {
        return await Service.api().post(
            '/products/',
            product
        )
    },
    internalCodeExists: async function (internalCode) {
        const response = await Service.api().post(
            '/products/internalCode/exists',
            {
                internalCode: internalCode
            }
        );
        return response.data.exists;
    },
    modifyProduct: async function (product) {
        return await Service.api().put(
            '/products/' + product.id,
            product
        )
    }
}
