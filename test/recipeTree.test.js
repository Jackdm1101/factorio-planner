import { RecipeTree } from '../src/recipeTree';

describe(RecipeTree.name, () => {
    describe(RecipeTree.create.name, () => {
        it('should given 1 iron plate / sec create expected tree', () => {
            const tree = RecipeTree.create('iron-plate', 1);
            expect(tree.getData()).toEqual([
                { itemName: 'iron-plate', perSec: 1, prev: [1] },
                { itemName: 'iron-ore', perSec: 1, prev: [] }
            ])
        });

        it('should given 1 pipe / sec create expected tree', () => {
            const tree = RecipeTree.create('pipe', 1);
            expect(tree.getData()).toEqual([
                { itemName: 'pipe', perSec: 1, prev: [1] },
                { itemName: 'iron-plate', perSec: 1, prev: [2] },
                { itemName: 'iron-ore', perSec: 1, prev: [] }
            ])
        });

        it('should given 1 pipe-to-ground create expected tree', () => {
            const tree = RecipeTree.create('pipe-to-ground', 1);
            expect(tree.getData()).toEqual([
                { itemName: 'pipe-to-ground', perSec: 1, prev: [1,2] },
                { itemName: 'pipe', perSec: 5, prev: [3] },
                { itemName: 'iron-plate', perSec: 2.5, prev: [4] },
                { itemName: 'iron-plate', perSec: 5, prev: [5] },
                { itemName: 'iron-ore', perSec: 2.5, prev: [] },
                { itemName: 'iron-ore', perSec: 5, prev: [] }
            ])
        });
    });
});