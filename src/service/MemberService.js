import Service from "@/service/Service";
import Member from "@/Member";

const MemberService = {
    getForId: async function (memberId) {
        let errorResponseStatus;
        const response = await Service.api().get("/members/" + memberId).catch((error) => {
            errorResponseStatus = error.response.status;
        })
        if (errorResponseStatus === 401) {
            return false;
        } else {
            return Member.format(response.data);
        }
    },
    update: async function (memberId, member) {
        return Service.api().put("/members/" + memberId, member);
    },
    listForBuyGroupId: async function (buyGroupId) {
        const response = await Service.api().get("/members/list/" + buyGroupId);
        return response.data.map(Member.format)
    }
};
export default MemberService;
