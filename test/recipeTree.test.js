import { getTypesArrayExcept } from './testData';
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

        it('should not add a product that does not exist', () => {
            expect(() => RecipeTree.create('invalid-product', 5))
                .toThrow('Product "invalid-product" not found');
        });

        it.each(getTypesArrayExcept('string'))
            (`should throw "Unexpected type" if productStr is: %p`, (productStrInput) => {
                expect(() => RecipeTree.create(productStrInput, 5))
                    .toThrow('Unexpected type');
            });

        it.each(getTypesArrayExcept('number'))
            (`should throw "Unexpected type" if outputPerSec is: %p`, (outputPerSec) => {
                expect(() => RecipeTree.create('speed-module', outputPerSec))
                    .toThrow('Unexpected type');
            });

        it('should throw "Invalid outputPerSec" if given 0 or less', () => {
            expect(() => RecipeTree.create('speed-module', 0))
                .toThrow('Invalid outputPerSec: 0');
        });
    });

    describe(RecipeTree.prototype.getRawList, () => {
        it('should given 1 iron plate list 1 iron ore', () => {
            const tree = RecipeTree.create('iron-plate', 1);
            expect(tree.getRawList()).toEqual([{ itemName: 'iron-ore', perSec: 1 }]);
        });

        it('should correctly create list raw materials for ', () => {
            const tree = RecipeTree.create('construction-robot', 1);
            expect(tree.getRawList()).toEqual([
                { "itemName": "iron-ore", "perSec": 23.8 },
                { "itemName": "heavy-oil", "perSec": 15 },
                { "itemName": "water", "perSec": 140 },
                { "itemName": "copper-ore", "perSec": 12.5 },
                { "itemName": "petroleum-gas", "perSec": 60 }
            ]);
        });
    });
});