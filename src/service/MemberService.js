import Service from "@/service/Service";

const MemberService = {
    getForId: async function (memberId) {
        const response = await Service.api().get("/members/" + memberId);
        return response.data;
    }
};
export default MemberService;
