import ExportToCsv from "@/ExportToCsv";
import I18n from "@/i18n";

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
                t('product:expectedPrice'),
                t('product:price'),
                t('product:category'),
                t('product:internalCode'),
                t('product:maker'),
                t('product:provider')
            ]
        ];
        let fileName = items[0].personFullname + ".csv";
        items.forEach((item) => {
            data.push([
                item.expectedQuantity,
                item.quantity || item.expectedQuantity,
                item.expectedTotalAfterRebateWithTaxes.toFixed(2),
                (item.totalPriceAfterRebateWithTaxes || item.expectedTotalAfterRebateWithTaxes).toFixed(2),
                item.tps.toFixed(2),
                item.tvq.toFixed(2),
                (item.totalPriceAfterRebate || item.expectedTotalAfterRebate).toFixed(2),
                item.description,
                item.format,
                item.qtyInBox,
                item.expectedPrice.toFixed(2),
                (item.price || item.expectedPrice).toFixed(2),
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
