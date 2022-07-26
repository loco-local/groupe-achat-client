import I18n from "@/i18n";
import ExportToCsv from "@/ExportToCsv";
import ProductTranslation from "@/ProductTranslation";

ProductTranslation.setup();
const PROVIDER_ORDER_COLUMNS = [
    "quantity",
    "totalAfterRebateWithTaxes",
    "tps",
    "tvq",
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
    exportForProviderOrder: function (items) {
        OrderToCsv._buildForProviderOrMemberOrder(
            items,
            false
        );
    },
    exportForMemberOrder: function (items) {
        OrderToCsv._buildForProviderOrMemberOrder(
            items,
            true
        );
    },
    _buildForProviderOrMemberOrder: function (items, isForMember) {
        if (items.length === 0) {
            return;
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
        const memberOrder = items[0].MemberOrder;
        let lastLine = OrderToCsv._buildEmptyLine(columns);
        lastLine.pop();
        lastLine.pop();
        lastLine.push(t('total'));
        lastLine.push(memberOrder.total || memberOrder.expectedTotal);
        data.push(lastLine)
        console.log(JSON.stringify(data))
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
            default:
                return 'product:' + column;
        }
    },
    _getValueForColumn: function (column, item) {
        switch (column) {
            case "expectedQuantity" :
                return (item.expectedQuantity || 0).toLocaleString()
            case "quantity" :
                return (item.quantity || item.expectedQuantity).toLocaleString();
            case "expectedTotalAfterRebateWithTaxes" :
                return (item.expectedTotalAfterRebateWithTaxes || 0).toFixed(2).toLocaleString();
            case "totalAfterRebateWithTaxes" :
                return (item.totalAfterRebateWithTaxes || item.expectedTotalAfterRebateWithTaxes || 0).toFixed(2).toLocaleString();
            case "tps" :
                return (item.tps || 0).toFixed(2).toLocaleString();
            case "tvq" :
                return (item.tvq || 0).toFixed(2).toLocaleString();
            case "totalAfterRebate" :
                return (item.totalAfterRebate || item.expectedTotalAfterRebate || 0).toFixed(2).toLocaleString();
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
