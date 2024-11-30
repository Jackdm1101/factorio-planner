import { ProductionChain } from '../src/main';
import { getTypesArrayExcept } from './testData';

describe('Class: ProductionChain', () => {
    let chain;

    beforeEach(() => {
        chain = new ProductionChain;
    });

    describe('Method: addProduct()', () => {
        it('should not add a product that does not exist', () => {
            expect(() => chain.addProduct('invalid-product', 5))
                .toThrow('Product "invalid-product" not found');
        });

        it.each(getTypesArrayExcept('string'))
            (`should throw "Unexpected type" if productStr is: %p`, (productStrInput) => {
                expect(() => chain.addProduct(productStrInput, 5))
                    .toThrow('Unexpected type');
            });

        it.each(getTypesArrayExcept('number'))
            (`should throw "Unexpected type" if outputPerSec is: %p`, (outputPerSec) => {
                expect(() => chain.addProduct('speed-module', outputPerSec))
                    .toThrow('Unexpected type');
            });

        it('should throw "Invalid outputPerSec" if given 0 or less', () => {
            expect(() => chain.addProduct('speed-module', 0))
                .toThrow('Invalid outputPerSec: 0');
        });

        it('should add a valid product with a valid output to the chain', () => {
            chain.addProduct('speed-module', 5);
            expect(chain.getProducts()).toEqual([{ product: 'speed-module', outputPerSec: 5 }]);
        });
    });

    describe('Method: getRawMaterials()', () => {
        it('should return 5 stone per sec when given 1 stone-furnace per sec', () => {
            chain.addProduct('stone-furnace', 1);
            expect(chain.getRawMaterials()).toEqual([{ product: 'stone', outputPerSec: 5 }]);
        });

        it('should return 50 stone per sec when given 10 stone-furnace per sec', () => {
            chain.addProduct('stone-furnace', 10);
            expect(chain.getRawMaterials()).toEqual([{ product: 'stone', outputPerSec: 50 }]);
        });

        it('should correctly return steps to produce 1 electronic circuit per sec', () => {
            chain.addProduct('electronic-circuit', 1);
            expect(chain.getRawMaterials()).toEqual([
                { product: 'iron-plate', outputPerSec: 1 },
                { product: 'copper-cable', outputPerSec: 3 },
                { product: 'iron-ore', outputPerSec: 1 },
                { product: 'copper-plate', outputPerSec: 1.5 },
                { product: 'copper-ore', outputPerSec: 1.5 }
            ]);
        });

        it('should correctly return steps to produce 1 pipe-to-ground per sec', () => {
            chain.addProduct('pipe-to-ground', 1);
            expect(chain.getRawMaterials()).toEqual([
                { product: 'pipe', outputPerSec: 5 },
                { product: 'iron-plate', outputPerSec: 7.5 },
                { product: 'iron-ore', outputPerSec: 7.5 }
            ]);
        });

        it('should correctly return steps to produce 4 pipe-to-ground per sec', () => {
            chain.addProduct('pipe-to-ground', 4);
            expect(chain.getRawMaterials()).toEqual([
                { product: 'pipe', outputPerSec: 20 },
                { product: 'iron-plate', outputPerSec: 30 },
                { product: 'iron-ore', outputPerSec: 30 }
            ]);
        });

        it('should correctly create steps to make multiple products', () => {
            chain.addProduct('transport-belt', 1);
            chain.addProduct('offshore-pump', 1);
            // console.log('final run');
            expect(chain.getRawMaterials()).toEqual(expect.arrayContaining([
                { product: 'iron-plate', outputPerSec: 8.5 },
                { product: 'iron-gear-wheel', outputPerSec: 2.5 },
                { product: 'iron-ore', outputPerSec: 8.5 },
                { product: 'pipe', outputPerSec: 3 }
            ]));
        });
    });
});
