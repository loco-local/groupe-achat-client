import I18n from "@/i18n";
import ExportToCsv from "@/ExportToCsv";
import ProductTranslation from "@/ProductTranslation";

ProductTranslation.setup();
const PROVIDER_ORDER_COLUMNS = [
    "quantity",
    "costTotal",
    "tps",
    "tvq",
    "name",
    "format",
    "qtyInBox",
    "costUnitPrice",
    "category",
    "internalCode",
    "maker",
    "provider"
];
const MEMBER_ORDER_COLUMNS = [
    "expectedQuantity",
    "quantity",
    "expectedTotal",
    "totalAfterRebateWithTaxes",
    "tps",
    "tvq",
    "totalAfterRebate",
    "name",
    "format",
    "qtyInBox",
    "expectedUnitPrice",
    "unitPrice",
    "category",
    "internalCode",
    "maker",
    "provider"
];
const OrderToCsv = {
    exportForProviderOrder: function (items, total) {
        OrderToCsv._buildForProviderOrMemberOrder(
            items,
            false,
            {
                total: total
            }
        );
    },
    exportForMemberOrder: function (items, buyGroupOrder) {
        OrderToCsv._buildForProviderOrMemberOrder(
            items,
            true,
            {
                buyGroupOrder: buyGroupOrder
            }
        );
    },
    _buildForProviderOrMemberOrder: function (items, isForMember, optionalData) {
        if (items.length === 0) {
            return;
        }
        let total = optionalData.total;
        if (total === undefined) {
            const memberOrder = items[0].MemberOrder;
            total = memberOrder.total || memberOrder.expectedTotal;
        }
        const t = I18n.i18next.getFixedT();
        let columns = isForMember ? MEMBER_ORDER_COLUMNS : PROVIDER_ORDER_COLUMNS;
        let data = [[]];
        columns.forEach((column) => {
            data[0].push(t(
                OrderToCsv._getLabelKeyForColumn(
                    column
                ))
            );
        })
        let fileName = isForMember ? items[0].personFullname : items[0].provider;
        fileName += ".csv";
        items.forEach((item) => {
            data.push(
                columns.map((columnName) => {
                    return OrderToCsv._getValueForColumn(columnName, item)
                })
            );
        });
        data.push(OrderToCsv._buildEmptyLine(columns));
        let lastLine = OrderToCsv._buildEmptyLine(columns);
        lastLine.pop();
        lastLine.pop();
        lastLine.push(t('total'));
        lastLine.push(total);
        data.push(lastLine)
        if (optionalData.buyGroupOrder && optionalData.buyGroupOrder.howToPay !== null) {
            data.push(OrderToCsv._buildEmptyLine(columns));
            let line = OrderToCsv._buildEmptyLine(columns);
            line.pop();
            line.unshift(optionalData.buyGroupOrder.howToPay)
            data.push(line);
        }
        if (optionalData.buyGroupOrder && optionalData.buyGroupOrder.comment !== null) {
            data.push(OrderToCsv._buildEmptyLine(columns));
            let line = OrderToCsv._buildEmptyLine(columns);
            line.pop();
            line.unshift(optionalData.buyGroupOrder.comment)
            data.push(line);
        }
        // console.log(JSON.stringify(data))
        ExportToCsv.build(fileName, data);
    },
    _getLabelKeyForColumn: function (column) {
        switch (column) {
            case "quantity" :
                return 'product:qtyShortFinal'
            case "expectedQuantity" :
                return 'product:expectedQuantityShort';
            case "totalAfterRebateWithTaxes":
                return 'product:totalFinal';
            case "totalAfterRebate" :
                return "product:totalWithoutTaxes"
            case "costTotal":
                return 'product:totalFinal';
            case "costUnitPrice":
                return 'product:costUnitPriceForProvider'
            default:
                return 'product:' + column;
        }
    },
    _getValueForColumn: function (column, item) {
        switch (column) {
            case "expectedQuantity" :
                return (item.expectedQuantity || 0).toLocaleString()
            case "quantity" :
                return (
                    item.quantity === undefined || item.quantity === null ? item.expectedQuantity : item.quantity
                ).toLocaleString();
            case "expectedTotalAfterRebateWithTaxes" :
                return (item.expectedTotalAfterRebateWithTaxes || 0).toFixed(2).toLocaleString();
            case "totalAfterRebateWithTaxes" :
                return (
                    item.totalAfterRebateWithTaxes === undefined || item.totalAfterRebateWithTaxes === null ?
                        item.expectedTotalAfterRebateWithTaxes || 0 : item.totalAfterRebateWithTaxes
                ).toFixed(2).toLocaleString();
            case "costTotal":
                return (item.costTotal || 0).toFixed(2).toLocaleString();
            case "tps" :
                return (item.tps || 0).toFixed(2).toLocaleString();
            case "tvq" :
                return (item.tvq || 0).toFixed(2).toLocaleString();
            case "totalAfterRebate" :
                return (
                    item.totalAfterRebate === undefined || item.totalAfterRebate === null ?
                        item.expectedTotalAfterRebate || 0 : item.totalAfterRebate
                ).toFixed(2).toLocaleString();
            case "expectedUnitPrice" :
                return (item.expectedUnitPrice || 0).toFixed(2).toLocaleString();
            case "unitPrice" :
                return (item.unitPrice || item.expectedUnitPrice || 0).toFixed(2).toLocaleString();
            default:
                return item[column]
        }
    },
    _buildEmptyLine: function (columns) {
        return columns.map(() => {
            return "";
        });
    },

}

export default OrderToCsv;
