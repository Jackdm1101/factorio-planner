import { ProductionChain } from '../src/main';
import { getTypesArrayExcept } from './randomTestData';

describe('Class: ProductionChain', () => {
    const chain = new ProductionChain;

    describe('Method: addProduct()', () => {
        it('should not add a product that does not exist', () => {
            expect(() => chain.addProduct('invalid-product', 5))
                .toThrow(`Product invalid-product not found`);
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
    });
});
