import OrderItem from "@/OrderItem";
import MemberOrdersQuantity from "@/MemberOrdersQuantity";

const ProviderOrders = {
    groupOrderItemsByProviders: function (memberOrdersItems, isTrimmedQtysOnly) {
        isTrimmedQtysOnly = isTrimmedQtysOnly || false;
        const memberOrdersQuantity = new MemberOrdersQuantity(memberOrdersItems).buildQuantities();
        const providerNames = [];
        const providerTotals = [];
        const providerOrders = memberOrdersItems.reduce((providerOrders, orderItem) => {
            if (!providerOrders[orderItem.provider]) {
                providerNames.push(orderItem.provider);
                providerTotals[orderItem.provider] = 0;
                providerOrders[orderItem.provider] = [];
            }
            const existingProduct = providerOrders[orderItem.provider].filter((existingOrderItem) => {
                return existingOrderItem.ProductId === orderItem.ProductId
            });
            let quantity = memberOrdersQuantity[orderItem.ProductId].total
            if (isTrimmedQtysOnly && memberOrdersQuantity[orderItem.ProductId].remainingFraction === 0) {
                return providerOrders;
            }
            if (!isTrimmedQtysOnly) {
                const quantityFloored = Math.floor(quantity);
                quantity = quantityFloored;
            }
            if (existingProduct.length || quantity === 0) {
                return providerOrders;
            }
            const aggregatedItem = {
                quantity: quantity,
                tps: OrderItem.calculateTPS(
                    orderItem,
                    quantity,
                    orderItem.costUnitPrice
                ),
                tvq: OrderItem.calculateTVQ(
                    orderItem,
                    orderItem.quantity,
                    orderItem.costUnitPrice
                ),
                ProductId: orderItem.ProductId,
                costUnitPrice: orderItem.costUnitPrice,
                provider: orderItem.provider,
                name: orderItem.name,
                format: orderItem.format,
                category: orderItem.category,
                internalCode: orderItem.internalCode,
                maker: orderItem.maker
            }
            aggregatedItem.costTotal = aggregatedItem.costUnitPrice * aggregatedItem.quantity + aggregatedItem.tps + aggregatedItem.tvq;
            if (!existingProduct.length && aggregatedItem.quantity > 0) {
                providerTotals[aggregatedItem.provider] += aggregatedItem.costTotal;
                providerOrders[aggregatedItem.provider].push(aggregatedItem);
            }
            return providerOrders;
        }, {});
        return {
            providerOrders: providerOrders,
            providerNames: providerNames,
            providerTotals: providerTotals
        }
    }
}


export default ProviderOrders;
