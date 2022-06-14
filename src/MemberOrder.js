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
                t('product:qty'),
                t('total'),
                t('product:name'),
                t('product:format'),
                t('product:qtyInBox'),
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
                item.orderQuantity,
                item.totalPriceAfterRebate.toFixed(2),
                item.description,
                item.format,
                item.qtyInBox,
                item.price.toFixed(2),
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
            ""
        ]);
        data.push([
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            t('total'),
            items[0].UserOrder.totalPrice
        ])
        ExportToCsv.build(fileName, data);
    }
}

export default MemberOrder;
