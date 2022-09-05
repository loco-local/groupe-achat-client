import {format, startOfDay} from 'date-fns'

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
        groupOrder.startDateFormattedForInput = format(groupOrder.startDate, "yyyy-MM-dd")
        groupOrder.endDateFormattedForInput = format(groupOrder.endDate, "yyyy-MM-dd")
        groupOrder.status = GroupOrder.calculateStatus(groupOrder);
        return groupOrder;
    },
    calculateStatus: function (groupOrder) {
        const today = startOfDay(new Date());
        if (groupOrder.startDate <= today && groupOrder.endDate >= today) {
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
    latestOrder: function (orders) {
        return orders.sort((a, b) => {
            return b.endDate - a.endDate;
        })[0];
    },
}

export default GroupOrder;
