import recipes from './recipes.json' with { type: "json" };

export class RecipeTree {
    #nodes = []
    static create(itemNameStr, itemsPerSec) {
        this.#validate(itemNameStr, itemsPerSec);

        const tree = new RecipeTree;
        tree.#setup(itemNameStr, itemsPerSec);
        return tree;
    }

    static #validate(itemNameStr, itemsPerSec) {
        if (typeof itemNameStr !== 'string' || typeof itemsPerSec !== 'number')
            throw new Error('Unexpected type');
        if (itemsPerSec <= 0)
            throw new Error(`Invalid outputPerSec: ${itemsPerSec}`);
        if (!recipes[itemNameStr])
            throw new Error(`Product "${itemNameStr}" not found`);
    }

    #setup(itemNameStr, itemsPerSec) {
        this.#nodes.push({itemName: itemNameStr, perSec: itemsPerSec, prev: [] });
        const nodeIndicesQueue = [0];

        while (nodeIndicesQueue.length !== 0) {
            const nodeIndex = nodeIndicesQueue.shift();
            const node = this.#nodes[nodeIndex];
            const recipe = recipes[node.itemName];

            recipe.ingredients.forEach(ingredient => {
                const result = recipe.results.find(
                    result => result.name === node.itemName
                );
                const newNodeIndex = this.#nodes.length;
                this.#nodes.push({
                    itemName: ingredient.name,
                    perSec: node.perSec * (ingredient.amount / result.amount),
                    prev: []
                });
                this.#nodes[nodeIndex].prev.push(newNodeIndex);

                if (recipes[ingredient.name])
                    nodeIndicesQueue.push(newNodeIndex);
            });
        }
    }

    getRawList() {
        return this.#nodes.reduce((acc, node) => {
            if (node.prev.length === 0)
                acc.push({ item: node.itemName, perSec: node.perSec });
            return acc;
        }, []);
    }

    getData() {
        return this.#nodes;
    }
}