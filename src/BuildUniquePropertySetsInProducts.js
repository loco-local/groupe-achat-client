export default {
    build: function (products) {
        const categoriesSet = new Set();
        const providersSet = new Set();
        const makersSet = new Set();
        products.forEach((product) => {
            categoriesSet.add(product.category)
            providersSet.add(product.provider);
            makersSet.add(product.maker);
        })
        return {
            categories: Array.from(categoriesSet),
            providers: Array.from(providersSet),
            makers: Array.from(makersSet)
        }
    }
}
