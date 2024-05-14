import Service from "@/service/Service";
import Member from "@/Member";

const MemberService = {
    getForId: async function (memberId) {
        let errorResponseStatus;
        let errorName;
        const response = await Service.api().get("/members/" + memberId).catch((error) => {
            errorResponseStatus = error.response.status;
            errorName = error.response.data.errorName
        })
        if (errorResponseStatus === 401 && errorName === 'needToBeAuthenticated') {
            return false;
        } else {
            return Member.format(response.data);
        }
    },
    getPublicForId: async function (memberId) {
        const response = await Service.api().get("/members/" + memberId)
        return Member.format(response.data);
    },
    update: async function (memberId, member) {
        return Service.api().put("/members/" + memberId, member);
    },
    listForBuyGroupId: async function (buyGroupId, buyGroup) {
        const response = await Service.api().get("/members/list/" + buyGroupId);
        return response.data.map((member) => {
            return Member.format(member, buyGroup);
        })
    }
};
export default MemberService;
