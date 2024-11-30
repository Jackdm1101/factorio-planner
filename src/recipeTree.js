import recipes from './recipes.json' with { type: "json" };

export class RecipeTree {
    #data = []
    static create(itemNameStr, itemsPerSec) {
        const tree = new RecipeTree;
        tree.#setup(itemNameStr, itemsPerSec);
        return tree;
    }

    #setup(itemNameStr, itemsPerSec) {
        this.#data.push({item: itemNameStr, perSec: itemsPerSec, prev: [] });
        const dataIndicesQueue = [0];

        while (dataIndicesQueue.length !== 0) {
            const dataIndex = dataIndicesQueue.shift();
            const data = this.#data[dataIndex];
            const recipe = recipes[data.item];

            recipe.ingredients.forEach(ingredient => {
                const result = recipe.results.find(
                    result => result.name === data.item
                );
                const newIndex = this.#data.length;
                this.#data.push({
                    item: ingredient.name,
                    perSec: data.perSec * (ingredient.amount / result.amount),
                    prev: []
                });
                this.#data[dataIndex].prev.push(newIndex);

                if (!recipes[ingredient.name]) return;
                dataIndicesQueue.push(newIndex);
            });
        }
    }

    getData() {
        return this.#data;
    }
}