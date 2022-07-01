import Service from "@/service/Service";

const MemberService = {
    getForId: async function (memberId) {
        const response = await Service.api().get("/members/" + memberId);
        return response.data;
    },
    listForBuyGroupId: async function (buyGroupId) {
        const response = await Service.api().get("/members/list/" + buyGroupId);
        return response.data;
    }
};
export default MemberService;
