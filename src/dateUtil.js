import {format} from 'date-fns'
import {fr} from 'date-fns/locale'

const dateUtil = {
    setup: function (app) {
        app.config.globalProperties.$filters.date = function (value) {
            if (value) {
                return format(
                    new Date(String(value)),
                    'd MMMM yyyy, HH:mm:ss',
                    {
                        locale: fr
                    }
                )
            }
        }
        app.config.globalProperties.$filters.dayDate = dateUtil.getDayDate
        app.config.globalProperties.$filters.dayNoYearDate = dateUtil.getDayNoYearDate
    },
    getDayDate: function (value) {
        if (value) {
            return format(
                new Date(String(value)),
                'd MMMM yyyy',
                {
                    locale: fr
                }
            )
        }
    },
    getDayNoYearDate: function (value) {
        if (value) {
            return format(
                new Date(String(value)),
                'd MMMM',
                {
                    locale: fr
                }
            )
        }
    },
    formatForDatePicker: function (value) {
        if (value) {
            return format(
                new Date(String(value)),
                'yyyy-MM-dd',
                {
                    locale: fr
                }
            )
        }
    },
    areDatesSameDay: function (d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getUTCDate() === d2.getUTCDate();
    }
}

export default dateUtil
