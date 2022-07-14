import ExportToCsv from "@/ExportToCsv";
import I18n from "@/i18n";
import ProductTranslation from "@/ProductTranslation";
ProductTranslation.setup();
const MemberOrder = {
    exportToCsv: function (items) {
        if (items.length === 0) {
            return;
        }
        const t = I18n.i18next.getFixedT();
        let data = [
            [
                t('product:expectedQuantityShort'),
                t('product:qtyShortFinal'),
                t('product:expectedTotal'),
                t('product:totalFinal'),
                t('product:tps'),
                t('product:tvq'),
                t('product:totalWithoutTaxes'),
                t('product:name'),
                t('product:format'),
                t('product:qtyInBox'),
                t('product:expectedUnitPrice'),
                t('product:unitPrice'),
                t('product:category'),
                t('product:internalCode'),
                t('product:maker'),
                t('product:provider')
            ]
        ];
        let fileName = items[0].personFullname + ".csv";
        items.forEach((item) => {
            data.push([
                (item.expectedQuantity || 0).toLocaleString(),
                (item.quantity || item.expectedQuantity).toLocaleString(),
                (item.expectedTotalAfterRebateWithTaxes || 0).toFixed(2).toLocaleString(),
                (item.totalAfterRebateWithTaxes || item.expectedTotalAfterRebateWithTaxes || 0).toFixed(2).toLocaleString(),
                (item.tps || 0).toFixed(2).toLocaleString(),
                (item.tvq || 0).toFixed(2).toLocaleString(),
                (item.totalAfterRebate || item.expectedTotalAfterRebate || 0).toFixed(2).toLocaleString(),
                item.description,
                item.format,
                item.qtyInBox,
                (item.expectedUnitPrice || 0).toFixed(2).toLocaleString(),
                (item.unitPrice || item.expectedUnitPrice || 0).toFixed(2).toLocaleString(),
                item.category,
                item.internalCode,
                item.maker,
                item.provider
            ])
        })
        data.push([
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ]);
        const memberOrder = items[0].MemberOrder;
        data.push([
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            t('total'),
            memberOrder.total || memberOrder.expectedTotal
        ])
        ExportToCsv.build(fileName, data);
    }
}

export default MemberOrder;
