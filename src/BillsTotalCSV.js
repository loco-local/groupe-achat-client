import I18n from "@/i18n";
import ExportToCsv from "@/ExportToCsv";

const text = {
    member: "Membre",
    internalId: "ID",
    total: "Total",
    filename: "résumé-facture-groupe-achat"
}
I18n.i18next.addResources("fr", "billsTotalCsv", text);
I18n.i18next.addResources("en", "billsTotalCsv", text);

const colums = [
    'member',
    'internalId',
    'total'
]

const BillsTotalCSV = {
    doExport: function (memberOrders) {
        const t = I18n.i18next.getFixedT();
        let data = [[]];
        colums.forEach((column) => {
            data[0].push(
                t('billsTotalCsv:' + column)
            )
        })
        memberOrders.forEach((memberOrder) => {
            const member = memberOrder.Member;
            let total = memberOrder.total === null || memberOrder.total === undefined ? memberOrder.expectedTotal : memberOrder.total;
            if (total === null || total === undefined) {
                total = 0
            }
            data.push(
                [
                    member.firstname + " " + member.lastname,
                    member.id,
                    total
                ]
            );
        });
        ExportToCsv.build(
            t('billsTotalCsv:filename'),
            data
        );
    }
}

export default BillsTotalCSV;
