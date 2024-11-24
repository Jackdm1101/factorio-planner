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

    getRawMaterials() {
        const materialsArr = [];
        this.#productsArr.forEach(product => {
            recipes[product.product].ingredients.forEach(ingredient => {
                materialsArr.push({
                    product: ingredient.name,
                    outputPerSec: ingredient.amount * product.outputPerSec
                });
            });
        });
        for (let i = 0; i < materialsArr.length; i += 1) {
            const material = materialsArr[i];
            const recipe = recipes[material.product];
            if (recipe === undefined) continue;

            recipe.ingredients.forEach(ingredient => {
                const output = recipe.results.find(
                    result => result.name === material.product
                );
                materialsArr.push({
                    product: ingredient.name,
                    outputPerSec: material.outputPerSec * (ingredient.amount / output.amount)
                });
            });
        }
        console.log(materialsArr);
        return materialsArr;
    }
};
