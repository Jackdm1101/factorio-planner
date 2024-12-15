import recipes from './recipes.json' with { type: "json" };

export class RecipeTree {
    #nodes = []
    static create(itemNameStr, itemsPerSec) {
        const tree = new RecipeTree;
        tree.#setup(itemNameStr, itemsPerSec);
        return tree;
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

    getData() {
        return this.#nodes;
    }
}