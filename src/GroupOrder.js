const STATUS = {
    CURRENT: "CURRENT",
    FINISHED: "FINISHED",
    TO_COME: "TO_COME"
}
const GroupOrder = {
    format: function (groupOrder) {
        groupOrder.startDate = new Date(groupOrder.startDate);
        groupOrder.endDate = new Date(groupOrder.endDate);
        groupOrder.status = GroupOrder.calculateStatus(groupOrder);
        return groupOrder;
    },
    calculateStatus: function (groupOrder) {
        const today = new Date();
        if (groupOrder.startDate < today) {
            return STATUS.CURRENT
        }
        if (groupOrder.endDate < today) {
            return STATUS.FINISHED
        }
        return STATUS.TO_COME;
    },
    mostRelevantUnfinishedOrder: function (orders) {
        return orders.sort((a, b) => {
            if (a.status === STATUS.CURRENT) {
                return 1;
            }
            if (b.status === STATUS.CURRENT) {
                return -1
            }
            return a.startDate - b.startDate;
        })[0];
    },
}

export default GroupOrder;
