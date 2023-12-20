import I18n from "@/i18n";
import ExportToCsv from "@/ExportToCsv";
import ProductTranslation from "@/ProductTranslation";
import OrderItem from "@/OrderItem";

ProductTranslation.setup();

const TYPE = {
    memberOrder: {
        name: "MEMBER_ORDER",
        columns: [
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
        ]
    },
    providerOrder: {
        name: "PROVIDER_ORDER",
        columns: [
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
        ]
    },
    onlyItems: {
        name: "ONLY_ITEMS",
        fileName: "items-groupe-achat",
        columns: [
            "name",
            "format",
            "qtyInBox",
            "expectedCostUnitPrice",
            "category",
            "internalCode",
            "maker",
            "provider"
        ]
    }
}

const OrderToCsv = {
    exportForProviderOrder: function (items, total) {
        OrderToCsv._build(
            items,
            TYPE.providerOrder,
            {
                total: total
            }
        );
    },
    exportForMemberOrder: function (items, buyGroupOrder) {
        OrderToCsv._build(
            items,
            TYPE.memberOrder,
            {
                buyGroupOrder: buyGroupOrder
            }
        );
    },
    exportForOnlyItems: function (items) {
        OrderToCsv._build(
            items,
            TYPE.onlyItems
        );
    },
    _build: function (items, type, optionalData) {
        if (items.length === 0) {
            return;
        }
        optionalData = optionalData || {};
        let total = optionalData.total;
        if (type.name !== TYPE.onlyItems.name) {
            if (total === undefined) {
                const memberOrder = items[0].MemberOrder;
                total = memberOrder.total || memberOrder.expectedTotal;
            }
        }
        const t = I18n.i18next.getFixedT();
        const isForMember = type.name === TYPE.memberOrder.name;
        let columns = type.columns;
        let data = [[]];
        columns.forEach((column) => {
            data[0].push(t(
                OrderToCsv._getLabelKeyForColumn(
                    column
                ))
            );
        })
        let fileName = type.fileName;
        if (fileName === undefined) {
            fileName = isForMember ? items[0].personFullname : items[0].provider;
        }
        fileName += ".csv";
        items.forEach((item) => {
            data.push(
                columns.map((columnName) => {
                    return OrderToCsv._getValueForColumn(columnName, item, isForMember)
                })
            );
        });
        data.push(OrderToCsv._buildEmptyLine(columns));
        let lastLine = OrderToCsv._buildEmptyLine(columns);
        if (total !== undefined) {
            lastLine.pop();
            lastLine.pop();
            lastLine.push(t('total'));
            lastLine.push(total + "$");
        }
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
    _getValueForColumn: function (column, item, isForMember) {
        switch (column) {
            case "expectedQuantity" :
                return (item.expectedQuantity || 0).toFixed(2).toLocaleString() +
                    (isForMember ? " (" + item.expectedQuantityInput + ")" : "")
            case "quantity" :
                return OrderItem.getQty(item).toFixed(2).toLocaleString() +
                    (
                        isForMember ? " (" + (item.quantity === undefined || item.quantity === null ? item.expectedQuantityInput : item.quantityInput) + ")"
                            : ""
                    )

            case "expectedTotalAfterRebateWithTaxes" :
                return (item.expectedTotalAfterRebateWithTaxes || 0).toFixed(2).toLocaleString() + "$";
            case "totalAfterRebateWithTaxes" :
                return (
                    item.totalAfterRebateWithTaxes === undefined || item.totalAfterRebateWithTaxes === null ?
                        item.expectedTotalAfterRebateWithTaxes || 0 : item.totalAfterRebateWithTaxes
                ).toFixed(2).toLocaleString() + "$";
            case "costTotal":
                return (item.costTotal || 0).toFixed(2).toLocaleString() + "$";
            case "tps" :
                return (item.tps || 0).toFixed(2).toLocaleString() + "$";
            case "tvq" :
                return (item.tvq || 0).toFixed(2).toLocaleString() + "$";
            case "totalAfterRebate" :
                return (
                    item.totalAfterRebate === undefined || item.totalAfterRebate === null ?
                        item.expectedTotalAfterRebate || 0 : item.totalAfterRebate
                ).toFixed(2).toLocaleString() + "$";
            case "expectedUnitPrice" :
                return (item.expectedUnitPrice || 0).toFixed(2).toLocaleString() + "$";
            case "unitPrice" :
                return (item.unitPrice || item.expectedUnitPrice || 0).toFixed(2).toLocaleString() + "$";
            default:
                return item[column] === null || item[column] === undefined ? "" : item[column]
        }
    },
    _buildEmptyLine: function (columns) {
        return columns.map(() => {
            return "";
        });
    }

}

export default OrderToCsv;
