import recipes from './recipes.json' with { type: "json" };

export class ProductionChain {
    #productsArr = [];

    addProduct(productStr, outputPerSec) {
        if (typeof productStr !== 'string' || typeof outputPerSec !== 'number')
            throw new Error('Unexpected type');
        if (outputPerSec <= 0)
            throw new Error(`Invalid outputPerSec: ${outputPerSec}`);
        if (!recipes[productStr])
            throw new Error(`Product "${productStr}" not found`);
        this.#productsArr.push({product: productStr, outputPerSec});
    }

    getProducts() {
        return this.#productsArr;
    }
};
