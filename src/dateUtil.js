import {format} from 'date-fns'
import {fr} from 'date-fns/locale'
import Vue from 'vue'

const dateUtil = {
    setup: function () {
        Vue.filter('date', function (value) {
            if (value) {
                return format(
                    new Date(String(value)),
                    'd MMMM yyyy, HH:mm:ss',
                    {
                        locale: fr
                    }
                )
            }
        })
        Vue.filter('dayDate', dateUtil.getDayDate)
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
    areDatesSameDay: function (d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getUTCDate() === d2.getUTCDate();
    }
}

export default dateUtil
