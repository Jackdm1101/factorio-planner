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
        it('should return 2 iron-plate per sec when given 1 iron-gear-wheel per sec', () => {
            chain.addProduct('iron-gear-wheel', 1);
            expect(chain.getRawMaterials()).toEqual([{ product: 'iron-plate', inputPerSec: 2 }]);
        });
    });
});
