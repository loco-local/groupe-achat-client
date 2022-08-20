const BuyGroup = {};

BuyGroup.getSubscriptionUrl = function (buyGroupPath) {
    return BuyGroup._getBasePath(buyGroupPath) + "/inscription";
}

BuyGroup.getProductsUrl = function (buyGroupPath) {
    return BuyGroup._getBasePath(buyGroupPath) + "/produits";
}

BuyGroup._getBasePath = function (buyGroupPath) {
    return window.location.href.substring(
        0,
        window.location.href.lastIndexOf(window.location.pathname)
    ) + "/" + buyGroupPath;
}

export default BuyGroup;
