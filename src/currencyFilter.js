import Vue from 'vue'

export default {
    setup: function () {
        Vue.filter('currency', function (value) {
            if (typeof value !== 'number') {
                return value
            }
            let formatter = new Intl.NumberFormat('fr-CA', {
                style: 'currency',
                currency: 'CAD',
                minimumFractionDigits: 2
            })
            const formatted = formatter.format(value);
            if (formatted.indexOf("CA") === -1) {
                return formatted;
            } else {
                return formatted.substring(0, formatted.length - 3);
            }
        })
    }
}
