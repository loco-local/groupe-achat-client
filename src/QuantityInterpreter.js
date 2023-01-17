const qtyRegex = /([1-9]{1}[0-9]{0,}(\.[0-9]{0,2})?|0(\.[0-9]{0,2})?|\.[0-9]{1,2})/g

const QuantityInterpreter = {
    getQty: function (str) {
        let qty = str.replaceAll(",", ".").match(qtyRegex);
        if (qty === null) {
            return null;
        }
        qty = qty[0];
        return parseFloat(qty.trim());
    },
    getFormat: function (str) {
        if (str === null) {
            return "unit";
        }
        const lowerCase = str.toLowerCase();
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
        if (lowerCase.indexOf("l") > -1) {
            return "L"
        }
        return "unit"
    },
    hasDecimal: function (quantity) {
        return quantity % 1 === 0;
    },
    convertDecimalToFraction: function (decimal, orderItem) {
        const total = QuantityInterpreter.getQty(orderItem.format) * orderItem.qtyInBox;
        return QuantityInterpreter._roundNumber(decimal * total, 2);
    },
    convertFractionToDecimal: function (fraction, orderItem) {
        const total = QuantityInterpreter.getQty(orderItem.format) * orderItem.qtyInBox;
        return fraction / total;
    },
    _roundNumber(number, decimal_digit) {
        let powerOften = Math.pow(10, decimal_digit);
        return Math.round(number * powerOften) / powerOften;
    }
};

export default QuantityInterpreter;
