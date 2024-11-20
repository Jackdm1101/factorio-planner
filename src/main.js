import recipes from './recipes.json' with { type: "json" };

export class ProductionChain {
    #productsArr = [];

    addProduct(productStr, outputPerSec) {
        if (!recipes[productStr]) throw new Error('Product not found');
        this.#productsArr.push({product: productStr, outputPerSec});
    }
};
