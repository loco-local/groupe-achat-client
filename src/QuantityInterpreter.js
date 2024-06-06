const qtyRegex = /([1-9]{1}[0-9]{0,}(\.[0-9]{0,2})?|0(\.[0-9]{0,2})?|\.[0-9]{1,2})/g

const QuantityInterpreter = {
    getQty: function (str) {
        if (str === null) {
            return 1;
        }
        let qty = String(str).replaceAll(",", ".").match(qtyRegex);
        if (qty === null) {
            return 1;
        }
        qty = qty[0];
        return parseFloat(qty.trim());
    },
    allowedFormats: ['kg', 'g', 'lbs', 'ml', 'l'],
    isFormatValid: function (value) {
        if (!value) {
            return true;
        }
        const quantity = QuantityInterpreter.getQty(value)
        const formatOnly = value.replaceAll(",", ".").replace(quantity, '').trim().toLowerCase();
        if (QuantityInterpreter.allowedFormats.indexOf(formatOnly) === -1) {
            return false;
        }
        return true;
    },
    getFormat: function (str) {
        if (str === null) {
            return "unit";
        }
        const lowerCase = String(str).toLowerCase();
        if (lowerCase.indexOf("kg") > -1) {
            return "kg"
        }
        if (lowerCase.indexOf("g") > -1) {
            return "g"
        }
        if (lowerCase.indexOf("lbs") > -1) {
            return "lbs"
        }
        if (lowerCase.indexOf("x") > -1) {
            return "nb"
        }
        if (lowerCase.indexOf("ml") > -1) {
            return "ml"
        }
        if (lowerCase.indexOf("l") > -1) {
            return "L"
        }
        return "unit"
    },
    hasDecimal: function (quantity) {
        return quantity % 1 === 0;
    },
    convertDecimalToFraction: function (decimal, orderItem) {
        if (orderItem.format === null) {
            return 1;
        }
        let qtyInBox = orderItem.qtyInBox;
        if (qtyInBox === null || qtyInBox === undefined) {
            qtyInBox = 1;
        }
        const total = QuantityInterpreter.getQty(orderItem.format) * qtyInBox;
        return QuantityInterpreter._roundNumber(decimal * total, 2);
    },
    convertFractionToDecimal: function (fraction, orderItem) {
        const total = QuantityInterpreter.getQty(orderItem.format) * orderItem.qtyInBox;
        return fraction / total;
    },
    calculatePricePerUnit: function (wholePrice, qtyInBox, format) {
        return wholePrice / (qtyInBox * QuantityInterpreter.getQty(format))
    },
    _roundNumber(number, decimal_digit) {
        let powerOften = Math.pow(10, decimal_digit);
        return Math.round(number * powerOften) / powerOften;
    }
};

export default QuantityInterpreter;
