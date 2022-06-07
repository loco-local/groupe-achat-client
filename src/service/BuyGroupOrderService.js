import Service from "@/service/Service";
import {startOfDay, endOfDay} from 'date-fns'
import OrderItem from "@/OrderItem";

export default {
    list: async function (buyGroupId) {
        const response = await Service.api().get("/buy-group/" + buyGroupId + "/orders");
        return response.data;
    },
    listUnfinished: async function (buyGroupId) {
        const response = await Service.api().get("/buy-group/" + buyGroupId + "/orders/unfinished");
        return response.data;
    },
    listUserOrders: async function (buyGroupId, buyGroupOrderId) {
        const response = await Service.api().get("/buy-group/" + buyGroupId + "/orders/" + buyGroupOrderId + "/userOrders");
        return response.data;
    },
    listUserOrderItems: async function (buyGroupId, buyGroupOrderId) {
        const response = await Service.api().get("/buy-group/" + buyGroupId + "/orders/" + buyGroupOrderId + "/userOrders/items");
        return response.data.map((orderItem) => {
            orderItem.name = orderItem.description;
            orderItem.orderQuantity = orderItem.quantity;
            orderItem.total = OrderItem.calculateTotal(orderItem)
            if (orderItem.UserOrder && orderItem.UserOrder.User) {
                orderItem.personFullname = orderItem.UserOrder.User.firstname + " " + orderItem.UserOrder.User.lastname;
            }
            return orderItem
        })
    },
    create: async function (buyGroup) {
        buyGroup.startDate = startOfDay(buyGroup.startDate);
        buyGroup.endDate = endOfDay(buyGroup.endDate);
        return Service.api().post(
            "/buy-group-orders",
            buyGroup
        );
    },
    update: async function (buyGroup) {
        buyGroup.startDate = startOfDay(buyGroup.startDate);
        buyGroup.endDate = endOfDay(buyGroup.endDate);
        return Service.api().put(
            "/buy-group-orders/" + buyGroup.id,
            buyGroup
        );
    }
}
