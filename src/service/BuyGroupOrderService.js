import Service from "@/service/Service";
import {endOfDay, startOfDay} from 'date-fns'
import OrderItem from "@/OrderItem";
import GroupOrder from "@/GroupOrder";


const BuyGroupOrderService = {
    list: async function (buyGroupId) {
        const response = await Service.api().get("/buy-group/" + buyGroupId + "/orders");
        return response.data.map((groupOrder) => {
            return GroupOrder.format(groupOrder)
        });
    },
    listUnfinished: async function (buyGroupId) {
        const response = await Service.api().get("/buy-group/" + buyGroupId + "/orders/unfinished");
        return response.data.map((groupOrder) => {
            return GroupOrder.format(groupOrder)
        });
    },
    listMemberOrders: async function (buyGroupId, buyGroupOrderId) {
        const response = await Service.api().get("/buy-group/" + buyGroupId + "/orders/" + buyGroupOrderId + "/memberOrders");
        return response.data;
    },
    listMemberOrderItems: async function (buyGroupId, buyGroupOrderId) {
        const response = await Service.api().get("/buy-group/" + buyGroupId + "/orders/" + buyGroupOrderId + "/memberOrders/items");
        return BuyGroupOrderService._formattedOrderItems(
            response.data
        );
    },
    listMemberOrdersItemsQuantities: async function (buyGroupId, buyGroupOrderId) {
        const response = await Service.api().get("/buy-group/" + buyGroupId + "/orders/" + buyGroupOrderId + "/memberOrders/items/quantities");
        return response.data;
    },
    listOrderItemsOfMember: async function (buyGroupId, buyGroupOrderId, memberId) {
        const response = await Service.api().get(
            "/buy-group/" + buyGroupId + "/orders/" + buyGroupOrderId + "/member/" + memberId + " /order-items"
        );
        return BuyGroupOrderService._formattedOrderItems(
            response.data
        );
    },
    _formattedOrderItems: function (orderItems) {
        return orderItems.map((orderItem) => {
            orderItem.name = orderItem.description;
            orderItem.previousCostUnitPrice = orderItem.costUnitPrice;
            orderItem.total = OrderItem.calculateTotal(
                orderItem,
                orderItem.expectedQuantity,
                orderItem.expectedUnitPrice,
                orderItem.quantity,
                orderItem.costUnitPrice
            )
            if (orderItem.MemberOrder && orderItem.MemberOrder.Member) {
                orderItem.personFullname = orderItem.MemberOrder.Member.firstname + " " + orderItem.MemberOrder.Member.lastname
            }
            if (orderItem.quantity === null) {
                orderItem.quantity = orderItem.expectedQuantity;
            }
            if (orderItem.unitPrice === null) {
                orderItem.unitPrice = orderItem.expectedUnitPriceAfterRebate;
            }
            if (orderItem.totalAfterRebateWithTaxes === null) {
                orderItem.totalAfterRebateWithTaxes = orderItem.expectedTotalAfterRebateWithTaxes;
            }
            if (orderItem.costUnitPrice === null) {
                orderItem.costUnitPrice = orderItem.expectedCostUnitPrice.toFixed(2);
            }
            if (orderItem.qtyInBox === null) {
                orderItem.qtyInBox = 1;
            }
            OrderItem.defineQuantitiesFraction(orderItem);
            orderItem.previousExpectedQuantityInput = orderItem.expectedQuantityInput;
            orderItem.previousQuantityInput = orderItem.quantityInput;
            return orderItem
        })
    },
    create: async function (buyGroupOrder, buyGroupId) {
        buyGroupOrder.startDate = startOfDay(buyGroupOrder.startDate);
        buyGroupOrder.endDate = endOfDay(buyGroupOrder.endDate);
        return Service.api().post(
            "/buy-group/" + buyGroupId + "/orders",
            buyGroupOrder
        );
    },
    update: async function (buyGroup, buyGroupId) {
        buyGroup.startDate = startOfDay(buyGroup.startDate);
        buyGroup.endDate = endOfDay(buyGroup.endDate);
        return Service.api().put(
            "/buy-group/" + buyGroupId + "/orders/" + buyGroup.id,
            buyGroup
        );
    },
    getById: async function (id, buyGroupId) {
        const response = await Service.api().get(
            "/buy-group/" + buyGroupId + "/orders/" + id
        );
        return response.data;
    }
}
export default BuyGroupOrderService;
