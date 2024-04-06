import {endOfDay, startOfDay} from 'date-fns'

const STATUS = {
    CURRENT: "CURRENT",
    FINISHED: "FINISHED",
    TO_COME: "TO_COME"
}
const GroupOrder = {
    STATUS: STATUS,
    format: function (groupOrder) {
        groupOrder.startDate = new Date(groupOrder.startDate);
        groupOrder.endDate = new Date(groupOrder.endDate);
        groupOrder.status = GroupOrder.calculateStatus(groupOrder);
        return groupOrder;
    },
    calculateStatus: function (groupOrder) {
        const today = startOfDay(new Date());
        const startDate = startOfDay(groupOrder.startDate);
        const endDate = endOfDay(groupOrder.endDate);
        if (startDate <= today && endDate >= today) {
            return STATUS.CURRENT
        }
        if (endDate < today) {
            return STATUS.FINISHED
        }
        return STATUS.TO_COME;
    },
    isCurrent: function (groupOrder) {
        return GroupOrder.calculateStatus(groupOrder) === STATUS.CURRENT;
    },
    mostRelevantUnfinishedOrder: function (orders) {
        return GroupOrder.sortByMostRelevantOrders(orders)[0];
    },
    sortByMostRelevantOrders: function (orders) {
        return orders.sort((a, b) => {
            if (a.status === STATUS.CURRENT) {
                return -1;
            }
            if (b.status === STATUS.CURRENT) {
                return 1
            }
            return b.startDate - a.startDate;
        })
    },
    latestOrder: function (orders) {
        return orders.sort((a, b) => {
            return b.endDate - a.endDate;
        })[0];
    },
}

export default GroupOrder;
