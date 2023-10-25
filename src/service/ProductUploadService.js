import Service from "@/service/Service";

export default {
    uploadSatauProducts: async function (formData) {
        const response = await Service.api().post('/products/upload/provider/satau', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return response.data;
    },
    sendHNProducts: async function (textBlock) {
        const response = await Service.api().post('/products/upload/provider/hn', {
            textBlock: textBlock
        })
        return response.data;
    },
    changeAssociations: async function (providerName, associations) {
        const response = await Service.api().post('/products/provider/' + providerName + "/import-associations",
            {
                associations: associations
            }
        )
        return response;
    },
    acceptImport: async function (uploadId, haveAssociationsChanged) {
        const response = await Service.api().post(
            '/products/upload/' + uploadId + "/accept",
            {
                haveAssociationsChanged: haveAssociationsChanged
            }
        )
        return response.data;
    },
    refuseImport: async function () {

    },
}
