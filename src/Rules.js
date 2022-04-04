import I18n from '@/i18n'

const floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
export default {
    required: function (value) {
        return !!value || I18n.i18next.t('required')
    },
    email: function (value) {
        /* eslint-disable */
        if (!value) {
            return true
        }
        var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || I18n.i18next.t('invalidEmail')
    },
    min8Char: function (value) {
        if (!value) {
            return true;
        }
        return value.length >= 8 || I18n.i18next.t('min8Char');
    },
    max255Char: function (value) {
        if (!value) {
            return true;
        }
        return value.length <= 255 || I18n.i18next.t('max255Char');
    },
    isFloat: function (value) {
        if (!floatRegex.test(value)) {
            return false;
        }
        const val = parseFloat(value);
        return isNaN(val);
    },
    noSpace: function (value) {
        if (!value) {
            return true;
        }
        return value.indexOf(" ") === -1 || I18n.i18next.t('noSpace');
    },
    min1: function(value){
        if (!value) {
            return true;
        }
        return value > 0 || I18n.i18next.t('min1');
    }
}
